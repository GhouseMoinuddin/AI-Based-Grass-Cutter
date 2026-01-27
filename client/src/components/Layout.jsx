import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, PlayCircle, Activity, History, Menu, X, LogIn, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Layout.css';

import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Zap } from 'lucide-react';

const Layout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const navItems = [
        { id: 'home', icon: Home, label: 'Home', path: '/' },
        { id: 'sim', icon: PlayCircle, label: 'Shapes', path: '/simulator' },
        { id: 'ctrl', icon: Gamepad2, label: 'Control', path: '/controls' },
        { id: 'status', icon: Activity, label: 'Status', path: '/monitor' },
        { id: 'hist', icon: History, label: 'History', path: '/history' }
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const cycleTheme = () => {
        if (theme === 'mower') setTheme('light');
        else if (theme === 'light') setTheme('dark');
        else setTheme('mower');
    };

    const getThemeIcon = () => {
        if (theme === 'mower') return <Zap size={20} className="text-grass-400" />;
        if (theme === 'light') return <Sun size={20} className="text-orange-400" />;
        return <Moon size={20} className="text-blue-400" />;
    };

    return (
        <div className="layout-container">
            {/* Top Navbar */}
            <nav className="navbar">
                <div className="navbar-content">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="logo-box">
                            <span className="font-bold text-white text-lg">AI</span>
                        </div>
                        <span className="logo-text">
                            GrassCutter
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`nav-link-desktop ${location.pathname === item.path ? 'nav-link-active' : 'nav-link-inactive'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        <button
                            onClick={cycleTheme}
                            className="p-2 rounded-lg bg-skin-card hover:bg-skin-card-hover border border-skin-border transition-colors mx-2"
                            title="Switch Theme"
                        >
                            {getThemeIcon()}
                        </button>

                        <Link to="/login" className="admin-btn">
                            Admin Login
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={cycleTheme}
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            {getThemeIcon()}
                        </button>
                        <button
                            className="p-2 text-slate-400 hover:text-white transition-colors"
                            onClick={toggleSidebar}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sidebar / Drawer */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="sidebar-overlay"
                            onClick={toggleSidebar}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="sidebar-panel"
                        >
                            <div className="sidebar-header">
                                <span className="font-bold text-xl text-white">Menu</span>
                                <button onClick={toggleSidebar} className="sidebar-close-btn">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.id}
                                            to={item.path}
                                            onClick={toggleSidebar}
                                            className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                                        >
                                            <Icon size={20} />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="sidebar-footer">
                                <Link
                                    to="/login"
                                    onClick={toggleSidebar}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 p-3 rounded-xl transition-colors font-medium text-slate-300 hover:text-white"
                                >
                                    <LogIn size={18} />
                                    Admin Login
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="layout-main">
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="mobile-nav safe-bottom">
                <div className="mobile-nav-container">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className="mobile-link"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-bg"
                                        className="absolute inset-0 bg-gradient-to-t from-grass-500/10 to-transparent"
                                        initial={false}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                                <Icon
                                    size={24}
                                    className={`mb-1 transition-colors ${isActive ? 'text-grass-400' : 'text-slate-500'}`}
                                />
                                <span className={`text-[10px] ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute top-0 w-8 h-1 bg-grass-500 rounded-b-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Layout;
