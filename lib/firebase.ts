import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfigs: Record<string, object> = {
  "myoga-80daa": {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  "myoga-dev": {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_DEV_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_DEV_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_DEV_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_DEV_APP_ID,
  },
};

export function getFirebaseAuth(projectId: string) {
  const config = firebaseConfigs[projectId] ?? firebaseConfigs["myoga-80daa"];
  const appName = projectId;

  const app =
    getApps().find((a) => a.name === appName) ?? initializeApp(config, appName);

  return getAuth(app);
}
