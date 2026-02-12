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
        <section className="py-10 md:py-14 bg-white rounded-[10px] border border-foreground/10 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-black/5 border border-foreground/10 text-[10px] font-black uppercase tracking-widest text-black mb-4">
                        Platform Governance
                    </div>
                    <h2 className="text-3xl xs:text-4xl lg:text-5xl font-black text-black tracking-tight mb-6 uppercase italic">
                        Why the world trusts <span className="text-black/40">NovaMart</span>
                    </h2>
                    <p className="text-sm xs:text-base text-foreground/60 font-medium italic">
                        "Building India's most secure digital bridge between manufacturers and global consumers."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature, idx) => {
                        const Icon = typeof feature.icon === 'string' ? (iconMap[feature.icon] || FaShieldAlt) : (feature.icon || FaShieldAlt);
                        return (
                            <div key={idx} className="p-6 xs:p-8 rounded-[10px] bg-white border border-foreground/10 hover:border-black/20 transition-all duration-300 group">
                                <div className="w-12 h-12 xs:w-14 xs:h-14 rounded-[10px] bg-black/5 flex items-center justify-center text-black mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                    <Icon className="w-5 h-5 xs:w-6 xs:h-6" />
                                </div>
                                <h3 className="text-base xs:text-lg font-black text-foreground mb-3 xs:mb-4">{feature.title}</h3>
                                <p className="text-[13px] xs:text-sm font-medium text-foreground/50 leading-relaxed italic">
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

