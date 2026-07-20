import Dexie from 'dexie';

export const db = new Dexie('SmartTourDB');

db.version(1).stores({
  trips: '++id, destination, startDate, endDate, savedAt',
});
