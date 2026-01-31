import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMail, FiCalendar, FiUsers, FiSearch, FiClock, 
  FiTrendingUp, FiZap, FiActivity, FiLayers, FiCpu, 
  FiCheckCircle, FiArrowRight, FiMoreHorizontal, FiPlus, 
  FiLayout, FiFilter, FiCoffee, FiBook, FiBriefcase, FiX
} from 'react-icons/fi';
import Modal from 'react-modal';

Modal.setAppElement('#root');

// --- 1. ENHANCED DATA ENGINE ---
const mockData = {
  attentionNow: [
    { id: 1, context: 'Startup', type: 'email', sender: 'Sarah Chen', subject: 'Investor Deck Feedback', body: 'The roadmap slide needs more clarity on the Q3 milestones. Can we sync before 4 PM?', urgency: 'Critical', score: 98 },
    { id: 2, context: 'University', type: 'task', sender: 'Canvas', subject: 'CS50 Final Project', body: 'Submission window opens in 2 hours. Ensure your README is updated.', urgency: 'High', score: 85 },
  ],
  planner: [
    { id: 101, title: 'Deep Work: Frontend', time: '09:00 AM', duration: '2h', type: 'focus' },
    { id: 102, title: 'Team Standup', time: '11:00 AM', duration: '30m', type: 'meeting' },
  ],
  team: [
    { name: 'Alex', role: 'Dev', status: 'In Flow', color: 'bg-purple-500', task: 'Kernel Debugging' },
    { name: 'Priya', role: 'Design', status: 'Available', color: 'bg-emerald-500', task: 'Reviewing UI' },
    { name: 'Kartik', role: 'Founder', status: 'Planning', color: 'bg-indigo-500', task: 'Investor Pitch' },
  ],
  insights: [
    { label: 'Deep Work', value: '28h', trend: '+12h', icon: <FiZap /> },
    { label: 'Focus Score', value: '82%', trend: '+5%', icon: <FiActivity /> },
  ]
};

// --- 2. UI/UX MASTERMIND COMPONENTS ---

const Navigation = ({ active, setActive, currentContext, setContext }) => (
  <nav className="w-24 lg:w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 z-20">
    <div className="p-8">
      <div className="flex items-center space-x-3 text-indigo-600 mb-12">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
          <FiCpu className="text-white text-2xl" />
        </div>
        <h1 className="text-2xl font-black tracking-tight hidden lg:block text-gray-900">FlowState</h1>
      </div>

      <div className="space-y-2">
        <NavButton active={active === 'dash'} icon={<FiLayers />} label="Command Center" onClick={() => setActive('dash')} />
        <NavButton active={active === 'plan'} icon={<FiLayout />} label="Smart Planner" onClick={() => setActive('plan')} />
        <NavButton active={active === 'team'} icon={<FiUsers />} label="Team Pulse" onClick={() => setActive('team')} />
        <NavButton active={active === 'nexus'} icon={<FiTrendingUp />} label="Focus Insights" onClick={() => setActive('nexus')} />
      </div>

      <div className="mt-12 hidden lg:block">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-4">Life Contexts</p>
        <div className="space-y-1">
          <ContextTab active={currentContext === 'All'} label="All Life" icon={<FiFilter />} onClick={() => setContext('All')} />
          <ContextTab active={currentContext === 'Startup'} label="Startup" icon={<FiBriefcase />} onClick={() => setContext('Startup')} />
          <ContextTab active={currentContext === 'University'} label="University" icon={<FiBook />} onClick={() => setContext('University')} />
        </div>
      </div>
    </div>
    
    <div className="mt-auto p-8 border-t border-gray-50 hidden lg:block">
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-indigo-100/50">
        <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Cognitive Load</p>
        <div className="flex items-end justify-between mb-2">
          <span className="text-3xl font-black text-indigo-700">82%</span>
          <span className="text-xs font-bold text-indigo-400">Optimal</span>
        </div>
        <div className="w-full bg-indigo-200/30 h-1.5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-indigo-600" />
        </div>
      </div>
    </div>
  </nav>
);

