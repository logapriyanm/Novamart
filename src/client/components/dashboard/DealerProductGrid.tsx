'use client';

import React from 'react';
import { ProductFilterSidebar, FilterState } from '../ui/ProductFilterSidebar';
import { ProductManagementCard } from '../ui/ProductManagementCard';
import { FaSearch as Search, FaPlus as Plus, FaTh as Grid, FaList as ListIcon, FaChevronRight as ChevronRight } from 'react-icons/fa';

const mockProducts = [
    {
        name: "World's Most Expensive T Shirt",
        category: "Fashion",
        price: 266.24,
        originalPrice: 354.99,
        discount: 25,
        rating: 4.9,
        stock: 12,
        orders: 48,
        publishDate: "12 Oct, 20...",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=TSHIRT&backgroundColor=f8fafc",
        brand: "Samsung", // Mock brand for filtering
        isVerified: true // Mock verification
    },
    // ... (rest of mockProducts - logic handles missing fields gracefully)
    {
        name: "Like Style Women Black Handbag",
        category: "Fashion",
        price: 742.00,
        rating: 4.2,
        stock: 6,
        orders: 30,
        publishDate: "06 Jan, 20...",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=BAG&backgroundColor=f8fafc",
        brand: "LG",
        isVerified: false
    },
    {
        name: "Black Horn Backpack For Men B...",
        category: "Grocery",
        price: 113.24,
        originalPrice: 150.99,
        discount: 25,
        rating: 3.8,
        stock: 10,
        orders: 48,
        publishDate: "26 Mar, 20...",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=PACK&backgroundColor=f8fafc",
        brand: "Sony",
        isVerified: true
    },
    {
        name: "Innovative Education Book",
        category: "Kids",
        price: 96.26,
        rating: 4.7,
        stock: 12,
        orders: 48,
        publishDate: "12 Oct, 20...",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=BOOK&backgroundColor=f8fafc",
        brand: "Panasonic",
        isVerified: true
    },
    {
        name: "Sangria Girls Mint Green & Off-...",
        category: "Kids",
        price: 24.07,
        originalPrice: 96.26,
        discount: 75,
        rating: 4.7,
        stock: 6,
        orders: 30,
        publishDate: "06 Jan, 20...",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=SHOE&backgroundColor=f8fafc",
        brand: "Whirlpool",
        isVerified: false
    },
    {
        name: "Lace-Up Casual Shoes For Men",
        category: "Fashion",
        price: 229.00,
        rating: 4.0,
        stock: 10,
        orders: 48,
        publishDate: "26 Mar, 20...",
        image: "https://api.dicebear.com/7.x/initials/svg?seed=CASUAL&backgroundColor=f8fafc",
        brand: "Haier",
        isVerified: true
    }
];

export const DealerProductGrid = () => {
    const [products, setProducts] = React.useState(mockProducts);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
    const [newProduct, setNewProduct] = React.useState({ name: '', price: '', category: 'General' });

    // Filter State
    const [filters, setFilters] = React.useState<FilterState>({
        priceRange: [0, 10000],
        brands: [],
        rating: null,
        availability: [],
        verifiedOnly: false
    });

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Filter products based on search AND filters
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];

        // Mock brand check (if product has no brand, we assume it doesn't match if brands are selected)
        const productBrand = (p as any).brand || 'Generic';
        const matchesBrand = filters.brands.length === 0 || filters.brands.includes(productBrand);

        const matchesRating = filters.rating === null || (p.rating || 0) >= filters.rating;

        const isStocked = p.stock > 0;
        const matchesAvailability = filters.availability.length === 0 ||
            (filters.availability.includes('In Stock') && isStocked) ||
            (filters.availability.includes('Out of Stock') && !isStocked);

        const matchesVerified = !filters.verifiedOnly || (p as any).isVerified;

        return matchesSearch && matchesPrice && matchesBrand && matchesRating && matchesAvailability && matchesVerified;
    });

    const handleDelete = (index: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            const newProducts = [...products];
            newProducts.splice(index, 1);
            setProducts(newProducts);
        }
    };

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        const productToAdd = {
            name: newProduct.name,
            category: newProduct.category,
            price: parseFloat(newProduct.price) || 0,
            rating: 0,
            stock: 0,
            orders: 0,
            publishDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${newProduct.name}&backgroundColor=f8fafc`,
            brand: 'Generic',
            isVerified: true
        };
        setProducts([productToAdd, ...products]);
        setIsAddModalOpen(false);
        setNewProduct({ name: '', price: '', category: 'General' });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in relative">
            {/* Sidebar */}
            <ProductFilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Main Content */}
            <div className="flex-1 space-y-8">
                {/* Utility Header */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-primary text-background px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 active:scale-95 transition-all text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Product
                        </button>
                        <div className="flex p-1 bg-surface/40 backdrop-blur-md border border-foreground/10 rounded-2xl">
                            <button className="p-2 rounded-xl bg-primary text-background shadow-lg">
                                <Grid className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-xl text-foreground/40 hover:text-primary transition-colors">
                                <ListIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <input
                            type="text"
                            placeholder="Search Products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface/40 border border-foreground/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground"
                        />
                    </div>
                </div>

                {/* Breadcrumbs Placeholder */}
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                    <span>Products</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-primary">Product Grid</span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, idx) => (
                            <div key={idx} className="relative group">
                                <ProductManagementCard {...product} />
                                <button
                                    onClick={() => handleDelete(idx)}
                                    className="absolute top-4 right-4 bg-rose-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    title="Delete Product"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-foreground/40 italic">
                            No products found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            </div>

            {/* Simple Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
                        <h3 className="text-xl font-black text-[#1E293B] mb-6">Add New Product</h3>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#10367D]"
                                    placeholder="e.g. Premium Headphones"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Category</label>
                                <select
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#10367D]"
                                >
                                    <option value="General">General</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Home">Home</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] focus:outline-none focus:border-[#10367D]"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-3 text-slate-400 font-bold hover:text-[#1E293B] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-[#10367D] text-white rounded-xl font-bold shadow-lg shadow-[#10367D]/20 hover:scale-[1.02] transition-transform"
                                >
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

