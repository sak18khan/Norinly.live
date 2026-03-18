import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let db: admin.firestore.Firestore | null = null;
let auth: admin.auth.Auth | null = null;

const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
      
      if (serviceAccountJson) {
        const serviceAccount = JSON.parse(serviceAccountJson);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase initialized using FIREBASE_SERVICE_ACCOUNT_JSON');
      } else {
        // Fallback to default or GOOGLE_APPLICATION_CREDENTIALS
        admin.initializeApp();
        console.log('Firebase initialized using default credentials or GOOGLE_APPLICATION_CREDENTIALS');
      }
    }
    
    db = admin.firestore();
    auth = admin.auth();
    console.log('Firebase Admin services (Firestore, Auth) ready.');
  } catch (error) {
    console.warn(
      'Firebase Admin initialization failed or skipped. ' +
      'Moderation features and persistence will be limited.',
      (error as Error).message
    );
  }
};

initializeFirebase();

export { db, auth };
