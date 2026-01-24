import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openBrowser: (url: string, browserPath?: string) =>
    ipcRenderer.invoke('open-browser', url, browserPath),
  getBookmarks: () => ipcRenderer.invoke('get-bookmarks'),
  addBookmark: (bookmark: any) => ipcRenderer.invoke('add-bookmark', bookmark),
  updateBookmark: (id: string, bookmark: any) =>
    ipcRenderer.invoke('update-bookmark', id, bookmark),
  deleteBookmark: (id: string) => ipcRenderer.invoke('delete-bookmark', id),
  incrementVisitCount: (id: string) => ipcRenderer.invoke('increment-visit-count', id),
  clearAllBookmarks: () => ipcRenderer.invoke('clearAllBookmarks'),
  getFolders: () => ipcRenderer.invoke('get-folders'),
  addFolder: (folder: any) => ipcRenderer.invoke('add-folder', folder),
  updateFolder: (id: string, updates: any) => ipcRenderer.invoke('update-folder', id, updates),
  deleteFolder: (id: string) => ipcRenderer.invoke('delete-folder', id),
  clearAllFolders: () => ipcRenderer.invoke('clearAllFolders'),
  getTags: () => ipcRenderer.invoke('get-tags'),
  addTag: (tag: any) => ipcRenderer.invoke('add-tag', tag),
  updateTag: (id: string, updates: any) => ipcRenderer.invoke('update-tag', id, updates),
  deleteTag: (id: string) => ipcRenderer.invoke('delete-tag', id),
  clearAllTags: () => ipcRenderer.invoke('clearAllTags'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  updateSettings: (settings: any) => ipcRenderer.invoke('update-settings', settings)
})
