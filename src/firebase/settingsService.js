import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './db.js';
import { firebaseConfigured } from './app.js';
import { siteConfig as fallbackConfig } from '../config/siteConfig.js';

const SETTINGS_DOC = 'settings/store';

export function useSettings() {
  const [settings, setSettings] = useState(fallbackConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      doc(db, SETTINGS_DOC),
      (snap) => {
        if (snap.exists()) setSettings({ ...fallbackConfig, ...snap.data() });
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  return { settings, loading };
}

export async function getSettingsOnce() {
  if (!firebaseConfigured) return fallbackConfig;
  const snap = await getDoc(doc(db, SETTINGS_DOC));
  return snap.exists() ? { ...fallbackConfig, ...snap.data() } : fallbackConfig;
}

export async function updateSettings(data) {
  await setDoc(doc(db, SETTINGS_DOC), data, { merge: true });
}
