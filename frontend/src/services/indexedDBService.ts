// src/services/indexedDBService.ts
export const DB_NAME = 'kigali-women-hub-db';
export const DB_VERSION = 1;

interface DBStores {
  resources: 'resources';
  discussions: 'discussions';
  user: 'user';
}

export const STORES: DBStores = {
  resources: 'resources',
  discussions: 'discussions',
  user: 'user',
};

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.resources)) {
        db.createObjectStore(STORES.resources, { keyPath: '_id' });
      }

      if (!db.objectStoreNames.contains(STORES.discussions)) {
        db.createObjectStore(STORES.discussions, { keyPath: '_id' });
      }

      if (!db.objectStoreNames.contains(STORES.user)) {
        db.createObjectStore(STORES.user, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const addToStore = <T>(
  storeName: keyof typeof STORES,
  data: T
): Promise<T> => {
  return new Promise((resolve, reject) => {
    initDB().then((db) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => {
        resolve(data);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  });
};

export const getFromStore = <T>(
  storeName: keyof typeof STORES,
  id: string
): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    initDB().then((db) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest<T>).result || null);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  });
};

export const getAllFromStore = <T>(
  storeName: keyof typeof STORES
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    initDB().then((db) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest<T[]>).result || []);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  });
};