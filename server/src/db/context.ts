import { AsyncLocalStorage } from 'node:async_hooks';

export const dbModeStorage = new AsyncLocalStorage<'local' | 'cloud'>();

let activeDatabaseMode: 'local' | 'cloud' =
  process.env.MONGODB_URI ? 'cloud' : 'local';

export function setDatabaseMode(mode: 'local' | 'cloud'): void {
  activeDatabaseMode = mode;
}

export function isLocalDbEnabled(): boolean {
  const storeMode = dbModeStorage.getStore();
  if (storeMode) return storeMode === 'local';
  return activeDatabaseMode === 'local';
}
