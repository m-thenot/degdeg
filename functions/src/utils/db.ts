import * as admin from 'firebase-admin';
import { IDriver } from '../types/driver';

const converter = <T>() => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

const dataPoint = <T>(collectionPath: string) =>
  admin.firestore().collection(collectionPath).withConverter(converter<T>());

const db = {
  drivers: dataPoint<IDriver>('drivers'),
  cars: dataPoint('cars'),
};

export { db };
export default db;
