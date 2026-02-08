import React from 'react';
import { FaShieldAlt, FaHandshake, FaUserShield, FaGem } from 'react-icons/fa';

const features = [
    {
        icon: FaShieldAlt,
        title: 'Rule-First Governance',
        desc: 'Every transaction is protected by state-enforced escrow protocols. Your money never leaves the hub until you verify the goods.'
    },
    {
        icon: FaHandshake,
        title: 'Verified Manufacturer Network',
        desc: 'We bypass middlemen. You deal directly with factories that have passed our 5-stage TrustSEAL verification process.'
    },
    {
        icon: FaUserShield,
        title: 'Dispute Resolution',
        desc: 'Our dedicated governance team ensures fair outcomes for any quality disagreements, with full auditability.'
    },
    {
        icon: FaGem,
        title: 'Protocol-Grade Quality',
        desc: 'Standardized testing and certification for every appliance listed. Quality is no longer a gamble.'
    }
];

export default function WhyNovaMart() {
    return (
        <section className="py-20 bg-background rounded-[3rem] border border-primary/5 shadow-sm overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary mb-4">
                        Platform Governance
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight mb-6">
                        Why the world trusts <span className="text-primary">NovaMart</span>
                    </h2>
                    <p className="text-foreground/60 font-medium italic">
                        "Building India's most secure digital bridge between manufacturers and global consumers."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="p-8 rounded-[2rem] bg-surface border border-foreground/5 hover:border-primary/20 transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-2xl bg-background shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-background transition-all duration-300">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-foreground mb-4">{feature.title}</h3>
                            <p className="text-sm font-medium text-foreground/50 leading-relaxed italic">
                                "{feature.desc}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

