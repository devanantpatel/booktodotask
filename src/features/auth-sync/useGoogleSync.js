import { useEffect, useRef } from 'react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { DriveSyncService } from './driveService';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

export function useGoogleSync() {
  const { 
    todos, notebook, notes,
    isGoogleConnected, isSyncing, setGoogleConnected, 
    setSyncing, setLastSyncedAt 
  } = useWorkspaceStore();

  const tokenClientRef = useRef(null);
  const accessTokenRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // 1. Initialize Google Identity Token Client
  useEffect(() => {
    if (!CLIENT_ID) return;

    const checkGsi = setInterval(() => {
      if (window.google?.accounts?.oauth2) {
        clearInterval(checkGsi);
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: async (tokenResponse) => {
            if (tokenResponse?.access_token) {
              accessTokenRef.current = tokenResponse.access_token;
              setGoogleConnected(true);
              await handleInitialMigration(tokenResponse.access_token);
            }
          },
        });
      }
    }, 100);

    return () => clearInterval(checkGsi);
  }, [CLIENT_ID]);

  // 2. Initial Migration & Merge (Guest Data -> Drive)
  const handleInitialMigration = async (token) => {
    try {
      setSyncing(true);
      const drive = new DriveSyncService(token);
      const existingFileId = await drive.findWorkspaceFile();

      const localPayload = {
        todos: useWorkspaceStore.getState().todos,
        notebook: useWorkspaceStore.getState().notebook,
        notes: useWorkspaceStore.getState().notes,
        syncedAt: new Date().toISOString()
      };

      if (!existingFileId) {
        // Cloud par file nahi hai: Local guest data direct upload
        await drive.saveWorkspace(localPayload);
      } else {
        // Cloud par data hai: Merge logic
        const cloudData = await drive.downloadWorkspace(existingFileId);

        const mergedTodos = [...(cloudData.todos || [])];
        localPayload.todos.forEach((localItem) => {
          if (!mergedTodos.some((t) => t.id === localItem.id)) {
            mergedTodos.push(localItem);
          }
        });

        const mergedNotes = [...(cloudData.notes || [])];
        localPayload.notes.forEach((localNote) => {
          if (!mergedNotes.some((n) => n.id === localNote.id)) {
            mergedNotes.push(localNote);
          }
        });

        const mergedPayload = {
          todos: mergedTodos,
          notebook: cloudData.notebook || localPayload.notebook,
          notes: mergedNotes,
          syncedAt: new Date().toISOString()
        };

        // Update local state and upload merged copy to Drive
        useWorkspaceStore.setState({
          todos: mergedPayload.todos,
          notebook: mergedPayload.notebook,
          notes: mergedPayload.notes
        });

        await drive.saveWorkspace(mergedPayload);
      }

      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Migration error:', err);
    } finally {
      setSyncing(false);
    }
  };

  // 3. Auto-save Debounce when state changes
  useEffect(() => {
    if (!isGoogleConnected || !accessTokenRef.current) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSyncing(true);
        const drive = new DriveSyncService(accessTokenRef.current);
        const payload = {
          todos,
          notebook,
          notes,
          syncedAt: new Date().toISOString()
        };
        await drive.saveWorkspace(payload);
        setLastSyncedAt(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Auto sync error:', err);
      } finally {
        setSyncing(false);
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(saveTimeoutRef.current);
  }, [todos, notebook, notes, isGoogleConnected]);

  const loginWithGoogle = () => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken({ prompt: 'consent' });
    } else {
      alert('Google Auth Client load ho raha hai ya Client ID set nahi hai.');
    }
  };

  const disconnectGoogle = () => {
    accessTokenRef.current = null;
    setGoogleConnected(false);
  };

  return { loginWithGoogle, disconnectGoogle };
}