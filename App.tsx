
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { ViewState, Event, Vendor, ChecklistItem, BudgetCategory, TeamMember, FundEntry, Idea, UserRole } from './types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Sparkles, DollarSign, CalendarDays, ClipboardList, Lightbulb, Users, ArrowRight, Plus, 
  Trash2, Upload, MapPin, Music, Utensils, Award, CheckCircle, Circle, Save, Wand2, Search,
  ChevronRight, ChevronLeft, LayoutDashboard, Camera, FileText, Download, ThumbsUp, MessageSquare, Sun, CloudRain, ShieldAlert, Check
} from 'lucide-react';
import { generateEventIdeas, predictEventCost, generateMoodBoardDescription } from './services/geminiService';

// --- MOCK DATA ---
const INITIAL_EVENTS: Event[] = [
  { id: '1', name: 'Freshers Party 2024', type: 'Social', date: '2024-09-15', budget: 50000, spent: 48000, status: 'Completed', attendees: 500, registeredCount: 480 },
  { id: '2', name: 'Tech Symposium', type: 'Academic', date: '2024-10-20', budget: 120000, spent: 110000, status: 'Completed', attendees: 300, registeredCount: 295 },
  { id: '3', name: 'Cultural Fest', type: 'Cultural', date: '2025-02-14', budget: 250000, spent: 45000, status: 'Upcoming', attendees: 1200, registeredCount: 850 },
  { id: '4', name: 'Alumni Meetup', type: 'Social', date: '2025-05-10', budget: 80000, spent: 0, status: 'Pending_Approval', attendees: 400, registeredCount: 0 },
];

