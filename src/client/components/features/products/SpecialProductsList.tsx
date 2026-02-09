'use client';

import React from 'react';
import { FaStar } from 'react-icons/fa';

export default function SpecialProductsList() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
                { name: 'Coffee Cup Set', price: 34.45, oldPrice: 45.00, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400' },
                { name: 'Cookware Set Pro', price: 327.84, oldPrice: 420.00, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400' },
                { name: 'Double Egg Roller Maker', price: 27.84, oldPrice: 35.00, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400' },
                { name: 'Fish Turner Spatula', price: 15.42, oldPrice: 20.00, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400' },
            ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                    <div className="w-32 h-32 bg-background rounded-[10px] overflow-hidden border border-foreground/10 shrink-0">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 py-1">
                        <div className="flex gap-0.5 mb-2 text-primary">
                            {[...Array(5)].map((_, j) => <FaStar key={j} className="w-3 h-3" />)}
                        </div>
                        <h4 className="text-base font-black mb-1 group-hover:text-primary transition-colors text-foreground">{item.name}</h4>
                        <p className="text-lg font-black mb-4 text-foreground">$ {item.price} <span className="text-xs text-foreground/40 line-through ml-2 font-bold">$ {item.oldPrice}</span></p>
                        <button className="btn-secondary px-5 py-2 whitespace-nowrap text-[9px]">
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
