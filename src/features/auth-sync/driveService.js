// Google Drive appDataFolder API Service
const FILE_NAME = 'booktodotask_workspace.json';
const DRIVE_APP_DATA_SCOPE = 'https://www.googleapis.com/auth/drive.appdata';

export class DriveSyncService {
  constructor(accessToken) {
    this.token = accessToken;
  }

  getHeaders(contentType = 'application/json') {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': contentType,
    };
  }

  // 1. Find existing workspace file in appDataFolder
  async findWorkspaceFile() {
    const q = encodeURIComponent(`name = '${FILE_NAME}' and 'appDataFolder' in parents and trashed = false`);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id,name)`, {
      headers: this.getHeaders(),
    });
    const data = await res.json();
    return data.files && data.files.length > 0 ? data.files[0].id : null;
  }

  // 2. Download existing workspace data from Drive
  async downloadWorkspace(fileId) {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: this.getHeaders(),
    });
    return await res.json();
  }

  // 3. Upload or update workspace data
  async saveWorkspace(workspaceData) {
    const existingFileId = await this.findWorkspaceFile();
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: FILE_NAME,
      mimeType: 'application/json',
      parents: existingFileId ? undefined : ['appDataFolder'],
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(workspaceData) +
      closeDelimiter;

    let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    let method = 'POST';

    if (existingFileId) {
      url = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`;
      method = 'PATCH';
    }

    const res = await fetch(url, {
      method,
      headers: this.getHeaders(`multipart/related; boundary=${boundary}`),
      body: multipartRequestBody,
    });

    return await res.json();
  }
}