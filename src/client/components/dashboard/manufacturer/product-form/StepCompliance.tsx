'use client';

import React from 'react';
import { useProductForm } from '../../../../context/ProductFormContext';
import { FaShieldAlt, FaCheckSquare, FaFilePdf } from 'react-icons/fa';

export default function StepCompliance() {
    const { productData, updateProductData } = useProductForm();
    const certs = productData.certifications || []; // Ensure certifications array exists

    const toggleCert = (cert: string) => {
        if (certs.includes(cert)) {
            updateProductData({ certifications: certs.filter((c: string) => c !== cert) });
        } else {
            updateProductData({ certifications: [...certs, cert] });
        }
    };

    const commonCerts = [
        "ISO 9001:2015",
        "CE Marking",
        "RoHS Compliance",
        "UL Certification",
        "FCC Compliance",
        "Energy Star"
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            <div className="flex-1 space-y-8">
                <div className="max-w-3xl">
                    <h2 className="text-2xl font-black tracking-tight text-[#1E293B]">Compliance & Certifications</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Ensure your product meets industry standards and regulations.</p>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <FaShieldAlt className="w-5 h-5 text-[#0F6CBD]" />
                        <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Select Certifications</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {commonCerts.map((cert) => (
                            <div
                                key={cert}
                                onClick={() => toggleCert(cert)}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${certs.includes(cert) ? 'border-[#0F6CBD] bg-blue-50/50' : 'border-slate-100 hover:border-blue-200'}`}
                            >
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 ${certs.includes(cert) ? 'bg-[#0F6CBD] border-[#0F6CBD] text-white' : 'border-slate-300 bg-white'}`}>
                                    {certs.includes(cert) && <FaCheckSquare className="w-4 h-4" />}
                                </div>
                                <span className={`text-xs font-bold ${certs.includes(cert) ? 'text-[#0F6CBD]' : 'text-[#1E293B]'}`}>{cert}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-80 space-y-6">
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <FaFilePdf className="w-4 h-4 text-[#0F6CBD]" />
                        <h3 className="text-sm font-black text-[#1E293B]">Upload Documents</h3>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug mb-4">Upload PDF copies of your certificates here.</p>
                    <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-xs font-black text-slate-400 hover:text-[#0F6CBD] hover:border-[#0F6CBD] transition-all">
                        + Upload Documents
                    </button>
                    <p className="text-[9px] text-slate-400 mt-2 text-center text-xs">(Uploads simulated in demo mode)</p>
                </div>
            </div>
        </div>
    );
}
