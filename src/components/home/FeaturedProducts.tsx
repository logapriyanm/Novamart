import { FaHeart, FaShieldAlt, FaStar } from 'react-icons/fa';

const featuredApplianceProducts = [
    {
        id: 1,
        name: "ProClean 500W Mixer Grinder",
        price: "₹3,499",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop",
        tag: "Best Seller",
        rating: 4.8,
        verified: true,
        cols: "lg:col-span-1",
        rows: "lg:row-span-2",
        variant: "tall-image-top"
    },
    {
        id: 2,
        name: "Solaris Pro Energy Panel v2",
        price: "₹12,499",
        image: "https://images.unsplash.com/photo-1509391366360-fe5bb6521e7c?q=80&w=600&auto=format&fit=crop",
        rating: 4.9,
        verified: true,
        cols: "lg:col-span-2",
        rows: "lg:row-span-1",
        variant: "wide-image-right"
    },
    {
        id: 3,
        name: "FrostGuard Smart Fridge v2",
        price: "₹45,999",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
        rating: 4.7,
        verified: true,
        cols: "lg:col-span-1",
        rows: "lg:row-span-1",
        variant: "small-image-right"
    },
    {
        id: 4,
        name: "EcoWash Silent Runner",
        price: "₹28,999",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
        rating: 4.6,
        verified: true,
        cols: "lg:col-span-1",
        rows: "lg:row-span-1",
        variant: "small-image-right"
    },
    {
        id: 5,
        name: "Culina Master Induction Kit",
        price: "₹5,499",
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop",
        rating: 4.9,
        verified: true,
        cols: "lg:col-span-2",
        rows: "lg:row-span-1",
        variant: "wide-image-center"
    },
    {
        id: 6,
        name: "PureFlow Air Humidifier",
        price: "₹2,199",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
        rating: 4.5,
        verified: true,
        cols: "lg:col-span-1",
        rows: "lg:row-span-1",
        variant: "small-image-bottom"
    }
];

export default function FeaturedProducts() {
    return (
        <div className="max-w-7xl mx-auto px-6 mt-20 mb-20">
            <div className="text-center mb-12">

                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Featured Products</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
                {featuredApplianceProducts.map((product) => (
                    <div key={product.id} className={`group relative bg-white rounded-[0.55rem] overflow-hidden hover:shadow-xl hover:shadow-slate-200 border border-slate-100 transition-all duration-500 ${product.cols} ${product.rows}`}>

                        <div className="absolute inset-0 p-8 flex flex-col h-full pointer-events-none z-20">
                            {/* Text Layout Logic based on Variant */}
                            <div className={`relative flex flex-col ${product.variant === 'wide-image-right' || product.variant === 'small-image-right' ? 'w-1/2 justify-center h-full' : product.variant === 'tall-image-top' ? 'mt-auto' : ''}`}>
                                {product.verified && (
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <FaShieldAlt className="w-3.5 h-3.5 text-[#10367D]" />
                                        <span className="text-[9px] font-black text-[#10367D] uppercase tracking-widest">Verified Seller</span>
                                    </div>
                                )}
                                <h4 className="text-xl font-black text-slate-800 leading-none mb-2">{product.name}</h4>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-200'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">{product.rating}</span>
                                </div>
                                <span className="text-[#10367D] font-black text-lg">{product.price}</span>
                            </div>

                            {/* Tag indicator */}
                            <div className="absolute top-0 left-0">
                                {product.tag && (
                                    <span className="bg-[#10367D] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#10367D]/20">{product.tag}</span>
                                )}
                            </div>
                        </div>

                        {/* Image Placement Logic */}
                        <div className={`absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105 ${product.variant === 'tall-image-top' ? '-top-20' :
                            product.variant === 'wide-image-right' ? 'left-1/2 top-0 bottom-0' :
                                product.variant === 'small-image-right' ? 'left-[40%] top-0 bottom-0' :
                                    product.variant === 'wide-image-center' ? 'top-0 left-0 flex items-center justify-center p-12 translate-x-1/4' : ''
                            }`}>
                            <img
                                src={product.image}
                                alt={product.name}
                                className={`w-full h-full object-contain drop-shadow-2xl ${product.variant === 'tall-image-top' ? 'object-top p-8' :
                                    product.variant === 'wide-image-right' ? 'object-center p-4' :
                                        product.variant === 'small-image-right' ? 'object-center p-2' : ''
                                    }`}
                            />
                        </div>

                        {/* Action Button */}
                        <button className="absolute bottom-6 right-6 z-30 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#10367D] group/btn transition-colors">
                            <FaHeart className="w-4 h-4 text-slate-200 group-hover/btn:text-white transition-colors" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

