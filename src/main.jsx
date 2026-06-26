import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { initFirestoreSync } from './firebase/firestoreCache.js';
import './index.css';

// Starts the real-time products/categories/collections listeners immediately,
// independent of whichever route the app happens to land on first.
initFirestoreSync();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </RecentlyViewedProvider>
        </WishlistProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);

