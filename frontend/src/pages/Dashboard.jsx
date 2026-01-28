import React, { useEffect, useState } from 'react';
import {
    Activity,
    TrendingUp,
    TriangleAlert,
    Clock,
    CircleCheck,
    Calendar,
    ChevronRight,
    Loader
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';

const StatCard = ({ title, value, subValue, icon: Icon, color }) => (
    <div className="glass-card p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-${color}-500/10`}>
                <Icon className={`text-${color}-500`} size={24} />
            </div>
            <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Live</span>
        </div>
        <div>
            <h3 className="text-white/60 text-sm font-medium">{title}</h3>
            <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-white">{value}</span>
                <span className="text-xs text-green-400 font-bold">{subValue}</span>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [meds, setMeds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryRes, medsRes] = await Promise.all([
                    api.get('/reports/summary'),
                    api.post('/medicines/generate')
                ]);
                if (summaryRes.data.ok) setSummary(summaryRes.data.summary);
                if (medsRes.data.ok) setMeds(medsRes.data.items);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Welcome back</h1>
                    <p className="text-gray-400">Everything looks great today. Here's your health overview.</p>
                </div>
                <div className="flex space-x-3">
                    <div className="px-4 py-2 glass-card flex items-center space-x-2">
                        <Calendar size={18} className="text-primary-400" />
                        <span className="text-sm font-medium">
                            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Heart Rate"
                    value={summary?.vitalSigns?.heartRate || '--'}
                    subValue={summary ? 'bpm' : 'No data'}
                    icon={Activity}
                    color="primary"
                />
                <StatCard
                    title="Daily Steps"
                    value={summary?.metrics?.steps || '--'}
                    subValue={summary ? (summary.metrics?.stepsChange || '+0%') : 'No data'}
                    icon={TrendingUp}
                    color="green"
                />
                <StatCard
                    title="Fall Risk"
                    value="Active"
                    subValue="Sensing"
                    icon={TriangleAlert}
                    color="blue"
                />
                <StatCard
                    title="Report Status"
                    value={summary ? 'Parsed' : 'Empty'}
                    subValue={summary ? `${summary.sectionsCount} items` : 'No report'}
                    icon={CircleCheck}
                    color="indigo"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl text-white font-bold">Medication Schedule</h3>
                        <button className="text-primary-400 text-sm font-bold flex items-center hover:text-primary-300 transition-colors">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-8"><Loader className="animate-spin text-primary-400" /></div>
                        ) : meds && meds.length > 0 ? (
                            meds.map((med, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl group hover:bg-white/10 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                            <Clock className="text-gray-400 group-hover:text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold">{med.name}</p>
                                            <p className="text-sm text-gray-500">{med.time}</p>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1 rounded-full border text-xs font-bold border-primary-500/20 text-primary-500 bg-primary-500/5`}>
                                        Scheduled
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 italic">No medications scheduled. Upload a report to generate recommendations.</div>
                        )}
                    </div>
                </div>

                <div className="glass-card p-8 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={80} className="text-primary-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-6 text-white">Health Insights</h3>
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                        <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center border border-primary-500/30 shadow-lg shadow-primary-500/10">
                            <Activity className="text-primary-400" size={40} />
                        </div>
                        <div>
                            <p className="font-bold text-white text-lg">AI Health Prediction</p>
                            <p className="text-sm text-gray-400 px-4 mt-2 leading-relaxed">
                                {summary
                                    ? `Based on your analysis, your vitality score is ${summary.metrics?.vitalityScore || '88'}%. Your health trends are moving in the right direction!`
                                    : "Upload your latest clinical report to unlock AI-powered longevity insights and health predictions."
                                }
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = '/reports'}
                            className="w-full py-3 bg-white text-black rounded-xl font-bold shadow-lg shadow-white/10 hover:bg-gray-100 transition-colors"
                        >
                            {summary ? 'View Deep Analysis' : 'Upload Report'}
                        </motion.button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
