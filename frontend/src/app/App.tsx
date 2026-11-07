import React, { useEffect, useState, Suspense } from 'react';
import { ArrowLeftRight, ClipboardCheck, Home, Map, Menu, PenTool, Search, Shield, Loader2 } from 'lucide-react';
import { useBrowserUrl, pageFromUrl, navigateUrl, pathFor } from './services/navigation';
import { Page } from './data/basicData';
import { translationEnabled } from './services/features';
import { AuthProvider, AccountButton, useAuth } from './components/auth/AuthProvider';
import { lazyScreen } from './services/staleBuild';

const HomePage = lazyScreen(() => import('./screens/HomePage'));
const LearningPage = lazyScreen(() => import('./screens/LearningPage'));
const TestsPage = lazyScreen(() => import('./screens/TestsPage'));
const TranslatePage = lazyScreen(() => import('./screens/TranslatePage'));
const DictionaryPage = lazyScreen(() => import('./screens/DictionaryPage'));
const WritingPage = lazyScreen(() => import('./screens/WritingPage'));
const AdminPage = lazyScreen(() => import('./screens/AdminPage'));

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const href = useBrowserUrl();
  const page = pageFromUrl(href);
  const [menuOpen, setMenuOpen] = useState(false);

  // Old links to /home land on the root address, which is the home page.
  useEffect(() => {
    if (window.location.pathname === '/home') navigateUrl('/' + window.location.search + window.location.hash, true);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [href]);

  const navLinks: { label: string; page: Page; icon: React.ReactNode }[] = [
    { label: 'Trang chủ', page: 'home', icon: <Home size={14} /> },
    { label: 'Lộ trình', page: 'learning', icon: <Map size={14} /> },
    { label: 'Thi thử', page: 'tests', icon: <ClipboardCheck size={14} /> },
    ...(translationEnabled
      ? [{ label: 'Dịch văn bản', page: 'translate' as Page, icon: <ArrowLeftRight size={14} /> }]
      : []),
    { label: 'Từ điển', page: 'dictionary', icon: <Search size={14} /> },
    { label: 'Luyện viết', page: 'writing', icon: <PenTool size={14} /> },
    ...(user?.role === 'ADMIN' || user?.role === 'MODERATOR'
      ? [{ label: 'Quản trị', page: 'admin' as Page, icon: <Shield size={14} /> }]
      : []),
  ];

  const navigate = (nextPage: Page) => {
    setMenuOpen(false);
    navigateUrl(pathFor(nextPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border"
        aria-label="Điều hướng chính"
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('home')}
            className="group flex items-center gap-2.5"
            aria-label="Về trang chủ"
          >
            <span
              className="text-accent font-bold text-xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
              style={{ fontFamily: 'var(--font-jp)' }}
            >
              日
            </span>
            <span className="text-sm font-medium tracking-widest uppercase text-foreground/70">LearnJP</span>
          </button>
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => navigate(link.page)}
                aria-current={page === link.page ? 'page' : undefined}
                className={`relative flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:bg-accent after:origin-left after:transition-transform after:duration-300 ${page === link.page ? 'text-accent after:scale-x-100' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60 after:scale-x-0 hover:after:scale-x-100'}`}
              >
                {link.icon} {link.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <AccountButton />
            <button
              className="lg:hidden text-foreground p-2 -mr-2 rounded-md hover:bg-muted/60"
              onClick={() => setMenuOpen(open => !open)}
              aria-label="Mở hoặc đóng menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="lg:hidden bg-background border-t border-border px-6 py-4 flex flex-wrap gap-2"
          >
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => navigate(link.page)}
                aria-current={page === link.page ? 'page' : undefined}
                className={`flex basis-[calc(50%-0.25rem)] min-h-11 items-center gap-2 text-sm py-2 ${page === link.page ? 'text-accent font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {link.icon} {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="pt-14 flex-1" id="main-content">
        <Suspense
          fallback={
            <div className="flex h-[50vh] items-center justify-center">
              <Loader2 className="animate-spin text-accent" size={32} />
            </div>
          }
        >
          {page === 'home' && <HomePage setPage={navigate} />}
          {page === 'learning' && <LearningPage />}
          {page === 'tests' && <TestsPage />}
          {page === 'translate' &&
            (translationEnabled ? (
              <TranslatePage />
            ) : (
              <section className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-start gap-5">
                <h1 className="text-2xl font-semibold">Dịch văn bản hiện chưa khả dụng</h1>
                <p className="text-muted-foreground">Bạn có thể tra từng từ trong từ điển.</p>
                <button onClick={() => navigate('dictionary')} className="btn-outline px-5 py-3">
                  Mở từ điển
                </button>
              </section>
            ))}
          {page === 'dictionary' && <DictionaryPage />}
          {page === 'writing' && <WritingPage />}
          {page === 'admin' && <AdminPage />}
        </Suspense>
      </main>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold text-lg" style={{ fontFamily: 'var(--font-jp)' }}>
              日
            </span>
            <span className="text-sm text-muted-foreground">LearnJP · Học tiếng Nhật theo lộ trình JLPT</span>
          </div>
          <p className="text-xs text-muted-foreground/50">頑張ってください — Hãy tiếp tục cố gắng nhé.</p>
        </div>
      </footer>
    </div>
  );
}