const NavButton = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50'}`}>
    <span className="text-xl">{icon}</span>
    <span className="font-bold text-sm hidden lg:block">{label}</span>
  </button>
);

const ContextTab = ({ active, label, icon, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all text-sm font-bold ${active ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-600'}`}>
    {icon} <span>{label}</span>
  </button>
);

// --- 3. CORE VIEWS ---

const DashboardView = ({ context, openModal }) => {
  const filtered = context === 'All' ? mockData.attentionNow : mockData.attentionNow.filter(i => i.context === context);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <section>
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Neural Priority Queue</h2>
        <div className="space-y-6">
          {filtered.map(item => (
            <motion.div 
              layoutId={item.id}
              key={item.id} 
              className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-2xl shadow-gray-200/40 relative group overflow-hidden"
            >
              {/* Ghost Action HUD (Appears on Hover) */}
              <div className="absolute top-0 right-0 h-full w-48 bg-gradient-to-l from-white via-white to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-300 flex flex-col justify-center space-y-3 pr-8 pl-4 border-l border-gray-50">
                <button className="p-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-indigo-700">Quick Reply</button>
                <button className="p-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200">Delegate</button>
                <button className="p-3 bg-gray-900 text-white rounded-xl text-xs font-bold" onClick={() => openModal(item)}>Deep Dive</button>
              </div>

              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${item.urgency === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                  {item.urgency} Priority
                </span>
                <span className="text-sm font-bold text-gray-300">Context: {item.context}</span>
              </div>
              <h3 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter leading-tight">{item.subject}</h3>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl leading-relaxed">{item.body}</p>
              <div className="flex items-center text-indigo-600 font-black">
                <FiZap className="mr-2" /> AI Confidence: {item.score}%
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Biometric Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockData.insights.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const PlannerView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-[70vh] gap-8">
    <div className="w-1/3 bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm overflow-y-auto">
      <h3 className="text-xl font-black mb-8">Unstructured Inbox</h3>
      <div className="space-y-4">
        {['Marketing Sync', 'API Documentation', 'Investor Pitch Prep', 'Weekly Sync'].map((item, i) => (
          <div key={i} className="p-6 bg-gray-50 rounded-3xl border-2 border-transparent hover:border-indigo-100 cursor-grab active:scale-95 transition-all">
            <p className="font-black text-gray-800">{item}</p>
            <p className="text-xs text-indigo-500 font-bold mt-2">Needs 45 mins</p>
          </div>
        ))}
      </div>
    </div>
    <div className="flex-1 bg-white rounded-[40px] border border-gray-100 p-10 overflow-y-auto relative">
      <div className="absolute top-0 right-10 h-full w-[2px] bg-gray-50" />
      <h3 className="text-xl font-black mb-10 text-gray-900">Optimal Schedule</h3>
      <div className="space-y-4">
        {[9, 10, 11, 12, 1, 2, 3].map(hour => (
          <div key={hour} className="group h-24 border-t border-gray-50 flex py-4">
            <span className="w-16 text-xs font-black text-gray-300 group-hover:text-indigo-600 transition-colors">{hour}:00</span>
            <div className="flex-1 rounded-2xl group-hover:bg-indigo-50/20 border-2 border-dashed border-transparent group-hover:border-indigo-100 transition-all flex items-center justify-center">
               <FiPlus className="text-transparent group-hover:text-indigo-300 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const TeamPulseView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {mockData.team.map((m, i) => (
      <div key={i} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/20 relative overflow-hidden group">
        <div className={`w-16 h-16 ${m.color} rounded-2xl mb-8 flex items-center justify-center text-white font-black text-2xl shadow-lg`}>{m.name[0]}</div>
        <h4 className="text-2xl font-black text-gray-900 mb-1">{m.name}</h4>
        <p className="text-gray-400 font-bold mb-8 uppercase text-[10px] tracking-widest">{m.role}</p>
        <div className="absolute top-10 right-10 flex items-center space-x-2">
           <div className={`w-2.5 h-2.5 rounded-full ${m.status === 'In Flow' ? 'bg-purple-500 animate-pulse' : 'bg-emerald-500'}`} />
           <span className="text-xs font-black text-gray-900 uppercase">{m.status}</span>
        </div>
        <div className="bg-gray-50 p-6 rounded-3xl border border-transparent group-hover:border-indigo-100 transition-all">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Live Focus</p>
          <p className="text-md font-bold text-gray-700">{m.task}</p>
        </div>
      </div>
    ))}
  </motion.div>
);

const NexusView = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Productivity Delta Chart */}
      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl relative overflow-hidden">
        <h3 className="text-2xl font-black mb-2 text-gray-900">Efficiency Delta</h3>
        <p className="text-gray-500 font-medium mb-12">Weekly deep-work minutes reclaimed.</p>
        <div className="flex items-end space-x-10 h-56 px-4">
          <div className="flex-1 flex flex-col items-center group">
            <div className="w-full bg-gray-100 rounded-t-3xl h-24 group-hover:h-28 transition-all duration-500" />
            <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pre-Nexus</p>
          </div>
          <div className="flex-1 flex flex-col items-center group">
            <div className="w-full bg-gradient-to-t from-indigo-600 to-blue-500 rounded-t-3xl h-52 group-hover:h-56 shadow-2xl shadow-indigo-200 transition-all duration-500" />
            <p className="mt-6 text-[10px] font-black text-indigo-600 uppercase tracking-widest">FlowState</p>
          </div>
        </div>
      </div>

      {/* Focus Breakdown Donut */}
      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl flex items-center justify-between">
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-gray-900">Attention</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4"><div className="w-4 h-4 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-100" /> <span className="text-sm font-black text-gray-600">Deep Work (65%)</span></div>
            <div className="flex items-center space-x-4"><div className="w-4 h-4 bg-amber-400 rounded-lg shadow-lg shadow-amber-100" /> <span className="text-sm font-black text-gray-600">Administrative (20%)</span></div>
            <div className="flex items-center space-x-4"><div className="w-4 h-4 bg-rose-500 rounded-lg shadow-lg shadow-rose-100" /> <span className="text-sm font-black text-gray-600">Meeting Leakage (15%)</span></div>
          </div>
        </div>
        <div className="relative w-44 h-44">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#F3F4F6" strokeWidth="3.5" />
            <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#6366f1" strokeWidth="3.5" strokeDasharray="65, 100" />
            <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#fbbf24" strokeWidth="3.5" strokeDasharray="20, 100" strokeDashoffset="-65" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
             <span className="text-3xl font-black text-gray-900">82%</span>
             <span className="text-[10px] font-black text-gray-400 uppercase">Focus</span>
          </div>
        </div>
      </div>
    </div>

    {/* Waveform Visualization */}
    <div className="bg-gray-900 rounded-[50px] p-12 text-white relative overflow-hidden group">
      <div className="flex justify-between items-start relative z-10 mb-12">
        <div>
          <h3 className="text-3xl font-black mb-2">Neural Waveform</h3>
          <p className="text-gray-400 font-medium italic opacity-70">Detecting peak cognitive resonance...</p>
        </div>
        <div className="px-6 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-black uppercase tracking-widest">
          Daily Sync: Enabled
        </div>
      </div>
      <div className="h-48 relative">
        <svg viewBox="0 0 800 150" className="w-full h-full">
          <motion.path 
            initial={{ pathLength: 0 }} 
            animate={{ pathLength: 1 }} 
            transition={{ duration: 3, ease: "easeInOut" }}
            d="M0,100 Q100,20 200,80 T400,40 T600,100 T800,50" 
            fill="none" 
            stroke="url(#waveGradient)" 
            strokeWidth="6" 
            strokeLinecap="round" 
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <motion.circle 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            cx="400" cy="40" r="8" fill="#fff" 
            className="shadow-2xl shadow-white/50"
          />
        </svg>
      </div>
      <div className="flex justify-between mt-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] relative z-10">
        <span>Mon</span><span>Tue</span><span>Wed</span><span className="text-indigo-400">Thu (Peak)</span><span>Fri</span><span>Sat</span><span>Sun</span>
      </div>
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  </motion.div>
);

// --- 4. MAIN APP BRAIN ---
export default function App() {
  const [activeView, setActiveView] = useState('dash');
  const [currentContext, setContext] = useState('All');
  const [focusMode, setFocusMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="flex bg-[#FAFBFF] min-h-screen font-sans selection:bg-indigo-100 text-gray-900 antialiased">
      
      <Navigation active={activeView} setActive={setActiveView} currentContext={currentContext} setContext={setContext} />

      <main className="flex-1 p-8 lg:p-16 overflow-x-hidden">
        {/* Global HUD Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-16">
          <div className="space-y-1">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter">
              {activeView === 'dash' && "Command Center"}
              {activeView === 'plan' && "Attention Flow"}
              {activeView === 'team' && "Neural Sync"}
              {activeView === 'nexus' && "Intelligence"}
            </h2>
            <div className="flex items-center space-x-3">
               <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
               <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Flow Engine: Active</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 mt-8 md:mt-0">
            <div className="relative group">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input type="text" placeholder="Scan consciousness..." className="pl-14 pr-8 py-5 bg-white border border-gray-100 rounded-[24px] w-64 lg:w-[400px] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm transition-all text-sm font-bold" />
            </div>
            <button 
              onClick={() => setFocusMode(true)} 
              className="p-5 bg-gray-900 text-white rounded-[24px] hover:scale-105 transition-transform shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]"
            >
              <FiZap className="text-xl" />
            </button>
          </div>
        </header>

        {/* Dynamic View Engine */}
        <AnimatePresence mode="wait">
          {activeView === 'dash' && <DashboardView key="dash" context={currentContext} openModal={(item) => {setSelectedItem(item); setModalIsOpen(true);}} />}
          {activeView === 'plan' && <PlannerView key="plan" />}
          {activeView === 'team' && <TeamPulseView key="team" />}
          {activeView === 'nexus' && <NexusView key="nexus" />}
        </AnimatePresence>
      </main>

      {/* 5. THE SHIELD (DEEP FOCUS) */}
      <AnimatePresence>
        {focusMode && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-gray-900/98 z-[100] backdrop-blur-3xl flex flex-col items-center justify-center text-white"
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-12">
              <div className="space-y-4">
                <h2 className="text-8xl font-black tracking-tighter">Deep Focus</h2>
                <p className="text-2xl text-gray-400 font-light italic">"Quiet the mind, and the soul will speak."</p>
              </div>
              
              <div className="relative">
                <div className="text-[200px] font-mono font-thin text-indigo-400 leading-none">25:00</div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-[1px] border-indigo-500/20 rounded-full scale-150" 
                />
              </div>

              <button 
                onClick={() => setFocusMode(false)} 
                className="px-16 py-6 bg-white text-gray-900 rounded-full font-black text-xl hover:scale-110 transition-all shadow-2xl"
              >
                Deactivate Shield
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. CONTEXTUAL MODAL */}
      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)} 
        className="bg-white p-16 rounded-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] max-w-3xl mx-auto mt-20 outline-none border border-gray-50" 
        overlayClassName="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex justify-center z-[110]"
      >
        {selectedItem && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="flex justify-between items-center mb-10">
              <span className="text-xs font-black text-indigo-500 uppercase tracking-[0.3em]">Context Intelligence: {selectedItem.context}</span>
              <button onClick={() => setModalIsOpen(false)} className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors"><FiX /></button>
            </div>
            <h2 className="text-6xl font-black mb-8 tracking-tighter leading-tight text-gray-900">{selectedItem.subject}</h2>
            <p className="text-2xl text-gray-500 leading-relaxed mb-12">{selectedItem.body}</p>
            <div className="flex gap-6">
              <button className="flex-1 py-6 bg-indigo-600 text-white rounded-[24px] font-black text-xl shadow-2xl shadow-indigo-200 flex items-center justify-center space-x-3">
                <span>Draft Smart Reply</span>
                <FiZap />
              </button>
              <button className="px-10 py-6 bg-gray-100 text-gray-900 rounded-[24px] font-black text-xl hover:bg-gray-200 transition-colors">Archive</button>
            </div>
          </motion.div>
        )}
      </Modal>
    </div>
  );
}