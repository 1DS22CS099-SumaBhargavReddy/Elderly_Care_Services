import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CircleCheck, Loader, CircleAlert } from 'lucide-react';
import api from '../lib/api';

const HealthReports = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
        setError(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        multiple: false
    });

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/reports/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setReportData(response.data.parsedData);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to upload and parse file. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Health Report Center</h1>
                <p className="text-gray-400">Upload your PDF or Excel reports to get AI-powered health insights.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div
                        {...getRootProps()}
                        className={`glass-card p-12 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 ${isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:border-white/20'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center">
                            <Upload className="text-primary-400" size={32} />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium">{file ? file.name : 'Click to upload or drag & drop'}</p>
                            <p className="text-sm text-gray-500">PDF, XLSX, XLS up to 10MB</p>
                        </div>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${!file || loading
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                            }`}
                    >
                        {loading ? <Loader className="animate-spin" /> : <CircleCheck />}
                        <span>{loading ? 'Analyzing Report...' : 'Analyze Health Report'}</span>
                    </button>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3 text-red-500">
                            <CircleAlert size={20} />
                            <p>{error}</p>
                        </div>
                    )}
                </div>

                <div className="glass-card p-8 h-[500px] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center space-x-2">
                            <FileText className="text-primary-400" />
                            <span>Extracted Data</span>
                        </h3>
                        {reportData && (
                            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20">
                                PROCESSED
                            </span>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                        {reportData ? (
                            reportData.sections.length > 0 ? (
                                reportData.sections.map((section, idx) => (
                                    <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-1">{section.key}</p>
                                        <p className="text-white">{section.value}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                    <p>No sections found in the report. Make sure your file is clear.</p>
                                </div>
                            )
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                                <FileText size={48} />
                                <p>Upload a report to see the extracted data here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthReports;
