import React, { useEffect, useState } from 'react';
import { Play, Timer, Dumbbell, Star, ExternalLink, Loader, CircleAlert, Clock } from 'lucide-react';
import api from '../lib/api';

const Fitness = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportExists, setReportExists] = useState(false);

    useEffect(() => {
        const fetchFitness = async () => {
            try {
                const checkRes = await api.get('/reports/summary');
                if (checkRes.data.ok && checkRes.data.summary) {
                    setReportExists(true);
                    const res = await api.post('/fitness/generate');
                    if (res.data.ok) setExercises(res.data.exercises);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchFitness();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-primary-500" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Aging Well: Physical Fitness</h1>
                    <p className="text-gray-400">Low-impact exercise routines tailored to your health status.</p>
                </div>
                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold">Today's Routine</button>
                    <button className="px-4 py-2 hover:bg-white/5 rounded-lg text-sm font-bold text-gray-400">Weekly Progress</button>
                </div>
            </div>

            {!reportExists ? (
                <div className="glass-card p-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto">
                        <Dumbbell className="text-primary-500" size={40} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">Ready to Move?</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Please upload a health report first so we can suggest safe, effective exercises for you.
                        </p>
                    </div>
                    <a
                        href="/reports"
                        className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all"
                    >
                        Go to Reports
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {exercises.map((ex, idx) => (
                        <div key={idx} className="glass-card overflow-hidden flex flex-col md:flex-row">
                            <div className="md:w-64 h-48 md:h-auto relative bg-gray-900 overflow-hidden">
                                {/* Fake YouTube Embed / Thumbnail */}
                                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(https://img.youtube.com/vi/${ex.videoUrl.split('v=')[1]}/hqdefault.jpg)` }} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <a
                                        href={ex.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                                    >
                                        <Play className="text-white fill-current translate-x-1" size={32} />
                                    </a>
                                </div>
                            </div>

                            <div className="flex-1 p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold">{ex.name}</h3>
                                        <p className="text-sm text-gray-400 mt-1">{ex.rationale}</p>
                                    </div>
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="text-yellow-500 fill-current" />)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Duration</p>
                                        <div className="flex items-center space-x-2 text-white font-bold">
                                            <Timer size={16} className="text-primary-400" />
                                            <span>{ex.setsOrDuration}</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Rest Timer</p>
                                        <div className="flex items-center space-x-2 text-white font-bold">
                                            <Clock size={16} className="text-primary-400" />
                                            <span>{ex.timer}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-xs font-bold text-primary-400 px-3 py-1 bg-primary-400/10 rounded-full">RECOMMENDED</span>
                                    <a
                                        href={ex.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-gray-400 flex items-center hover:text-white"
                                    >
                                        Open in YouTube <ExternalLink size={12} className="ml-1" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {reportExists && exercises.length === 0 && (
                <div className="glass-card p-12 text-center opacity-50 italic">
                    Based on the report, we are currently analyzing the best exercise regimen for you. Please check back in a few minutes.
                </div>
            )}
        </div>
    );
};

export default Fitness;
