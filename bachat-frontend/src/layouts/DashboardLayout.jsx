import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import Topbar from '../components/layout/Topbar.jsx';

/**
 * DashboardLayout — used for every logged-in page: Dashboard, Payment,
 * Wealth Wallet, Investments, AI Advisor, Profile, Premium, Settings.
 * Combines the Sidebar (left nav) with the Topbar and page content.
 */
export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
