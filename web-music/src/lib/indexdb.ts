import type { IDBPDatabase } from 'idb';
import { openDB } from 'idb';

interface MyDB {
    myStore: {
        key: string;
        value: any;
        indexes: { 'by-key': string };
    };
}

export async function initDB(): Promise<IDBPDatabase<MyDB>> {
    return openDB<MyDB>('MyDatabase', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('myStore')) {
                db.createObjectStore('myStore');
            }
        },
    });
}

export async function storeData(key: string, data: any): Promise<void> {
    const db = await initDB();
    await db.put('myStore', data, key);
}

export async function retrieveData(key: string): Promise<any> {
    const db = await initDB();
    return db.get('myStore', key);
}