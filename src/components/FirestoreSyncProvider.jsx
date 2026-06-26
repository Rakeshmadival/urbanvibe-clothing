import { useState, useEffect } from 'react';
import { subscribeToCacheChanges, isCacheReady } from '../firebase/firestoreCache.js';
import FullPageLoader from './common/FullPageLoader.jsx';

export default function FirestoreSyncProvider({ children }) {
  const [, forceRerender] = useState(0);
  const [ready, setReady] = useState(isCacheReady());

  useEffect(() => {
    const unsubscribe = subscribeToCacheChanges(() => {
      forceRerender((n) => n + 1);
      setReady(isCacheReady());
    });
    return unsubscribe;
  }, []);

  if (!ready) return <FullPageLoader />;
  return children;
}
