"use client";

import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { useAppContext } from '@/context/AppContext';
import { 
  TrendingUp, 
  Briefcase, 
  Target, 
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const { state } = useAppContext();

  const appStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    state.apps.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [state.apps]);

  const timelineData = useMemo(() => {
    const months: Record<string, number> = {};
    state.apps.forEach(app => {
      const date = new Date(app.date);
      const key = date.toLocaleString('default', { month: 'short' });
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months).map(([name, count]) => ({ name, count }));
  }, [state.apps]);

  const skillCoverage = useMemo(() => {
    if (state.apps.length === 0) return [
      { name: 'TypeScript', value: 85 },
      { name: 'React', value: 90 },
      { name: 'Node.js', value: 65 },
      { name: 'AWS', value: 40 },
      { name: 'System Design', value: 75 },
    ];
    return [
      { name: 'Frontend', value: 88 },
      { name: 'Backend', value: 72 },
      { name: 'Cloud', value: 45 },
      { name: 'Testing', value: 60 },
      { name: 'Algorithms', value: 95 },
    ];
  }, [state.apps]);

  const totalApps = state.apps.length;
  const interviewing = state.apps.filter(a => a.status === 'Interviewing').length;
  const offers = state.apps.filter(a => a.status === 'Offer Received').length;

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Job Search Analytics</h1>
          <p className="text-slate-400 mt-1">Real-time breakdown of your application funnel and performance.</p>
        </div>
        <Card className="px-4 py-2 border-slate-800 bg-slate-900/50 flex items-center gap-2">
           <Clock className="w-4 h-4 text-emerald-400" />
           <span className="text-xs font-bold text-slate-300 uppercase">Last 30 Days</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Applications" 
          value={totalApps} 
          icon={<Briefcase className="w-6 h-6" />}
          trend="+12% from last wk"
          color="blue"
        />
        <StatCard 
          title="Active Interviews" 
          value={interviewing} 
          icon={<Activity className="w-6 h-6" />}
          trend="3 this week"
          color="emerald"
        />
        <StatCard 
          title="Offer Rate" 
          value={`${totalApps ? Math.round((offers/totalApps)*100) : 0}%`} 
          icon={<Target className="w-6 h-6" />}
          trend="Top 5% of users"
          color="cyan"
        />
        <StatCard 
          title="Skill Readiness" 
          value="84%" 
          icon={<TrendingUp className="w-6 h-6" />}
          trend="Improving"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 border-slate-800 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-8">
            <PieChartIcon className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold">Application Status</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={appStatusData.length ? appStatusData : [{name: 'No Data', value: 1}]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(appStatusData.length ? appStatusData : [{name: 'No Data', value: 1}]).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border-slate-800 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold">Monthly Activity</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="count" stroke="#06b6d4" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border-slate-800 bg-slate-900/50 backdrop-blur-xl lg:col-span-2">
          <div className="flex items-center gap-2 mb-8">
             <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold">Skill Match Analysis</h2>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillCoverage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40}>
                  {skillCoverage.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 80 ? '#10b981' : entry.value > 60 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <Card className="p-6 border-slate-800 bg-slate-900/50 backdrop-blur-xl transition-all hover:border-slate-700 hover:translate-y-[-2px]">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl ${colorMap[color]} border`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-slate-100">{value}</div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{title}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-400`}>
          {trend}
        </span>
        <div className="h-[2px] flex-1 bg-slate-800 rounded-full" />
      </div>
    </Card>
  );
}
