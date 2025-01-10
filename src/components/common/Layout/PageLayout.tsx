import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBanner from './TopBanner';
import DashboardNav from './DashboardNav';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const location = useLocation();
  const showDashboardNav = !['/profile', '/', '/settings', '/numero-extenso'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#111111]">
      <div className="flex h-screen max-w-[1600px] mx-auto">
        <div className="flex-none">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-50 bg-gray-100 dark:bg-[#111111]">
            <div className="p-8 pb-2">
              <TopBanner />
            </div>
          </div>
          <div className="px-8 pb-8">
            {showDashboardNav && <DashboardNav />}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}