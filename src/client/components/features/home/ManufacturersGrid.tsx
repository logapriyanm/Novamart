import React from 'react';
import { FaBuilding as Building2 } from 'react-icons/fa';

const topManufacturers = [
    { name: "Samsung", location: "South Korea", image: "/assets/Brands/Samsung.png" },
    { name: "LG", location: "South Korea", image: "/assets/Brands/LG.png" },
    { name: "Whirlpool", location: "USA", image: "/assets/Brands/Whirpool.png" },
    { name: "Bosch", location: "Germany", image: "/assets/Brands/Bosch.png" },
    { name: "Panasonic", location: "Japan", image: "/assets/Brands/Panasonic.png" },
    { name: "Sony", location: "Japan", image: "/assets/Brands/Sony.png" },
    { name: "Haier", location: "China", image: "/assets/Brands/Haier.png" },
    { name: "Godrej", location: "India", image: "/assets/Brands/Godrej.png" },
    { name: "Voltas", location: "India", image: "/assets/Brands/Voltas.png" },
    { name: "IFB", location: "India", image: "/assets/Brands/IFB.png" },
    { name: "Hitachi", location: "Japan", image: null }, // No image available
    { name: "More Brands", location: "Global", image: null }
];

export default function ManufacturersGrid() {
    return (
        <div className="max-w-7xl mx-auto px-6 mb-32 relative z-20">
            <div className="bg-white rounded-[10px] p-8 lg:p-12 border border-foreground/10">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-black tracking-tight uppercase italic">Top Manufacturers</h2>
                    <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest mt-2">Certified Direct Supply Partners</p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8">
                    {topManufacturers.map((brand, idx) => (
                        <div key={idx} className="flex flex-col items-center group cursor-pointer">
                            <div className="w-20 h-20 rounded-[10px] border border-foreground/10 flex items-center justify-center bg-white p-2 group-hover:border-black/20 transition-all duration-300">
                                {brand.image ? (
                                    <img
                                        src={brand.image}
                                        alt={brand.name}
                                        className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100 transition-all duration-500"
                                    />
                                ) : idx === topManufacturers.length - 1 ? (
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 rounded-full bg-foreground/20 group-hover:bg-black" />
                                        <div className="w-1 h-1 rounded-full bg-foreground/20 group-hover:bg-black" />
                                        <div className="w-1 h-1 rounded-full bg-foreground/20 group-hover:bg-black" />
                                    </div>
                                ) : (
                                    <Building2 className="w-8 h-8 text-foreground/10 group-hover:text-black transition-colors" />
                                )}
                            </div>
                            <span className="text-xs font-bold text-foreground/40 mt-4 group-hover:text-black transition-colors uppercase">{brand.name}</span>
                            {brand.location && <span className="text-[10px] font-bold text-foreground/20 mt-1 uppercase tracking-tighter">{brand.location}</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

