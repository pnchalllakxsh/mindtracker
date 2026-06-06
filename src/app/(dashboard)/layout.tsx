import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 overflow-auto flex flex-col pb-16 md:pb-0">
        <Header />
        <main className="p-4 md:p-8 flex-1">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
