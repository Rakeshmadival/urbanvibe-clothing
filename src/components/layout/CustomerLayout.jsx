import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import FirestoreSyncProvider from '../FirestoreSyncProvider.jsx';

export default function CustomerLayout() {
  return (
    <FirestoreSyncProvider>
      <div className="min-h-screen flex flex-col bg-ivory text-ink">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </FirestoreSyncProvider>
  );
}
