import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage

const firebaseConfig = {
  apiKey: 'AIzaSyDXKGo5YOtmsWRZSYG_WMvPEw0pnYQU_9k',
  authDomain: 'agriapp-aa25a.firebaseapp.com',
  projectId: 'agriapp-aa25a',
  appId: '1:409906225442:android:72bbca91f5f1716079857b',
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
