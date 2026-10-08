// import {initializeApp} from 'firebase/app';
// import {getFirestore} from 'firebase/firestore';
// import {getAuth} from 'firebase/auth';
// const app=initializeApp({
//   apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   appId:import.meta.env.VITE_FIREBASE_APP_ID,
// });
// export const db=getFirestore(app);
// export const auth=getAuth(app);

import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {initializeAuth,browserSessionPersistence} from 'firebase/auth';
const app=initializeApp({
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId:import.meta.env.VITE_FIREBASE_APP_ID,
});
export const db=getFirestore(app);
// O login vale só para a ABA atual: assim Caixa e Preparo podem ficar logados
// ao mesmo tempo no mesmo navegador, cada um na sua aba.
export const auth=initializeAuth(app,{persistence:browserSessionPersistence});