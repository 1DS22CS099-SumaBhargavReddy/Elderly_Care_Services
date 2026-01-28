import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, User, Shield, Ambulance, Siren, BellRing, Loader, CircleCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

const Emergency = () => {
    const [isActivating, setIsActivating] = useState(false);
    const [isNotified, setIsNotified] = useState(false);

    const contacts = [
        { name: 'Caretaker (Maria)', phone: '+1-234-567-8901', type: 'Caretaker', icon: User },
        { name: 'Son (David)', phone: '+1-987-654-3210', type: 'Relative', icon: Shield },
        { name: 'Ambulance', phone: '911', type: 'Medical', icon: Ambulance },
        { name: 'Local Police', phone: '911', type: 'Emergency', icon: Siren },
    ];

    const handleEmergency = async () => {
        setIsActivating(true);
        try {
            await api.post('/emergency/notify', {
                mode: 'sms/call',
                message: 'EMERGENCY: Fall detected or help requested by John Doe at Main Street 123.',
                contacts: contacts.map(c => c.phone)
            });
            setTimeout(() => {
                setIsActivating(false);
                setIsNotified(true);
            }, 2000);
        } catch (err) {
            console.error(err);
            setIsActivating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Emergency Support</h1>
                <p className="text-gray-400 text-lg">One-tap connection to your loved ones and emergency services.</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-12 py-8">
                <div className="relative">
                    <AnimatePresence>
                        {!isNotified ? (
                            <motion.button
                                onClick={handleEmergency}
                                disabled={isActivating}
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-64 h-64 rounded-full flex flex-col items-center justify-center space-y-4 shadow-2xl transition-all relative z-10 ${isActivating ? 'bg-red-800 cursor-not-allowed shadow-none' : 'bg-red-600 hover:bg-red-500 shadow-red-500/50'
                                    }`}
                            >
                                {isActivating ? (
                                    <Loader className="animate-spin text-white" size={64} />
                                ) : (
                                    <>
                                        <PhoneCall size={64} className="text-white" />
                                        <span className="text-2xl font-black text-white uppercase tracking-tighter">Emergency</span>
                                    </>
                                )}
                            </motion.button>
                        ) : (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-64 h-64 rounded-full bg-green-500 flex flex-col items-center justify-center space-y-4 shadow-2xl shadow-green-500/50 relative z-10"
                            >
                                <CircleCheck size={64} className="text-white" />
                                <span className="text-xl font-bold text-white uppercase tracking-tighter">Help is coming</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Animating pulse circles */}
                    {!isNotified && (
                        <>
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-red-600 rounded-full -z-0"
                            />
                            <motion.div
                                animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute inset-0 bg-red-600 rounded-full -z-0"
                            />
                        </>
                    )}
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                    {contacts.map((contact, idx) => (
                        <div key={idx} className="glass-card p-6 flex items-center justify-between group hover:bg-white/10 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
                                    <contact.icon className="text-gray-400 group-hover:text-primary-400" />
                                </div>
                                <div>
                                    <p className="font-bold">{contact.name}</p>
                                    <p className="text-sm text-gray-500">{contact.type} • {contact.phone}</p>
                                </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${isNotified ? 'bg-green-500' : 'bg-gray-700'}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                    <div className="p-4 bg-red-500/20 rounded-2xl">
                        <BellRing className="text-red-500" size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Fall Detection is Active</h3>
                        <p className="text-red-500/70">The system will automatically trigger this alert if a fall is detected.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsNotified(false)}
                    className="px-6 py-2 border border-red-500/40 text-red-500 hover:bg-red-500/10 rounded-xl text-sm font-bold transition-all"
                >
                    Cancel Alert
                </button>
            </div>
        </div>
    );
};

export default Emergency;
