
import React, { useState, useEffect } from 'react';
import { ViewState, Notification, UserRole } from '../types';
import { 
  Calendar, Menu, X, LogOut, User, Sparkles, Bell, Sun, Moon, CloudSun, CloudRain, Zap, 
  LayoutDashboard, ShieldCheck, Ticket, Users, Lightbulb, BarChart3, Settings
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  glowMode: boolean;
  toggleGlowMode: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, glowMode, toggleGlowMode, role, setRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [weather] = useState({ temp: 72, condition: 'Sunny' });

  // Mock Notifications
  const notifications: Notification[] = [
    { id: '1', title: 'Budget Alert', message: 'Decoration budget exceeded by 10%', type: 'alert', time: '10m ago', read: false },
    { id: '2', title: 'New Vendor', message: 'Neon Decor Pros replied to your quote', type: 'info', time: '1h ago', read: false },
    { id: '3', title: 'Task Completed', message: 'Venue booking confirmed', type: 'success', time: '2h ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavItems = (): { label: string; view: ViewState; icon?: any }[] => {
    if (role === 'ADMIN') {
      return [
        { label: 'Admin Desk', view: 'DASHBOARD', icon: ShieldCheck },
        { label: 'Approvals', view: 'ADMIN_APPROVALS', icon: Sparkles },
        { label: 'Analytics', view: 'PAST_EVENTS', icon: BarChart3 },
        { label: 'Team', view: 'TEAM', icon: Users },
      ];
    }
    if (role === 'TEAM') {
      return [
        { label: 'Planner', view: 'DASHBOARD', icon: LayoutDashboard },
        { label: 'Checklist', view: 'CHECKLIST', icon: Ticket },
        { label: 'Vendors', view: 'VENDORS', icon: Ticket },
        { label: 'Ideas', view: 'IDEAS', icon: Lightbulb },
      ];
    }
    return [
      { label: 'Events', view: 'USER_CATALOG', icon: Calendar },
      { label: 'My Tickets', view: 'DASHBOARD', icon: Ticket },
      { label: 'Idea Bank', view: 'IDEAS', icon: Lightbulb },
    ];
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    setView('HOME');
  };

  return (
    <div className={`min-h-screen relative bg-slate-950 text-white selection:bg-cyan-500 selection:text-black font-outfit overflow-x-hidden ${glowMode ? 'glow-active' : ''}`}>
      
      <style>{`
        .glow-active .glass-panel {
          box-shadow: 0 0 25px rgba(34, 211, 238, 0.15);
          border-color: rgba(34, 211, 238, 0.3);
        }
        .glow-active .neon-text-blue {
           text-shadow: 0 0 10px #22d3ee, 0 0 20px #22d3ee, 0 0 40px #0ea5e9;
        }
        .glow-active button {
           box-shadow: 0 0 15px rgba(34, 211, 238, 0.3);
        }
      `}</style>

      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-float opacity-70 transition-all duration-1000 ${glowMode ? 'bg-purple-500/30 blur-[150px]' : ''}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-float opacity-70 transition-all duration-1000 ${glowMode ? 'bg-cyan-400/20 blur-[150px]' : ''}`} style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center cursor-pointer group" onClick={() => setView('HOME')}>
              <div className="relative bg-gradient-to-tr from-slate-900 to-slate-800 border border-white/10 p-2 rounded-xl mr-3 group-hover:border-cyan-400/50 transition-all">
                <Sparkles className="text-cyan-400 w-6 h-6 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <span className="font-bold text-xl tracking-wider text-white group-hover:neon-text-blue">
                EVENT<span className="text-cyan-400">OS</span>
                {role !== 'USER' && <span className="ml-2 text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 uppercase tracking-widest">{role}</span>}
              </span>
            </div>

            {currentView !== 'HOME' && currentView !== 'LOGIN' && currentView !== 'REGISTER' && (
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setView(item.view)}
                    className={`text-sm font-medium transition-all hover:text-cyan-400 flex items-center gap-2 group ${currentView === item.view ? 'text-cyan-400' : 'text-slate-300'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <div className="hidden md:flex items-center space-x-6">
               <button onClick={toggleGlowMode} className="text-slate-300 hover:text-yellow-400 transition-colors">
                  <Zap className={`w-5 h-5 ${glowMode ? 'text-yellow-400 fill-yellow-400' : ''}`} />
               </button>

              <div className="relative">
                <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative text-slate-300 hover:text-cyan-400 transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-4 w-80 glass-panel rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-slide-up origin-top-right">
                    <div className="p-3 border-b border-white/10 bg-slate-900/50 flex justify-between items-center">
                      <span className="font-semibold text-sm">Notifications</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer text-left">
                          <p className="text-sm font-medium text-white">{n.title}</p>
                          <p className="text-xs text-slate-400">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {currentView !== 'HOME' && currentView !== 'LOGIN' && currentView !== 'REGISTER' ? (
                <button onClick={handleLogout} className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              ) : (
                <button onClick={() => setView('LOGIN')} className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all">
                  Sign In
                </button>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300 hover:text-white">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden glass-panel border-t border-white/10 animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setView(item.view); setIsMenuOpen(false); }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${currentView === item.view ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-white/5'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-20 min-h-screen flex flex-col relative z-10">
        {children}
      </main>
      
      {currentView !== 'HOME' && currentView !== 'LOGIN' && currentView !== 'REGISTER' && (
        <footer className="py-6 text-center text-slate-600 text-sm relative z-10">
          <p>© 2024 EventOS • Role: {role}</p>
        </footer>
      )}
    </div>
  );
};

export default Layout;
