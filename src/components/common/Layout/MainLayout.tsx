import { ReactNode } from 'react';
import Sidebar from '@/components/common/Layout/Sidebar';
import TopBanner from '@/components/common/Layout/TopBanner';
import DashboardNav from '@/components/common/Layout/DashboardNav';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
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