import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración pública del SDK cliente. No es un secreto: la seguridad real
// depende de las reglas de Firestore y de los usuarios que se creen en la consola.
// Los valores vienen de `.env.local` (ver `.env.example`).
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** `true` si `.env.local` contiene la configuración mínima del SDK. */
export const firebaseConfigurado = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
);

// Sin configuración no inicializamos nada, para que la landing siga funcionando
// y la pantalla de login pueda explicar qué falta.
const app = firebaseConfigurado
  ? getApps().length > 0
    ? getApp()
    : initializeApp(config)
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
