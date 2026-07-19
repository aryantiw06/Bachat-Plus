import { Bell } from 'lucide-react';

/**
 * Topbar — slim bar above the page content inside the dashboard
 * layout. Holds space for notifications and the user's avatar.
 * No real data yet — wired up once auth exists.
 */
export default function Topbar() {
  return (
    <div className="h-16 flex items-center justify-end gap-4 px-6 md:px-10 border-b border-border bg-surface">
      <button className="h-9 w-9 rounded-full flex items-center justify-center text-text-muted hover:bg-navy/5 hover:text-navy transition-colors">
        <Bell size={18} />
      </button>
      <div className="h-9 w-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-semibold">
        U
      </div>
    </div>
  );
}