import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const RecentlyViewedContext = createContext(null);
const MAX_ITEMS = 12;

export function RecentlyViewedProvider({ children }) {
  const [ids, setIds] = useLocalStorage('uv_recently_viewed', []);

  const recordView = (productId) => {
    setIds((prev) => {
      const withoutCurrent = prev.filter((id) => id !== productId);
      return [productId, ...withoutCurrent].slice(0, MAX_ITEMS);
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ ids, recordView }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return ctx;
}
