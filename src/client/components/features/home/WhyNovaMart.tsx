import React from 'react';
import { FaShieldAlt, FaHandshake, FaUserShield, FaGem, FaAward, FaCheckCircle } from 'react-icons/fa';

const iconMap: Record<string, any> = {
    'FaShieldAlt': FaShieldAlt,
    'FaHandshake': FaHandshake,
    'FaUserShield': FaUserShield,
    'FaGem': FaGem,
    'FaAward': FaAward,
    'FaCheckCircle': FaCheckCircle
};

interface WhyNovaMartProps {
    features?: { icon?: any; title: string; desc: string }[];
}

export default function WhyNovaMart({ features = [] }: WhyNovaMartProps) {
    return (
        <section className="py-10 md:py-14 bg-gradient-to-b from-slate-50 to-white rounded-[24px] border border-white/50 overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/5 to-transparent" />
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-black/5 border border-foreground/10 text-sm font-semibold text-black mb-4">
                        Platform Governance
                    </div>
                    <h2 className="text-3xl xs:text-4xl lg:text-5xl font-bold text-black tracking-tight mb-6">
                        Why the world trusts <span className="text-[#1212A1] italic text-[48px]">NovaMart</span>
                    </h2>
                    <p className="text-sm xs:text-base text-foreground/60 font-medium italic">
                        "Building India's most secure digital bridge between manufacturers and global consumers."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature, idx) => {
                        const Icon = typeof feature.icon === 'string' ? (iconMap[feature.icon] || FaShieldAlt) : (feature.icon || FaShieldAlt);
                        return (
                            <div key={idx} className="p-6 xs:p-8 rounded-[20px] bg-white/40 backdrop-blur-xl border border-white/50 hover:border-white/80 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
                                <div className="w-12 h-12 xs:w-14 xs:h-14 rounded-[16px] bg-white/60 backdrop-blur-md flex items-center justify-center text-slate-900 mb-6 group-hover:bg-[#10367D] group-hover:text-white transition-all duration-300 border border-white/50 shadow-sm">
                                    <Icon className="w-5 h-5 xs:w-6 xs:h-6" />
                                </div>
                                <h3 className="text-base xs:text-lg font-black text-slate-900 mb-3 xs:mb-4">{feature.title}</h3>
                                <p className="text-[13px] xs:text-sm font-medium text-slate-500 leading-relaxed italic">
                                    "{feature.desc}"
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

