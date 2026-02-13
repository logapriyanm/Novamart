import React from 'react';
import { FaBuilding as Building2 } from 'react-icons/fa';

interface ManufacturersGridProps {
    manufacturers?: { name: string; location?: string; image: string | null }[];
}

export default function ManufacturersGrid({ manufacturers = [] }: ManufacturersGridProps) {
    if (manufacturers.length === 0) return null;

    return (
        <div className="max-w-7xl mx-auto px-6 mb-32 relative z-20">
            <div className="bg-white rounded-[10px] p-8 lg:p-12 border border-foreground/10">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-black tracking-tight">Top manufacturers</h2>
                    <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest mt-2">Certified Direct Supply Partners</p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8">
                    {manufacturers.map((brand, idx) => (
                        <div key={idx} className="flex flex-col items-center group cursor-pointer">
                            <div className="w-20 h-20 rounded-[10px] border border-foreground/10 flex items-center justify-center bg-white p-2 group-hover:border-black/20 transition-all duration-300">
                                {brand.image ? (
                                    <img
                                        src={brand.image}
                                        alt={brand.name}
                                        className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100 transition-all duration-500"
                                    />
                                ) : (
                                    <Building2 className="w-8 h-8 text-foreground/10 group-hover:text-black transition-colors" />
                                )}
                            </div>
                            <span className="text-xs font-bold text-foreground/40 mt-4 group-hover:text-black transition-colors uppercase">{brand.name}</span>
                            {brand.location && <span className="text-sm font-medium text-foreground/20 mt-1">{brand.location}</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

