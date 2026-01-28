import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HeartPulse,
    Stethoscope,
    Activity,
    PhoneCall,
    Camera,
    LayoutDashboard,
    ShieldAlert
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Medicines from './pages/Medicines';
import Fitness from './pages/Fitness';
import Emergency from './pages/Emergency';
import FallDetection from './pages/FallDetection';
import BackgroundShader from './components/BackgroundShader';

const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link to={to}>
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${active
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </motion.div>
    </Link>
);

function App() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-transparent text-white flex relative overflow-hidden">
            <BackgroundShader />
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 p-6 flex flex-col space-y-8 glass-nav z-10">
                <div className="flex items-center space-x-3 px-2">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <HeartPulse className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold gradient-text">ElderCare AI</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
                    <NavItem to="/reports" icon={Stethoscope} label="Health Reports" active={location.pathname === '/reports'} />
                    <NavItem to="/medicines" icon={Activity} label="Medicines" active={location.pathname === '/medicines'} />
                    <NavItem to="/fitness" icon={Activity} label="Fitness" active={location.pathname === '/fitness'} />
                    <NavItem to="/fall-detection" icon={Camera} label="Fall Detection" active={location.pathname === '/fall-detection'} />
                    <NavItem to="/emergency" icon={PhoneCall} label="Emergency" active={location.pathname === '/emergency'} />
                </nav>

                <div className="mt-auto p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3">
                    <ShieldAlert className="text-red-500" />
                    <div>
                        <p className="text-sm font-semibold text-red-500">Emergency</p>
                        <p className="text-xs text-red-500/70">Quick assistance</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden flex flex-col z-10 bg-transparent">
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 glass-nav">
                    <h2 className="text-xl font-semibold capitalize">
                        {location.pathname === '/' ? 'Overview' : location.pathname.substring(1).replace('-', ' ')}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500" />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/medicines" element={<Medicines />} />
                                <Route path="/fitness" element={<Fitness />} />
                                <Route path="/emergency" element={<Emergency />} />
                                <Route path="/fall-detection" element={<FallDetection />} />
                            </Routes>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

export default App;
