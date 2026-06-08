import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { FaUsers, FaHeartbeat, FaExclamationTriangle, FaSignOutAlt, FaChartLine, FaHistory } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_users: 0, total_predictions: 0, high_risk_count: 0 });
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://127.0.0.1:5000/api/admin/stats')
      .then(res => {
        setStats(res.data.data);
        // Simulate chart data based on current total
        setChartData([
          { name: 'Sen', total: Math.floor(res.data.data.total_predictions * 0.2) },
          { name: 'Sel', total: Math.floor(res.data.data.total_predictions * 0.4) },
          { name: 'Rab', total: Math.floor(res.data.data.total_predictions * 0.5) },
          { name: 'Kam', total: Math.floor(res.data.data.total_predictions * 0.7) },
          { name: 'Jum', total: Math.floor(res.data.data.total_predictions * 0.8) },
          { name: 'Sab', total: Math.floor(res.data.data.total_predictions * 0.9) },
          { name: 'Min', total: res.data.data.total_predictions }
        ]);
      })
      .catch(err => console.error(err));

    axios.get('http://127.0.0.1:5000/api/admin/activities')
      .then(res => {
        const users = res.data.data.users.map(u => ({ ...u, _type: 'user' }));
        const preds = res.data.data.predictions.map(p => ({ ...p, _type: 'pred' }));
        const combined = [...users, ...preds].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 15);
        setActivities(combined);
      })
      .catch(err => console.error(err));

    const socket = io('http://127.0.0.1:5000', { transports: ['polling'] });
    
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('new_activity', (payload) => {
      if (payload.type === 'new_user') {
        setStats(prev => ({ ...prev, total_users: prev.total_users + 1 }));
        setActivities(prev => [{ ...payload.data, _type: 'user' }, ...prev].slice(0, 15));
      } else if (payload.type === 'new_prediction') {
        setStats(prev => {
          const newTotal = prev.total_predictions + 1;
          setChartData(cData => {
            const newData = [...cData];
            newData[newData.length - 1].total = newTotal;
            return newData;
          });
          return { 
            ...prev, 
            total_predictions: newTotal,
            high_risk_count: payload.data.prediction === 1 ? prev.high_risk_count + 1 : prev.high_risk_count
          };
        });
        setActivities(prev => [{ ...payload.data, _type: 'pred' }, ...prev].slice(0, 15));
      }
    });

    return () => socket.disconnect();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', boxShadow: '0 4px 12px rgba(220,38,38,0.3)' }}>
            <FaHeartbeat className="text-white text-xl" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-xl text-slate-900 tracking-tight">HealthCare</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">Website for health</span>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary-600 hover:bg-primary-50 px-5 py-2.5 rounded-xl transition-all">
          <FaSignOutAlt /> Keluar
        </button>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Monitoring</h1>
          <p className="text-slate-500 text-sm mt-1">Ringkasan aktivitas dan metrik sistem klasifikasi jantung</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex items-center gap-5 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl">
              <FaUsers />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Total Pengguna</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{stats.total_users}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex items-center gap-5 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-3xl">
              <FaChartLine />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Total Prediksi</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{stats.total_predictions}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex items-center gap-5 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center text-3xl">
              <FaExclamationTriangle />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Risiko Tinggi</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{stats.high_risk_count}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-6">
            <h2 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
              <FaChartLine className="text-emerald-500" />
              Tren Penggunaan Sistem
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex flex-col h-[400px] lg:h-auto">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl shrink-0">
              <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <FaHistory className="text-blue-500" />
                Live Feed
              </h2>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full animate-pulse shadow-sm shadow-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                LIVE
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <FaHistory className="text-4xl mb-3 opacity-20" />
                  <p className="text-sm">Belum ada aktivitas</p>
                </div>
              ) : (
                activities.map((act, i) => (
                  <div key={i} className="px-4 py-4 hover:bg-slate-50 transition-colors flex items-start gap-4 rounded-xl mx-2 my-1">
                    {act._type === 'user' ? (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-200">
                        <FaUsers />
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${act.prediction === 1 ? 'bg-primary-100 text-primary-600 border border-primary-200' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'}`}>
                        {act.prediction === 1 ? <FaExclamationTriangle /> : <FaHeartbeat />}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 leading-snug">
                        {act._type === 'user' 
                          ? <span>Registrasi pengguna baru: <span className="font-semibold text-slate-900">{act.username}</span></span>
                          : <span>Prediksi baru <span className={`font-semibold ${act.prediction === 1 ? 'text-primary-600' : 'text-emerald-600'}`}>{act.prediction === 1 ? 'Risiko Tinggi' : 'Risiko Rendah'}</span> ({act.probability}%)</span>
                        }
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium mt-1.5">{new Date(act.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
