import React from 'react';
import { FaBuilding as Building2 } from 'react-icons/fa';

const topManufacturers = [
    { name: "Samsung", location: "South Korea" },
    { name: "LG", location: "South Korea" },
    { name: "Whirlpool", location: "USA" },
    { name: "Bosch", location: "Germany" },
    { name: "Panasonic", location: "Japan" },
    { name: "Sony", location: "Japan" },
    { name: "Haier", location: "China" },
    { name: "Godrej", location: "India" },
    { name: "Voltas", location: "India" },
    { name: "IFB", location: "India" },
    { name: "Hitachi", location: "Japan" },
    { name: "More Brands", location: "Global" }
];

export default function ManufacturersGrid() {
    return (
        <div className="max-w-7xl mx-auto px-6 mb-32 relative z-20">
            <div className="bg-surface rounded-[1rem] p-8 lg:p-12 shadow-2xl shadow-primary/5 border border-foreground/5">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Top Manufacturers</h2>
                    <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest mt-2">Certified Direct Supply Partners</p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8">
                    {topManufacturers.map((brand, idx) => (
                        <div key={idx} className="flex flex-col items-center group cursor-pointer">
                            <div className="w-20 h-20 rounded-full border-2 border-foreground/5 flex items-center justify-center bg-background group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                                {idx === topManufacturers.length - 1 ? (
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 rounded-full bg-foreground/20 group-hover:bg-primary" />
                                        <div className="w-1 h-1 rounded-full bg-foreground/20 group-hover:bg-primary" />
                                        <div className="w-1 h-1 rounded-full bg-foreground/20 group-hover:bg-primary" />
                                    </div>
                                ) : (
                                    <Building2 className="w-8 h-8 text-foreground/20 group-hover:text-primary transition-colors" />
                                )}
                            </div>
                            <span className="text-xs font-bold text-foreground/60 mt-4 group-hover:text-primary transition-colors">{brand.name}</span>
                            {brand.location && <span className="text-[10px] font-medium text-foreground/40 mt-1">{brand.location}</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

