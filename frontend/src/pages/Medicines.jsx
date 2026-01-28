import React, { useEffect, useState } from 'react';
import { Pill, Clock, Info, ShieldCheck, CircleAlert, Loader, Activity } from 'lucide-react';
import api from '../lib/api';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportExists, setReportExists] = useState(false);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const checkRes = await api.get('/reports/summary');
                if (checkRes.data.ok && checkRes.data.summary) {
                    setReportExists(true);
                    const res = await api.post('/medicines/generate');
                    if (res.data.ok) setMedicines(res.data.items);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchMedicines();
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
                    <h1 className="text-3xl font-bold">Medicines & Prescriptions</h1>
                    <p className="text-gray-400">AI-generated suggestions based on your latest clinical data.</p>
                </div>
                <div className="px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center space-x-2">
                    <ShieldCheck className="text-primary-400" size={18} />
                    <span className="text-sm font-semibold text-primary-400">Verified by Medical AI</span>
                </div>
            </div>

            {!reportExists ? (
                <div className="glass-card p-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
                        <CircleAlert className="text-yellow-500" size={40} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">No Health Report Found</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            To generate medicine suggestions, please upload a health report (PDF or Excel) in the Reports section first.
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {medicines.length > 0 ? (
                        medicines.map((med, idx) => (
                            <div key={idx} className="glass-card overflow-hidden group hover:border-primary-500/50 transition-all">
                                <div className="p-6 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
                                            <Pill className="text-gray-400 group-hover:text-primary-400" />
                                        </div>
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-gray-400">
                                            {med.form}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{med.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1 italic">{med.rationale}</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 py-4 border-t border-white/5 mt-4">
                                        <div className="flex items-center space-x-3 text-sm">
                                            <Clock className="text-primary-400" size={16} />
                                            <span className="text-gray-300 font-medium">Timing: <span className="text-white">{med.time}</span></span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <Info className="text-primary-400" size={16} />
                                            <span className="text-gray-300 font-medium">Usage: <span className="text-white">{med.usage}</span></span>
                                        </div>
                                        {med.ml > 0 && (
                                            <div className="flex items-center space-x-3 text-sm">
                                                <Activity className="text-primary-400" size={16} />
                                                <span className="text-gray-300 font-medium">Dosage: <span className="text-white">{med.ml} ml</span></span>
                                            </div>
                                        )}
                                    </div>

                                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors">
                                        Mark as Taken
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full glass-card p-12 text-center opacity-50 italic">
                            The AI didn't find specific medication requirements in your report. This is generally a good sign!
                            Please consult your doctor for a professional consultation.
                        </div>
                    )}
                </div>
            )}

            <div className="glass-card p-6 border-yellow-500/20 bg-yellow-500/5">
                <div className="flex items-start space-x-4">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <CircleAlert className="text-yellow-500" size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-yellow-500">Medical Disclaimer</h4>
                        <p className="text-sm text-yellow-500/70 mt-1">
                            Suggestions provided by ElderCare AI are for informational purposes only based on the uploaded clinical reports.
                            Always consult with a qualified healthcare provider before starting or stopping any medication.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Medicines;
