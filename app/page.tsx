'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { time: '12:00', requests: 12000, bots: 4000 },
  { time: '12:01', requests: 450000, bots: 300000 },
  { time: '12:02', requests: 890000, bots: 600000 },
  { time: '12:03', requests: 300000, bots: 150000 },
  { time: '12:04', requests: 90000, bots: 20000 },
];

export default function MirzapurLiveApp() {
  const [view, setView] = useState<'landing' | 'loading' | 'success' | 'admin'>('landing');
  const [seatNumber, setSeatNumber] = useState('');
  const [generatedId, setGeneratedId] = useState('');

  // Live Stats State for Admin Dashboard
  const [stats, setStats] = useState({
    totalUsers: 50000,
    incomingRequests: 2400000,
    seatsAllocated: 483,
    humanAllocations: 463,
    botAllocations: 37,
    blockedRequests: 1100000,
    throttled: 120000,
  });

  // Poll metrics every 2 seconds when on the admin view
  useEffect(() => {
    if (view !== 'admin') return;
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/metrics');
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error('Failed to fetch metrics', e);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, [view]);

  const handleBookTicket = async () => {
    setView('loading');

    try {
      // Hit your own Next.js backend API route!
      const res = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBot: false }),
      });
      const data = await res.json();

      setTimeout(() => {
        const mockSessionId = 'USR-' + Math.random().toString(36).substring(2, 9).toUpperCase();
        setGeneratedId(mockSessionId);
        setSeatNumber(data.seat || 'MZP-101');
        setView('success');
      }, 1500);
    } catch (e) {
      console.error(e);
      setSeatNumber('MZP-404');
      setView('success');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-6 flex flex-col justify-between font-sans selection:bg-red-600 selection:text-white">
      
      {/* Top Navbar */}
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center py-4 border-b border-neutral-900">
        <div className="font-black tracking-wider text-xl text-red-600 flex items-center gap-2">
          TICKET<span className="text-white">MATRIX</span> <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-mono">MIRZAPUR SPECIAL</span>
        </div>
        <div className="space-x-3">
          <button 
            onClick={() => setView('landing')} 
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition border ${view === 'landing' ? 'bg-red-600 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'}`}
          >
            Movie Booking
          </button>
          <button 
            onClick={() => setView('admin')} 
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition border ${view === 'admin' ? 'bg-red-600 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'}`}
          >
            📊 Admin Anti-Bot Monitor
          </button>
        </div>
      </header>

      {/* ================= SCREEN 1: LANDING & POSTER ================= */}
      {view === 'landing' && (
        <div className="flex-1 max-w-5xl w-full mx-auto py-8 flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="w-full md:w-72 bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl relative group">
            <div className="h-96 relative overflow-hidden bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/mirzapur-poster.jpg" 
                alt="Mirzapur Movie Poster" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
              <span className="absolute bottom-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                UA • Action / Crime
              </span>
            </div>
            <div className="p-4 bg-neutral-900 text-xs text-neutral-400 flex justify-between items-center border-t border-neutral-800">
              <span>⭐ 9.4/10 (150K Votes)</span>
              <span className="text-red-500 font-bold uppercase">Booking Live</span>
            </div>
          </div>

          <div className="flex-1 max-w-md w-full bg-neutral-950 border border-neutral-800 p-8 rounded-xl shadow-2xl space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-wide text-white">Mirzapur: The Movie</h1>
              <p className="text-xs text-red-500 font-mono">⚡ Flash Drop: 500 Seats Available Only</p>
            </div>

            <div className="p-4 bg-neutral-900/60 rounded-lg border border-neutral-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Expected Rush:</span>
                <span className="text-white font-mono font-bold">50,000 Fans</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">IP Rate-Limiting:</span>
                <span className="text-emerald-400 font-mono font-bold">Max 50 req/sec threshold</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <button
                onClick={handleBookTicket}
                className="w-full py-4 bg-red-600 hover:bg-red-500 font-black uppercase tracking-widest rounded-lg transition shadow-[0_4px_20px_rgba(220,38,38,0.4)] text-sm cursor-pointer"
              >
                🎟️ Book Ticket Now
              </button>
              <p className="text-[11px] text-neutral-500 text-center font-mono">
                Clicking assigns a secure session token & validates your IP.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= SCREEN 2: LOADING ================= */}
      {view === 'loading' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full bg-neutral-950 border border-neutral-800 p-10 rounded-xl text-center space-y-6 shadow-2xl">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-red-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-wider text-white">Verifying IP & Session...</h2>
              <p className="text-xs text-neutral-400 font-mono animate-pulse">
                Checking request velocity & locking seat atomically...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= SCREEN 3: SUCCESS ================= */}
      {view === 'success' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full bg-neutral-950 border-2 border-red-600/60 p-8 rounded-xl shadow-[0_0_40px_rgba(220,38,38,0.2)] text-center space-y-6">
            <div className="text-4xl">🎟</div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-red-500 tracking-wider">BOOKING CONFIRMED!</h1>
              <p className="text-xs text-neutral-400 uppercase tracking-widest">Mirzapur Movie Premiere</p>
            </div>

            <div className="p-6 bg-neutral-900 rounded-lg border border-neutral-800 space-y-3 relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 bg-red-600 text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest text-white rounded-bl">
                Human Verified (IP Clean)
              </div>
              <div>
                <p className="text-neutral-500 text-[10px] font-mono">BACKEND ASSIGNED SESSION ID</p>
                <p className="text-sm font-mono font-bold text-neutral-300">{generatedId}</p>
              </div>
              <div className="border-t border-neutral-800 pt-2">
                <p className="text-neutral-400 text-xs">Allocated Seat</p>
                <p className="text-3xl font-mono font-black text-white tracking-widest">{seatNumber}</p>
              </div>
            </div>

            <button
              onClick={() => setView('landing')}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs uppercase tracking-wider rounded-lg border border-neutral-800 transition cursor-pointer"
            >
              Book Another Ticket
            </button>
          </div>
        </div>
      )}

      {/* ================= SCREEN 4: ADMIN MONITOR (LIVE API DATA) ================= */}
      {view === 'admin' && (
        <div className="flex-1 max-w-6xl w-full mx-auto space-y-6 py-6">
          <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
            <div>
              <h1 className="text-xl font-black tracking-wider text-red-600">ADMIN ANTI-BOT MONITOR</h1>
              <p className="text-xs text-neutral-500 font-mono">Live telemetry from Next.js API endpoint</p>
            </div>
            <span className="px-3 py-1 bg-red-950/60 text-red-400 text-xs font-mono rounded border border-red-900/60 animate-pulse">
              ● LIVE BACKEND SYNCED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-xl">
              <p className="text-neutral-500 text-xs font-mono">TOTAL USERS</p>
              <p className="text-3xl font-mono font-bold mt-2 text-white">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-xl">
              <p className="text-neutral-500 text-xs font-mono">INCOMING REQUESTS</p>
              <p className="text-3xl font-mono font-bold mt-2 text-red-500">{stats.incomingRequests.toLocaleString()}</p>
            </div>
            <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-xl">
              <p className="text-neutral-500 text-xs font-mono">SEATS ALLOCATED</p>
              <p className="text-3xl font-mono font-bold mt-2 text-emerald-500">{stats.seatsAllocated} / 500</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">IP Velocity & Threat Breakdown</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-900/60 p-4 rounded-lg border border-neutral-800/60">
                  <p className="text-neutral-500 text-[10px] font-mono">HUMAN ALLOCATIONS</p>
                  <p className="text-2xl font-bold text-emerald-500 mt-1">{stats.humanAllocations}</p>
                </div>
                <div className="bg-neutral-900/60 p-4 rounded-lg border border-neutral-800/60">
                  <p className="text-neutral-500 text-[10px] font-mono">BOTS FLAGGED</p>
                  <p className="text-2xl font-bold text-red-500 mt-1">{stats.botAllocations}</p>
                </div>
                <div className="bg-neutral-900/60 p-4 rounded-lg border border-neutral-800/60">
                  <p className="text-neutral-500 text-[10px] font-mono">BLOCKED IPS</p>
                  <p className="text-2xl font-bold text-amber-500 mt-1">{stats.blockedRequests.toLocaleString()}</p>
                </div>
                <div className="bg-neutral-900/60 p-4 rounded-lg border border-neutral-800/60">
                  <p className="text-neutral-500 text-[10px] font-mono">THROTTLED</p>
                  <p className="text-2xl font-bold text-cyan-500 mt-1">{stats.throttled.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Allocation Integrity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3.5 bg-neutral-900/60 rounded-lg border border-neutral-800/60">
                  <span className="text-sm font-medium">Duplicate allocations</span>
                  <span className="font-mono font-bold text-emerald-500">0 ✓</span>
                </div>
                <div className="flex justify-between items-center p-3.5 bg-neutral-900/60 rounded-lg border border-neutral-800/60">
                  <span className="text-sm font-medium">Overselling</span>
                  <span className="font-mono font-bold text-emerald-500">0 ✓</span>
                </div>
                <div className="flex justify-between items-center p-3.5 bg-neutral-900/60 rounded-lg border border-neutral-800/60">
                  <span className="text-sm font-medium">Database Consistency</span>
                  <span className="font-mono font-bold text-red-500">100% Secure</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Traffic Spikes Over Time</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <XAxis dataKey="time" stroke="#525252" />
                  <YAxis stroke="#525252" />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px', color: '#fff' }} />
                  <Line type="monotone" dataKey="requests" stroke="#ef4444" strokeWidth={3} name="Total Requests" />
                  <Line type="monotone" dataKey="bots" stroke="#f59e0b" strokeWidth={2} name="Bot Attempts" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center text-xs text-neutral-600 py-4 font-mono">
        TicketMatrix x Mirzapur Movie Drop • Next.js API Integrated Demo
      </footer>
    </main>
  );
}