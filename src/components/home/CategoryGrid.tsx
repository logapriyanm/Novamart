import React from 'react';
import Link from 'next/link';
import {
    FaBlender,
    FaTshirt,
    FaSnowflake,
    FaTv
} from 'react-icons/fa';

const homeApplianceCategories = [
    {
        title: "Kitchen Essentials",
        icon: FaBlender,
        items: [
            { name: "Refrigerators", image: "https://images.unsplash.com/photo-1571175449180-f8b4d0201d9f?q=80&w=200&auto=format&fit=crop" },
            { name: "Microwaves", image: "https://images.unsplash.com/photo-1574265353392-0b29c9ccf6bc?q=80&w=200&auto=format&fit=crop" },
            { name: "Mixer Grinders", image: "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=200&auto=format&fit=crop" },
            { name: "Dishwashers", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop" }
        ]
    },
    {
        title: "Laundry & Care",
        icon: FaTshirt,
        items: [
            { name: "Washing Machines", image: "https://images.unsplash.com/photo-1626806819282-2c1dc61a0e0c?q=80&w=200&auto=format&fit=crop" },
            { name: "Steam Irons", image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=200&auto=format&fit=crop" },
            { name: "Dryers", image: "https://images.unsplash.com/photo-1517677208171-0bc5e25bb3ca?q=80&w=200&auto=format&fit=crop" },
            { name: "Garment Steamers", image: "https://images.unsplash.com/photo-1562077772-3bd632846d4c?q=80&w=200&auto=format&fit=crop" }
        ]
    },
    {
        title: "Cooling & Air",
        icon: FaSnowflake,
        items: [
            { name: "Air Conditioners", image: "https://images.unsplash.com/photo-1631545729916-46c23a563c77?q=80&w=200&auto=format&fit=crop" },
            { name: "Air Purifiers", image: "https://images.unsplash.com/photo-1585771724684-2827df306856?q=80&w=200&auto=format&fit=crop" },
            { name: "Air Coolers", image: "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?q=80&w=200&auto=format&fit=crop" },
            { name: "Fans", image: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?q=80&w=200&auto=format&fit=crop" }
        ]
    },
    {
        title: "Home Entertainment",
        icon: FaTv,
        items: [
            { name: "Smart TVs", image: "https://images.unsplash.com/photo-1593359677759-543733a69271?q=80&w=200&auto=format&fit=crop" },
            { name: "Home Theater", image: "https://images.unsplash.com/photo-1595935736128-db1f0a261963?q=80&w=200&auto=format&fit=crop" },
            { name: "Projectors", image: "https://images.unsplash.com/photo-1517604931442-710c8ef557c9?q=80&w=200&auto=format&fit=crop" },
            { name: "Smart Speakers", image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=200&auto=format&fit=crop" }
        ]
    }
];

export default function CategoryGrid() {
    return (
        <div className="max-w-7xl mx-auto px-6 mt-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {homeApplianceCategories.map((category, idx) => (
                    <div key={idx} className="bg-white rounded-[1rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100/60 hover:translate-y-px transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <category.icon className="w-6 h-6 text-slate-700" />
                                <h3 className="text-sm font-black text-slate-800">{category.title}</h3>
                            </div>
                            <Link href="#" className="text-[10px] font-bold text-[#10367D] hover:underline">View All</Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {category.items.map((item, itemIdx) => (
                                <Link key={itemIdx} href="#" className="flex flex-col gap-2 group/item">
                                    <div className="aspect-square rounded-sm bg-slate-50 overflow-hidden border border-slate-100 group-hover/item:border-[#10367D]/30 transition-colors">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-600 leading-tight group-hover/item:text-[#10367D] transition-colors">
                                        {item.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