const MOCK_VENDORS: Vendor[] = [
  { id: '1', name: 'Neon Vibes Decor', category: 'Decoration', rating: 4.8, costEstimate: '$500 - $2000', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', description: 'Futuristic light setups.', reviews: 124 },
  { id: '2', name: 'Campus Bites', category: 'Food', rating: 4.5, costEstimate: '$10/plate', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80', description: 'Healthy & tasty catering.', reviews: 89 },
  { id: '3', name: 'SoundWave Pros', category: 'Sound', rating: 4.9, costEstimate: '$800/day', image: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=800&q=80', description: 'High bass systems.', reviews: 56 },
];

const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Sarah J.', role: 'Event Lead', avatar: 'https://i.pravatar.cc/150?u=1', status: 'Online', tasks: 12 },
  { id: '2', name: 'Mike T.', role: 'Finance', avatar: 'https://i.pravatar.cc/150?u=2', status: 'Busy', tasks: 5 },
  { id: '3', name: 'Jessica L.', role: 'Decor Head', avatar: 'https://i.pravatar.cc/150?u=3', status: 'Offline', tasks: 8 },
];

const MOCK_IDEAS: Idea[] = [
  { id: '1', title: 'Retro Arcade Night', description: 'Bring in old school arcade machines and neon lights.', votes: 45, author: 'Mike T.', category: 'Social' },
  { id: '2', title: 'VR Gaming Booth', description: 'Setup VR headsets for a tech experience corner.', votes: 89, author: 'Sarah J.', category: 'Tech' },
];

// --- COMPONENTS ---

// AI Transparency Label Component
const AiTag = ({ type = 'suggestion' }: { type?: 'suggestion' | 'prediction' }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-tighter">
    <Sparkles className="w-2.5 h-2.5 mr-1" /> Gemini {type}
  </span>
);

const LandingPage = ({ setView }: { setView: (v: ViewState) => void }) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950">
          <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80" alt="Event" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm mb-6 animate-slide-up">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">Institutional Governance & Planning</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tight animate-slide-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text-blue">
              EventOS Suite
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light animate-slide-up">
            Unified platform for Student Org coordination, Administrative approval, and Campus engagement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up">
            <button onClick={() => setView('LOGIN')} className="px-8 py-4 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,211,238,0.6)]">
              Enter Platform
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthPage = ({ setView, setRole }: { setView: (v: ViewState) => void, setRole: (r: UserRole) => void }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('TEAM');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setRole(selectedRole);
      setLoading(false);
      if (selectedRole === 'USER') setView('USER_CATALOG');
      else if (selectedRole === 'ADMIN') setView('DASHBOARD');
      else setView('DASHBOARD');
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 z-10 animate-slide-up">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Select Access Role</h2>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {(['USER', 'TEAM', 'ADMIN'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`py-3 rounded-xl border text-xs font-bold transition-all ${selectedRole === r ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
            >
              {r}
            </button>
          ))}
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-widest mb-1 block">Institutional ID</label>
            <input type="text" defaultValue="STUDENT_2024_01" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-all text-white" />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-widest mb-1 block">Security Key</label>
            <input type="password" defaultValue="••••••••" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-all text-white" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
            {loading ? 'Authenticating...' : 'Access Suite'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- ROLE-SPECIFIC DASHBOARDS ---

const AdminDashboard = ({ events, setEvents }: { events: Event[], setEvents: any }) => {
  const pendingCount = events.filter(e => e.status === 'Pending_Approval').length;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full animate-slide-up">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">Administrative Console</h2>
          <p className="text-slate-400">Institutional overview and governance tools.</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <span className="text-red-400 font-bold">{pendingCount} Pending Approvals</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <p className="text-xs text-slate-400 uppercase mb-2">Total Allocated Funds</p>
          <p className="text-3xl font-bold text-cyan-400">$540,000</p>
          <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-cyan-500 w-[65%]"></div>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <p className="text-xs text-slate-400 uppercase mb-2">Active Student Bodies</p>
          <p className="text-3xl font-bold text-purple-400">12 Units</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <p className="text-xs text-slate-400 uppercase mb-2">Campus Engagement</p>
          <p className="text-3xl font-bold text-green-400">88%</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-white/10">
        <h3 className="text-xl font-bold mb-6">Master Event Audit</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-white/10">
                <th className="pb-4">Event Name</th>
                <th className="pb-4">Org Unit</th>
                <th className="pb-4">Budget</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {events.map((e) => (
                <tr key={e.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 font-medium text-white">{e.name}</td>
                  <td className="py-4 text-slate-400">{e.type} Group</td>
                  <td className="py-4 text-cyan-400 font-mono">${e.budget.toLocaleString()}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${e.status === 'Pending_Approval' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-xs bg-slate-800 px-3 py-1 rounded hover:bg-white/10 transition-all">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UserCatalog = ({ events }: { events: Event[] }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full animate-slide-up">
      <h2 className="text-4xl font-bold text-white mb-2">Upcoming Events</h2>
      <p className="text-slate-400 mb-10">Register for workshops, festivals, and social gatherings.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.filter(e => e.status === 'Upcoming').map((e) => (
          <div key={e.id} className="glass-panel rounded-2xl overflow-hidden border border-white/10 group hover:border-cyan-500/50 transition-all">
            <div className="h-48 bg-slate-900 relative">
               <img src={`https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80`} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-all" alt={e.name} />
               <div className="absolute top-4 left-4 bg-cyan-500 text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase">{e.type}</div>
            </div>
            <div className="p-6">
               <h3 className="text-xl font-bold text-white mb-2">{e.name}</h3>
               <div className="flex items-center text-slate-400 text-sm mb-4 gap-4">
                  <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" /> {e.date}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {e.registeredCount} joined</span>
               </div>
               <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-500 hover:text-black font-bold transition-all">Register Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreateEvent = ({ onCreated }: { onCreated: (e: Event) => void }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('Cultural');
  const [attendees, setAttendees] = useState(500);

  const handlePredict = async () => {
    setLoading(true);
    const data = await predictEventCost(type, attendees);
    setResult(JSON.parse(data));
    setLoading(false);
  };

  const handleFinalSubmit = () => {
    onCreated({
      id: Date.now().toString(),
      name: name || 'Untitled Event',
      type,
      date: '2025-06-01',
      budget: result?.total || 10000,
      spent: 0,
      status: 'Pending_Approval',
      attendees,
      registeredCount: 0
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-slide-up">
      <div className="glass-panel p-8 rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          New Event Proposal <AiTag type="prediction" />
        </h2>
        
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Event Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Category</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none">
                <option>Cultural</option>
                <option>Technical</option>
                <option>Social</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Expected Attendees</label>
              <input type="number" value={attendees} onChange={e => setAttendees(parseInt(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-cyan-500 outline-none" />
            </div>
            <button onClick={() => { handlePredict(); setStep(2); }} className="w-full py-3 bg-cyan-500 text-black font-bold rounded-xl">Next & Estimate Budget</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {loading ? (
              <div className="py-10 text-center">
                 <div className="animate-spin w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                 <p className="text-slate-400">AI is calculating market rates...</p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                   <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Gemini Forecast Breakdown</p>
                   <div className="space-y-2">
                      {result && Object.entries(result).map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-white/5 pb-2 text-sm">
                           <span className="capitalize text-slate-400">{k}</span>
                           <span className="font-mono text-white">${Number(v).toLocaleString()}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <button onClick={handleFinalSubmit} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                  Submit to Admin for Approval <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Planner Dashboard (Team Role)
const TeamDashboard = ({ events, setView }: { events: Event[], setView: (v: ViewState) => void }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full animate-slide-up">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold">Coordination Deck</h2>
        <button onClick={() => setView('CREATE_EVENT')} className="bg-cyan-500 text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20">
          <Plus className="w-5 h-5" /> New Proposal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
           <h3 className="text-lg font-bold mb-6">My Recent Events</h3>
           <div className="space-y-4">
              {events.map(e => (
                <div key={e.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                   <div>
                      <p className="font-bold text-white">{e.name}</p>
                      <p className="text-xs text-slate-500">{e.date}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-cyan-400 font-mono text-sm">${e.budget.toLocaleString()}</p>
                      <span className={`text-[10px] font-bold uppercase ${e.status === 'Completed' ? 'text-green-400' : e.status === 'Pending_Approval' ? 'text-yellow-400' : 'text-slate-400'}`}>
                        {e.status}
                      </span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10">
           <h3 className="text-lg font-bold mb-6">Budget Overview</h3>
           <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={events.slice(0, 4)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} hide />
                    <Bar dataKey="budget" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

const IdeaBank = () => {
  const [prompt, setPrompt] = useState('');
  const [ideas, setIdeas] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGen = async () => {
    setLoading(true);
    const text = await generateEventIdeas(prompt);
    setIdeas(text);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-slide-up">
      <div className="glass-panel p-8 rounded-2xl border border-white/10">
         <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">Idea Engine <AiTag type="suggestion" /></h2>
         <p className="text-slate-400 mb-8 text-sm">Tell Gemini what kind of event you're thinking of, and it'll generate 3 unique concepts.</p>
         
         <div className="flex gap-4 mb-10">
            <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g. 'Interactive tech workshop for 200 coding students'" className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500" />
            <button onClick={handleGen} className="bg-purple-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
              {loading ? 'Thinking...' : <><Wand2 className="w-5 h-5" /> Generate</>}
            </button>
         </div>

         {ideas && (
            <div className="bg-purple-500/5 border border-purple-500/20 p-6 rounded-xl animate-slide-up">
               <div className="prose prose-invert max-w-none text-slate-300 idea-output" dangerouslySetInnerHTML={{ __html: ideas }}></div>
            </div>
         )}
      </div>
    </div>
  );
};

// --- APP ROOT ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [role, setRole] = useState<UserRole>('USER');
  const [glowMode, setGlowMode] = useState(true);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);

  const toggleGlowMode = () => setGlowMode(!glowMode);

  const handleEventCreation = (newEvent: Event) => {
    setEvents([...events, newEvent]);
    setCurrentView('DASHBOARD');
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME': return <LandingPage setView={setCurrentView} />;
      case 'LOGIN': return <AuthPage setView={setCurrentView} setRole={setRole} />;
      case 'DASHBOARD': 
        if (role === 'ADMIN') return <AdminDashboard events={events} setEvents={setEvents} />;
        if (role === 'TEAM') return <TeamDashboard events={events} setView={setCurrentView} />;
        return <UserCatalog events={events} />;
      case 'USER_CATALOG': return <UserCatalog events={events} />;
      case 'CREATE_EVENT': return <CreateEvent onCreated={handleEventCreation} />;
      case 'IDEAS': return <IdeaBank />;
      case 'ADMIN_APPROVALS': return <AdminDashboard events={events} setEvents={setEvents} />;
      case 'CHECKLIST': return <div className="p-20 text-center text-slate-500">Coordination Board (Mock View)</div>;
      case 'VENDORS': return <div className="p-20 text-center text-slate-500">Vendor Marketplace (Mock View)</div>;
      case 'TEAM': return <div className="p-20 text-center text-slate-500">Team Management (Mock View)</div>;
      case 'PAST_EVENTS': return <div className="p-20 text-center text-slate-500">Master Analytics (Mock View)</div>;
      default: return <LandingPage setView={setCurrentView} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setView={setCurrentView} 
      glowMode={glowMode} 
      toggleGlowMode={toggleGlowMode} 
      role={role} 
      setRole={setRole}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
