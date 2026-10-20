import React, { useEffect, useState, Suspense, lazy } from "react";
import { ArrowLeftRight, Home, Map, Menu, PenTool, Search, Shield, Loader2 } from "lucide-react";
import { useBrowserUrl, pageFromUrl, navigateUrl } from "./services/navigation";
import { Page } from "./data/basicData";
import { translationEnabled } from './services/features';
import { AuthProvider, AccountButton, useAuth } from './components/auth/AuthProvider';

const HomePage = lazy(() => import("./screens/HomePage"));
const LearningPage = lazy(() => import("./screens/LearningPage"));
const TranslatePage = lazy(() => import("./screens/TranslatePage"));
const DictionaryPage = lazy(() => import("./screens/DictionaryPage"));
const WritingPage = lazy(() => import("./screens/WritingPage"));
const FlashcardsPage = lazy(() => import("./screens/FlashcardsPage"));
const GamesPage = lazy(() => import("./screens/GamesPage"));
const AdminPage = lazy(() => import("./screens/AdminPage"));

export default function App() {
    return <AuthProvider><AppContent /></AuthProvider>;
}

function AppContent() {
    const { user } = useAuth();
    const href = useBrowserUrl();
    const page = pageFromUrl(href);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (window.location.pathname === "/" && !window.location.hash) {
            navigateUrl("/home", true);
        }
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, [href]);

    const navLinks: { label: string; page: Page; icon: React.ReactNode }[] = [
        { label: "Home", page: "home", icon: <Home size={14} /> },
        { label: "Roadmap", page: "learning", icon: <Map size={14} /> },
        ...(translationEnabled ? [{ label: "Translate", page: "translate" as Page, icon: <ArrowLeftRight size={14} /> }] : []),
        { label: "Dictionary", page: "dictionary", icon: <Search size={14} /> },
        { label: "Writing", page: "writing", icon: <PenTool size={14} /> },
        // { label: "Flashcards", page: "flashcards", icon: <BookOpen size={14} /> },
        // { label: "Games", page: "games", icon: <Gamepad2 size={14} /> },
        ...((user?.role === 'ADMIN' || user?.role === 'MODERATOR') ? [{ label: "Admin", page: "admin" as Page, icon: <Shield size={14} /> }] : []),
    ];

    const navigate = (nextPage: Page) => {
        setMenuOpen(false);
        navigateUrl(`/${nextPage}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border" aria-label="Primary navigation">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <button onClick={() => navigate("home")} className="flex items-center gap-2.5" aria-label="Go to home">
                        <span className="text-accent font-bold text-xl" style={{ fontFamily: "'Noto Serif JP', serif" }}>日</span>
                        <span className="text-sm font-medium tracking-widest uppercase text-foreground/70">Nihongo</span>
                    </button>
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map(link => (
                            <button
                                key={link.page}
                                onClick={() => navigate(link.page)}
                                aria-current={page === link.page ? "page" : undefined}
                                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 transition-colors ${page === link.page ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                {link.icon} {link.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                    <AccountButton />
                    <button
                        className="lg:hidden text-foreground p-2 -mr-2"
                        onClick={() => setMenuOpen(open => !open)}
                        aria-label="Toggle navigation"
                        aria-expanded={menuOpen}
                        aria-controls="mobile-navigation"
                    >
                        <Menu size={20} />
                    </button>
                    </div>
                </div>
                {menuOpen && (
                    <div id="mobile-navigation" className="lg:hidden bg-background border-t border-border px-6 py-4 flex flex-wrap gap-2">
                        {navLinks.map(link => (
                            <button
                                key={link.page}
                                onClick={() => navigate(link.page)}
                                aria-current={page === link.page ? "page" : undefined}
                                className={`flex basis-[calc(50%-0.25rem)] min-h-11 items-center gap-2 text-sm py-2 ${page === link.page ? "text-accent font-medium" : "text-muted-foreground"}`}
                            >
                                {link.icon} {link.label}
                            </button>
                        ))}
                    </div>
                )}
            </nav>

            <main className="pt-14 flex-1" id="main-content">
                <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-accent" size={32}/></div>}>
                    {page === "home" && <HomePage setPage={navigate} />}
                    {page === "learning" && <LearningPage setPage={navigate} />}
                    {page === "translate" && (translationEnabled ? <TranslatePage /> : <section className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-start gap-5">
                        <h1 className="text-2xl font-semibold">Dịch văn bản chưa mở trong bản thử nghiệm</h1>
                        <p className="text-muted-foreground">Bạn có thể tra từ bằng từ điển hoặc tiếp tục học các bài N5.</p>
                        <button onClick={() => navigate('dictionary')} className="border border-border px-5 py-3">Mở từ điển</button>
                    </section>)}
                    {page === "dictionary" && <DictionaryPage />}
                    {page === "writing" && <WritingPage />}
                    {page === "flashcards" && <FlashcardsPage />}
                    {page === "games" && <GamesPage />}
                    {page === "admin" && <AdminPage />}
                </Suspense>
            </main>

            <footer className="border-t border-border py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-accent font-bold text-lg" style={{ fontFamily: "'Noto Serif JP', serif" }}>日</span>
                        <span className="text-sm text-muted-foreground">Nihongo · Japanese Learning</span>
                    </div>
                    <p className="text-xs text-muted-foreground/50">頑張ってください — Keep up the good work.</p>
                </div>
            </footer>
        </div>
    );
}
