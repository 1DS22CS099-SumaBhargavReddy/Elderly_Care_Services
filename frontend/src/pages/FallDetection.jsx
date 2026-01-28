import React from 'react';
import { ShieldCheck, Activity, Cpu, Box, Radio } from 'lucide-react';

const FallDetection = () => {
    const url = 'https://fall-detection.vercel.app/';

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                        <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">Neural Fall Sentinel</h1>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">External AI Engine • Real-time Biometric Posture Sync</p>
                </div>

                <div className="flex items-center space-x-4 bg-white/5 p-1 rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-primary-500/10 rounded-xl border border-primary-500/20">
                        <ShieldCheck className="text-primary-400" size={16} />
                        <span className="text-xs font-black text-primary-400 uppercase">Live Analysis</span>
                    </div>
                    <div className="flex -space-x-2 pr-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gray-800 flex items-center justify-center">
                                <Activity size={12} className="text-gray-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Engine Frame */}
            <div className="flex-1 relative group">
                {/* Decorative High-Tech Corner Accents */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary-500/50 rounded-tl-xl z-30" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-primary-500/50 rounded-tr-xl z-30" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-primary-500/50 rounded-bl-xl z-30" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-primary-500/50 rounded-br-xl z-30" />

                <div className="w-full h-full glass-card overflow-hidden relative rounded-[32px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col">
                    {/* Top Console Bar */}
                    <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-6 shrink-0">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <Cpu size={14} className="text-primary-400" />
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Model: PostureNet_v4_Ext</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Radio size={14} className="text-green-500 animate-pulse" />
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Signal: Optimal</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">Record Active</span>
                        </div>
                    </div>

                    <div className="flex-1 relative bg-black">
                        {/* Futuristic Loading State overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 -z-10">
                            <div className="relative">
                                <div className="w-20 h-20 border-2 border-primary-500/20 rounded-full scale-150 animate-ping" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-t-primary-500 border-r-transparent border-b-primary-500 border-l-transparent rounded-full animate-spin" />
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-lg font-black text-white uppercase tracking-tighter">Establishing Neural Link</p>
                                <p className="text-xs text-primary-400/60 font-mono">0x7F... CONNECTING TO CLOUD_ENGINE</p>
                            </div>
                        </div>

                        {/* The Actual Engine */}
                        <iframe
                            allow="camera *; microphone *;"
                            title="External Fall Detection"
                            src={url}
                            className="w-full h-full border-none relative z-10"
                            loading="eager"
                        />

                        {/* Subtle HUD Grids overlaying the iframe for flavor (pointer-events-none) */}
                        <div className="absolute inset-0 pointer-events-none z-20">
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent animate-scan" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Status Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                <div className="glass-card p-4 flex items-center space-x-4 border-primary-500/20 bg-primary-500/5">
                    <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center shrink-0">
                        <Box className="text-primary-400" size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Encryption</p>
                        <p className="text-sm font-bold text-white">End-to-End Secure</p>
                    </div>
                </div>

                <div className="md:col-span-2 glass-card p-4 flex items-center justify-between border-white/5 px-8">
                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-1">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-1.5 h-6 bg-primary-500/20 rounded-full" />)}
                        </div>
                        <p className="text-xs font-medium text-gray-400 max-w-md">
                            The cloud-based pose estimation engine is currently processing your skeletal data. Stand within view of the camera for calibration.
                        </p>
                    </div>
                    <button className="px-6 py-2 bg-white text-black text-xs font-black uppercase rounded-xl hover:bg-gray-200 transition-all">
                        Engine Settings
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(100vh); }
                }
                .animate-scan {
                    animation: scan 8s linear infinite;
                }
            `}} />
        </div>
    );
};

export default FallDetection;
