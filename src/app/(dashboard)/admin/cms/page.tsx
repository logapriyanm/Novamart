'use client';

import React, { useState, useEffect } from 'react';
import {
    FaSort,
    FaEye,
    FaEyeSlash,
    FaEdit,
    FaPlus,
    FaArrowUp,
    FaArrowDown,
    FaSave,
    FaTrash,
    FaCalendarAlt,
    FaSearch,
    FaInfoCircle,
    FaBoxOpen,
    FaTicketAlt,
    FaShieldAlt,
    FaLayerGroup,
    FaStar,
    FaUserCheck,
    FaTruck
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import CMSImageUpload from './CMSImageUpload';

interface CMSSection {
    _id: string;
    sectionKey: string;
    title: string;
    subtitle?: string;
    componentName: string;
    isActive: boolean;
    order: number;
    visibleFor: string[];
    content?: any;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
    };
    schedule?: {
        startDate?: string;
        endDate?: string;
    };
}

// Components that are data-driven (auto-populated from APIs/personalization)
const DATA_DRIVEN_COMPONENTS = [
    'CategoryGrid',
    'FeaturedProducts',
    'OccasionBanner',
    'B2BShortcuts',
    'RecommendedProducts'
];

// ─── ICON OPTIONS ──────────────────────────────────────────────────────────────
const TRUST_ICONS = ['FaShieldAlt', 'FaBoxOpen', 'FaUserCheck', 'FaLock', 'FaCheckCircle', 'FaAward'];
const OFFER_ICONS = ['FaGift', 'FaStar', 'FaCalendarAlt', 'FaLayerGroup', 'FaTicketAlt', 'FaTruck', 'FaBolt'];
const DELIVERY_ICONS = ['FaDhl', 'FaUps', 'FaFedex', 'FaAmazon', 'FaShippingFast', 'FaTruckMoving', 'FaBoxOpen'];
const WHY_ICONS = ['FaShieldAlt', 'FaHandshake', 'FaUserShield', 'FaGem', 'FaAward', 'FaCheckCircle'];
const TESTIMONIAL_VARIANTS = ['service-card', 'pure-quote', 'photo-split', 'wide-likes', 'typography-hero', 'simple-card', 'centered-avatar'];

// ─── SHARED EDITOR COMPONENTS ──────────────────────────────────────────────────
function EditorLabel({ children }: { children: React.ReactNode }) {
    return <label className="text-[10px] font-black uppercase tracking-wider text-foreground/40">{children}</label>;
}

function EditorInput({ value, onChange, placeholder = '' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <input
            type="text"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-background border border-foreground/10 rounded-[10px] px-3 py-2 text-sm focus:border-primary outline-none"
        />
    );
}

function EditorSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
    return (
        <select
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-background border border-foreground/10 rounded-[10px] px-3 py-2 text-sm focus:border-primary outline-none"
        >
            <option value="">Select...</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    );
}

function AddItemBtn({ onClick, label = 'Add Item' }: { onClick: () => void; label?: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-colors mt-2"
        >
            <FaPlus className="w-2.5 h-2.5" /> {label}
        </button>
    );
}

function RemoveItemBtn({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="p-1 text-red-400 hover:text-red-600 transition-colors shrink-0"
            title="Remove"
        >
            <FaTrash className="w-3 h-3" />
        </button>
    );
}

// ─── COMPONENT-SPECIFIC CONTENT EDITORS ────────────────────────────────────────

function HeroEditor({ content, setContent }: { content: any; setContent: (c: any) => void }) {
    const slides = content?.slides || [];

    const updateSlide = (idx: number, field: string, value: any) => {
        const updated = [...slides];
        updated[idx] = { ...updated[idx], [field]: value };
        setContent({ ...content, slides: updated });
    };

    const addSlide = () => {
        setContent({
            ...content,
            slides: [...slides, { id: Date.now(), title: '', highlight: '', description: '', discount: '', subText: '', tag: '', ctaText: 'Shop Now', ctaLink: '/products', secondaryCta: 'Learn More', image: '' }]
        });
    };

    const removeSlide = (idx: number) => {
        setContent({ ...content, slides: slides.filter((_: any, i: number) => i !== idx) });
    };

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground/60">Hero Slides ({slides.length})</h4>
            {slides.map((slide: any, idx: number) => (
                <div key={idx} className="bg-background rounded-[12px] p-4 border border-foreground/5 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-foreground/30 uppercase">Slide {idx + 1}</span>
                        <RemoveItemBtn onClick={() => removeSlide(idx)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><EditorLabel>Title</EditorLabel><EditorInput value={slide.title} onChange={v => updateSlide(idx, 'title', v)} /></div>
                        <div><EditorLabel>Highlight Text</EditorLabel><EditorInput value={slide.highlight} onChange={v => updateSlide(idx, 'highlight', v)} /></div>
                    </div>
                    <div><EditorLabel>Description</EditorLabel><EditorInput value={slide.description} onChange={v => updateSlide(idx, 'description', v)} /></div>
                    <div className="grid grid-cols-3 gap-3">
                        <div><EditorLabel>Discount</EditorLabel><EditorInput value={slide.discount} onChange={v => updateSlide(idx, 'discount', v)} /></div>
                        <div><EditorLabel>Sub Text</EditorLabel><EditorInput value={slide.subText} onChange={v => updateSlide(idx, 'subText', v)} /></div>
                        <div><EditorLabel>Tag</EditorLabel><EditorInput value={slide.tag} onChange={v => updateSlide(idx, 'tag', v)} /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div><EditorLabel>CTA Text</EditorLabel><EditorInput value={slide.ctaText} onChange={v => updateSlide(idx, 'ctaText', v)} /></div>
                        <div><EditorLabel>CTA Link</EditorLabel><EditorInput value={slide.ctaLink} onChange={v => updateSlide(idx, 'ctaLink', v)} /></div>
                        <div><EditorLabel>Secondary CTA</EditorLabel><EditorInput value={slide.secondaryCta} onChange={v => updateSlide(idx, 'secondaryCta', v)} /></div>
                    </div>
                    <div>
                        <CMSImageUpload
                            label="Slide Image"
                            value={slide.image}
                            onChange={url => updateSlide(idx, 'image', url)}
                            folder="novamart/hero"
                        />
                    </div>
                </div>
            ))}
            <AddItemBtn onClick={addSlide} label="Add Slide" />
        </div>
    );
}

function BrandSpotlightEditor({ content, setContent }: { content: any; setContent: (c: any) => void }) {
    const setups = content?.setups || [];

    const updateSetup = (idx: number, field: string, value: any) => {
        const updated = [...setups];
        updated[idx] = { ...updated[idx], [field]: value };
        setContent({ ...content, setups: updated });
    };

    const addSetup = () => {
        setContent({ ...content, setups: [...setups, { name: '', description: '', image: '', link: '/products' }] });
    };

    const removeSetup = (idx: number) => {
        setContent({ ...content, setups: setups.filter((_: any, i: number) => i !== idx) });
    };

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground/60">Brand Setups ({setups.length})</h4>
            {setups.map((setup: any, idx: number) => (
                <div key={idx} className="bg-background rounded-[12px] p-4 border border-foreground/5 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-foreground/30 uppercase">Setup {idx + 1}</span>
                        <RemoveItemBtn onClick={() => removeSetup(idx)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><EditorLabel>Name</EditorLabel><EditorInput value={setup.name} onChange={v => updateSetup(idx, 'name', v)} /></div>
                        <div><EditorLabel>Description</EditorLabel><EditorInput value={setup.description} onChange={v => updateSetup(idx, 'description', v)} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <CMSImageUpload
                                label="Setup Image"
                                value={setup.image}
                                onChange={url => updateSetup(idx, 'image', url)}
                                folder="novamart/brand-spotlight"
                            />
                        </div>
                        <div><EditorLabel>Link</EditorLabel><EditorInput value={setup.link} onChange={v => updateSetup(idx, 'link', v)} /></div>
                    </div>
                </div>
            ))}
            <AddItemBtn onClick={addSetup} label="Add Setup" />
        </div>
    );
}

function TrustStripEditor({ content, setContent }: { content: any; setContent: (c: any) => void }) {
    const items = content?.items || [];

    const updateItem = (idx: number, field: string, value: any) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [field]: value };
        setContent({ ...content, items: updated });
    };

    const addItem = () => {
        setContent({ ...content, items: [...items, { icon: 'FaShieldAlt', title: '', desc: '' }] });
    };

    const removeItem = (idx: number) => {
        setContent({ ...content, items: items.filter((_: any, i: number) => i !== idx) });
    };

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground/60">Trust Items ({items.length})</h4>
            {items.map((item: any, idx: number) => (
                <div key={idx} className="bg-background rounded-[12px] p-4 border border-foreground/5 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-foreground/30 uppercase">Item {idx + 1}</span>
                        <RemoveItemBtn onClick={() => removeItem(idx)} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div><EditorLabel>Icon</EditorLabel><EditorSelect value={item.icon} onChange={v => updateItem(idx, 'icon', v)} options={TRUST_ICONS} /></div>
                        <div><EditorLabel>Title</EditorLabel><EditorInput value={item.title} onChange={v => updateItem(idx, 'title', v)} /></div>
                        <div><EditorLabel>Description</EditorLabel><EditorInput value={item.desc} onChange={v => updateItem(idx, 'desc', v)} /></div>
                    </div>
                </div>
            ))}
            <AddItemBtn onClick={addItem} />
        </div>
    );
}

function TrendingBarEditor({ content, setContent }: { content: any; setContent: (c: any) => void }) {
    const categories = content?.categories || [];

    const updateCategory = (idx: number, field: string, value: any) => {
        const updated = [...categories];
        updated[idx] = { ...updated[idx], [field]: value };
        setContent({ ...content, categories: updated });
    };

    const addCategory = () => {
        setContent({ ...content, categories: [...categories, { name: '', image: '' }] });
    };

    const removeCategory = (idx: number) => {
        setContent({ ...content, categories: categories.filter((_: any, i: number) => i !== idx) });
    };

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground/60">Trending Categories ({categories.length})</h4>
            {categories.map((cat: any, idx: number) => (
                <div key={idx} className="bg-background rounded-[12px] p-3 border border-foreground/5 flex items-end gap-3">
                    <div className="flex-1"><EditorLabel>Name</EditorLabel><EditorInput value={cat.name} onChange={v => updateCategory(idx, 'name', v)} /></div>
                    <div className="flex-1">
                        <CMSImageUpload
                            label="Category Image"
                            value={cat.image}
                            onChange={url => updateCategory(idx, 'image', url)}
                            folder="novamart/trending"
                        />
                    </div>
                    <RemoveItemBtn onClick={() => removeCategory(idx)} />
                </div>
            ))}
            <AddItemBtn onClick={addCategory} label="Add Category" />
        </div>
    );
}

// ─── HELPER FOR STRING ARRAYS ──────────────────────────────────────────────────
function StringArrayInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
    const [text, setText] = useState(value.join(', '));

    useEffect(() => {
        setText(value.join(', '));
    }, [value]);

    return (
        <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onBlur={() => onChange(text.split(',').map(s => s.trim()).filter(Boolean))}
            onKeyDown={e => {
                if (e.key === ',') e.stopPropagation();
            }}
            placeholder={placeholder}
            className="w-full bg-background border border-foreground/10 rounded-[10px] px-3 py-2 text-sm focus:border-primary outline-none"
        />
    );
}

function CustomerOffersEditor({ content, setContent }: { content: any; setContent: (c: any) => void }) {
    const offers = content?.offers || [];
    // ... (rest of logic handles updates)

    const updateOffer = (idx: number, field: string, value: any) => {
        const updated = [...offers];
        updated[idx] = { ...updated[idx], [field]: value };
        setContent({ ...content, offers: updated });
    };

    const addOffer = () => {
        setContent({
            ...content,
            offers: [...offers, { id: Date.now(), icon: 'FaGift', title: '', subtitle: '', badge: '', lightColor: 'bg-indigo-50', color: 'bg-indigo-600', details: [], purpose: [] }]
        });
    };

    const removeOffer = (idx: number) => {
        setContent({ ...content, offers: offers.filter((_: any, i: number) => i !== idx) });
    };

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground/60">Offers ({offers.length})</h4>
            {offers.map((offer: any, idx: number) => (
                <div key={idx} className="bg-background rounded-[12px] p-4 border border-foreground/5 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-foreground/30 uppercase">Offer {idx + 1}</span>
                        <RemoveItemBtn onClick={() => removeOffer(idx)} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div><EditorLabel>Icon</EditorLabel><EditorSelect value={offer.icon} onChange={v => updateOffer(idx, 'icon', v)} options={OFFER_ICONS} /></div>
                        <div><EditorLabel>Title</EditorLabel><EditorInput value={offer.title} onChange={v => updateOffer(idx, 'title', v)} /></div>
                        <div><EditorLabel>Subtitle</EditorLabel><EditorInput value={offer.subtitle} onChange={v => updateOffer(idx, 'subtitle', v)} /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div><EditorLabel>Badge</EditorLabel><EditorInput value={offer.badge} onChange={v => updateOffer(idx, 'badge', v)} placeholder="e.g. New, Hot" /></div>
                        <div><EditorLabel>Light Color</EditorLabel><EditorInput value={offer.lightColor} onChange={v => updateOffer(idx, 'lightColor', v)} placeholder="bg-indigo-50" /></div>
                        <div><EditorLabel>Color</EditorLabel><EditorInput value={offer.color} onChange={v => updateOffer(idx, 'color', v)} placeholder="bg-indigo-600" /></div>
                    </div>
                    <div>
                        <EditorLabel>Details (one per line)</EditorLabel>
                        <textarea
                            rows={3}
                            value={(offer.details || []).join('\n')}
                            onChange={e => updateOffer(idx, 'details', e.target.value.split('\n'))}
                            onKeyDown={e => {
                                if (e.key === 'Enter') e.stopPropagation();
                            }}
                            className="w-full bg-background border border-foreground/10 rounded-[10px] px-3 py-2 text-sm focus:border-primary outline-none resize-none"
                            placeholder="One detail per line&#10;Press Enter for new line"
                        />
                    </div>
                    <div>
                        <EditorLabel>Purpose Tags (comma separated)</EditorLabel>
                        <StringArrayInput
                            value={offer.purpose || []}
                            onChange={v => updateOffer(idx, 'purpose', v)}
                            placeholder="Acquisition, Onboarding"
                        />
                    </div>
                </div>
            ))}
            <AddItemBtn onClick={addOffer} label="Add Offer" />

            <div className="border-t border-foreground/5 pt-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-foreground/60">CTA Section</h4>
                <div><EditorLabel>CTA Title</EditorLabel><EditorInput value={content?.ctaTitle || ''} onChange={v => setContent({ ...content, ctaTitle: v })} /></div>
                <div><EditorLabel>CTA Subtitle</EditorLabel><EditorInput value={content?.ctaSubtitle || ''} onChange={v => setContent({ ...content, ctaSubtitle: v })} /></div>
            </div>
        </div>
    );
}

function BestsellerEditor({ content, setContent }: { content: any; setContent: (c: any) => void }) {
    const products = content?.products || [];

    const updateProduct = (idx: number, field: string, value: any) => {
        const updated = [...products];
        updated[idx] = { ...updated[idx], [field]: value };
        setContent({ ...content, products: updated });
    };

    const addProduct = () => {
        setContent({ ...content, products: [...products, { id: Date.now(), title: '', category: '', image: '', price: '', status: 'In Stock' }] });
    };

    const removeProduct = (idx: number) => {
        setContent({ ...content, products: products.filter((_: any, i: number) => i !== idx) });
    };

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground/60">Bestseller Products ({products.length})</h4>
            {products.map((product: any, idx: number) => (
                <div key={idx} className="bg-background rounded-[12px] p-4 border border-foreground/5 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-foreground/30 uppercase">Product {idx + 1}</span>
                        <RemoveItemBtn onClick={() => removeProduct(idx)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><EditorLabel>Title</EditorLabel><EditorInput value={product.title} onChange={v => updateProduct(idx, 'title', v)} /></div>
                        <div><EditorLabel>Category</EditorLabel><EditorInput value={product.category} onChange={v => updateProduct(idx, 'category', v)} /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                            <CMSImageUpload
                                label="Product Image"
                                value={product.image}
                                onChange={url => updateProduct(idx, 'image', url)}
                                folder="novamart/products"
                            />
                        </div>
                        <div className="col-span-2 grid grid-cols-2 gap-3">
                            <div><EditorLabel>Price</EditorLabel><EditorInput value={product.price} onChange={v => updateProduct(idx, 'price', v)} placeholder="₹42,999" /></div>
                            <div><EditorLabel>Status</EditorLabel><EditorInput value={product.status} onChange={v => updateProduct(idx, 'status', v)} placeholder="In Stock" /></div>
                        </div>
                    </div>
                </div>
            ))}
            <AddItemBtn onClick={addProduct} label="Add Product" />
        </div>
    );
}

function WhyNovaMartEditor({ content, setContent }: { content: any; setContent: (c: any) => void }) {
    const features = content?.features || [];

    const updateFeature = (idx: number, field: string, value: any) => {
        const updated = [...features];
        updated[idx] = { ...updated[idx], [field]: value };
        setContent({ ...content, features: updated });
    };

    const addFeature = () => {
        setContent({ ...content, features: [...features, { icon: 'FaShieldAlt', title: '', desc: '' }] });
    };

    const removeFeature = (idx: number) => {
        setContent({ ...content, features: features.filter((_: any, i: number) => i !== idx) });
    };

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground/60">Features ({features.length})</h4>
            {features.map((feature: any, idx: number) => (
                <div key={idx} className="bg-background rounded-[12px] p-4 border border-foreground/5 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-foreground/30 uppercase">Feature {idx + 1}</span>
                        <RemoveItemBtn onClick={() => removeFeature(idx)} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div><EditorLabel>Icon</EditorLabel><EditorSelect value={feature.icon} onChange={v => updateFeature(idx, 'icon', v)} options={WHY_ICONS} /></div>
                        <div><EditorLabel>Title</EditorLabel><EditorInput value={feature.title} onChange={v => updateFeature(idx, 'title', v)} /></div>
                        <div><EditorLabel>Description</EditorLabel><EditorInput value={feature.desc} onChange={v => updateFeature(idx, 'desc', v)} /></div>
                    </div>
                </div>
            ))}
            <AddItemBtn onClick={addFeature} label="Add Feature" />
        </div>
    );
}

function ManufacturersEditor({ content, setContent }: { content: any; setContent: (c: any) => void }) {
    const manufacturers = content?.manufacturers || [];

    const updateMfr = (idx: number, field: string, value: any) => {
        const updated = [...manufacturers];
        updated[idx] = { ...updated[idx], [field]: value };
        setContent({ ...content, manufacturers: updated });
    };

    const addMfr = () => {
        setContent({ ...content, manufacturers: [...manufacturers, { name: '', location: '', image: '' }] });
    };

    const removeMfr = (idx: number) => {
        setContent({ ...content, manufacturers: manufacturers.filter((_: any, i: number) => i !== idx) });
    };

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground/60">Manufacturers ({manufacturers.length})</h4>
            {manufacturers.map((mfr: any, idx: number) => (
                <div key={idx} className="bg-background rounded-[12px] p-3 border border-foreground/5 flex items-end gap-3">
                    <div className="flex-1"><EditorLabel>Name</EditorLabel><EditorInput value={mfr.name} onChange={v => updateMfr(idx, 'name', v)} /></div>
                    <div className="flex-1"><EditorLabel>Location</EditorLabel><EditorInput value={mfr.location} onChange={v => updateMfr(idx, 'location', v)} /></div>
                    <div className="flex-1">
                        <CMSImageUpload
                            label="Logo"
                            value={mfr.image}
                            onChange={url => updateMfr(idx, 'image', url)}
                            folder="novamart/brands"
                        />
                    </div>
                    <RemoveItemBtn onClick={() => removeMfr(idx)} />
                </div>
            ))}
            <AddItemBtn onClick={addMfr} label="Add Manufacturer" />
        </div>
    );
}

function TestimonialsEditor({ content, setContent }: { content: any; setContent: (c: any) => void }) {
    const testimonials = content?.testimonials || [];

    const updateTestimonial = (idx: number, field: string, value: any) => {
        const updated = [...testimonials];
        updated[idx] = { ...updated[idx], [field]: value };
        setContent({ ...content, testimonials: updated });
    };

    const addTestimonial = () => {
        setContent({
            ...content,
            testimonials: [...testimonials, { id: Date.now(), variant: 'simple-card', author: '', role: '', title: '', text: '', image: '', rating: 5, likes: 0, cols: 'md:col-span-1', rows: '' }]
        });
    };

    const removeTestimonial = (idx: number) => {
        setContent({ ...content, testimonials: testimonials.filter((_: any, i: number) => i !== idx) });
    };

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground/60">Testimonials ({testimonials.length})</h4>
            {testimonials.map((t: any, idx: number) => (
                <div key={idx} className="bg-background rounded-[12px] p-4 border border-foreground/5 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-foreground/30 uppercase">Testimonial {idx + 1}</span>
                        <RemoveItemBtn onClick={() => removeTestimonial(idx)} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div><EditorLabel>Variant</EditorLabel><EditorSelect value={t.variant} onChange={v => updateTestimonial(idx, 'variant', v)} options={TESTIMONIAL_VARIANTS} /></div>
                        <div><EditorLabel>Author</EditorLabel><EditorInput value={t.author} onChange={v => updateTestimonial(idx, 'author', v)} /></div>
                        <div><EditorLabel>Role</EditorLabel><EditorInput value={t.role} onChange={v => updateTestimonial(idx, 'role', v)} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><EditorLabel>Title</EditorLabel><EditorInput value={t.title} onChange={v => updateTestimonial(idx, 'title', v)} /></div>
                        <div>
                            <CMSImageUpload
                                label="User Image"
                                value={t.image}
                                onChange={url => updateTestimonial(idx, 'image', url)}
                                folder="novamart/testimonials"
                            />
                        </div>
                    </div>
                    <div><EditorLabel>Text</EditorLabel>
                        <textarea
                            rows={2}
                            value={t.text || ''}
                            onChange={e => updateTestimonial(idx, 'text', e.target.value)}
                            className="w-full bg-background border border-foreground/10 rounded-[10px] px-3 py-2 text-sm focus:border-primary outline-none resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div><EditorLabel>Rating (1-5)</EditorLabel>
                            <input type="number" min={1} max={5} value={t.rating || 5} onChange={e => updateTestimonial(idx, 'rating', Number(e.target.value))} className="w-full bg-background border border-foreground/10 rounded-[10px] px-3 py-2 text-sm focus:border-primary outline-none" />
                        </div>
                        <div><EditorLabel>Likes</EditorLabel>
                            <input type="number" value={t.likes || 0} onChange={e => updateTestimonial(idx, 'likes', Number(e.target.value))} className="w-full bg-background border border-foreground/10 rounded-[10px] px-3 py-2 text-sm focus:border-primary outline-none" />
                        </div>
                        <div><EditorLabel>Grid Cols</EditorLabel><EditorInput value={t.cols} onChange={v => updateTestimonial(idx, 'cols', v)} placeholder="md:col-span-1" /></div>
                    </div>
                </div>
            ))}
            <AddItemBtn onClick={addTestimonial} label="Add Testimonial" />
        </div>
    );
}

function DeliveryPartnersEditor({ content, setContent }: { content: any; setContent: (c: any) => void }) {
    const partners = content?.partners || [];

    const updatePartner = (idx: number, field: string, value: any) => {
        const updated = [...partners];
        updated[idx] = { ...updated[idx], [field]: value };
        setContent({ ...content, partners: updated });
    };

    const addPartner = () => {
        setContent({ ...content, partners: [...partners, { name: '', icon: 'FaTruckMoving', color: '#000000' }] });
    };

    const removePartner = (idx: number) => {
        setContent({ ...content, partners: partners.filter((_: any, i: number) => i !== idx) });
    };

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground/60">Delivery Partners ({partners.length})</h4>
            {partners.map((partner: any, idx: number) => (
                <div key={idx} className="bg-background rounded-[12px] p-3 border border-foreground/5 flex items-end gap-3">
                    <div className="flex-1"><EditorLabel>Name</EditorLabel><EditorInput value={partner.name} onChange={v => updatePartner(idx, 'name', v)} /></div>
                    <div className="flex-1"><EditorLabel>Icon</EditorLabel><EditorSelect value={partner.icon} onChange={v => updatePartner(idx, 'icon', v)} options={DELIVERY_ICONS} /></div>
                    <div className="w-32"><EditorLabel>Color</EditorLabel>
                        <input type="color" value={partner.color || '#000000'} onChange={e => updatePartner(idx, 'color', e.target.value)} className="w-full h-[38px] bg-background border border-foreground/10 rounded-[10px] px-1 cursor-pointer" />
                    </div>
                    <RemoveItemBtn onClick={() => removePartner(idx)} />
                </div>
            ))}
            <AddItemBtn onClick={addPartner} label="Add Partner" />
        </div>
    );
}

function DataDrivenInfoBox() {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-6 flex items-start gap-4">
            <FaInfoCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
                <h4 className="text-sm font-bold text-blue-800 mb-1">Auto-Populated Section</h4>
                <p className="text-xs text-blue-600">This section's content is automatically fetched from APIs and personalization data. No manual content upload is needed.</p>
            </div>
        </div>
    );
}

// ─── CONTENT EDITOR ROUTER ─────────────────────────────────────────────────────
function ContentEditor({ section, setContent }: { section: CMSSection; setContent: (c: any) => void }) {
    const content = section.content || {};

    if (DATA_DRIVEN_COMPONENTS.includes(section.componentName)) {
        return <DataDrivenInfoBox />;
    }

    switch (section.componentName) {
        case 'HeroSection': return <HeroEditor content={content} setContent={setContent} />;
        case 'BrandSpotlight': return <BrandSpotlightEditor content={content} setContent={setContent} />;
        case 'TrustStrip': return <TrustStripEditor content={content} setContent={setContent} />;
        case 'TrendingBar': return <TrendingBarEditor content={content} setContent={setContent} />;
        case 'CustomerOffers': return <CustomerOffersEditor content={content} setContent={setContent} />;
        case 'BestsellerSlider': return <BestsellerEditor content={content} setContent={setContent} />;
        case 'WhyNovaMart': return <WhyNovaMartEditor content={content} setContent={setContent} />;
        case 'ManufacturersGrid': return <ManufacturersEditor content={content} setContent={setContent} />;
        case 'Testimonials': return <TestimonialsEditor content={content} setContent={setContent} />;
        case 'DeliveryPartners': return <DeliveryPartnersEditor content={content} setContent={setContent} />;
        default:
            return (
                <div className="bg-background rounded-[12px] p-4 border border-foreground/5">
                    <EditorLabel>Content (JSON)</EditorLabel>
                    <textarea
                        rows={6}
                        value={JSON.stringify(content, null, 2)}
                        onChange={e => {
                            try { setContent(JSON.parse(e.target.value)); } catch { /* skip invalid JSON */ }
                        }}
                        className="w-full bg-background border border-foreground/10 rounded-[10px] px-3 py-2 text-sm font-mono focus:border-primary outline-none resize-none mt-2"
                    />
                </div>
            );
    }
}

// ─── MAIN ADMIN CMS PAGE ───────────────────────────────────────────────────────
export default function AdminCMSPage() {
    const [sections, setSections] = useState<CMSSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingSection, setEditingSection] = useState<CMSSection | null>(null);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            setIsLoading(true);
            const data = await apiClient.get<CMSSection[]>('/cms/admin/all');
            setSections(data);
        } catch (error) {
            toast.error('Failed to load CMS sections');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActive = async (id: string, currentState: boolean) => {
        if (currentState) {
            const confirmed = window.confirm('Are you sure you want to disable this section? It will be hidden from all assigned roles instantly.');
            if (!confirmed) return;
        }

        try {
            await apiClient.put<any>(`/cms/admin/${id}`, { isActive: !currentState });
            setSections(sections.map(s => s._id === id ? { ...s, isActive: !currentState } : s));
            toast.success(`Section ${!currentState ? 'enabled' : 'disabled'} successfully`);
        } catch (error) {
            toast.error('Failed to update section status');
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= sections.length) return;

        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];

        // Update order numbers
        const updated = newSections.map((s, i) => ({ ...s, order: (i + 1) * 10 }));
        setSections(updated);
    };

    const handleSaveOrder = async () => {
        try {
            setIsSaving(true);
            const sectionOrders = sections.map(s => ({ id: s._id, order: s.order }));

            await apiClient.post<any>('/cms/admin/reorder', { sectionOrders });
            toast.success('New order saved effectively');
        } catch (error) {
            toast.error('Failed to save order');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSection) return;

        try {
            setIsSaving(true);
            const updatedSection = await apiClient.put<any>(`/cms/admin/${editingSection._id}`, editingSection);
            setSections(sections.map(s => s._id === editingSection._id ? updatedSection : s));
            setEditingSection(null);
            toast.success('Section updated successfully');
        } catch (error) {
            toast.error('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Home Page CMS</h1>
                    <p className="text-foreground/60 mt-1">Manage sections, content, visibility, and role-based layout dynamically.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSaveOrder}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-[12px] font-bold text-sm hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                        <FaSave /> Save Changes
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-surface animate-pulse rounded-[24px] border border-foreground/5"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {sections.map((section, index) => {
                            // Determine icon based on component name
                            let ComponentIcon = FaEdit;
                            if (section.componentName === 'HeroSection') ComponentIcon = FaEye;
                            if (section.componentName.includes('Product')) ComponentIcon = FaBoxOpen;
                            if (section.componentName.includes('Offer')) ComponentIcon = FaTicketAlt;
                            if (section.componentName.includes('Trust')) ComponentIcon = FaShieldAlt;
                            if (section.componentName.includes('Category')) ComponentIcon = FaLayerGroup;
                            if (section.componentName.includes('Trend')) ComponentIcon = FaSort;
                            if (section.componentName.includes('Brand')) ComponentIcon = FaStar;
                            if (section.componentName.includes('Testi')) ComponentIcon = FaUserCheck;
                            if (section.componentName.includes('Deliver')) ComponentIcon = FaTruck;

                            return (
                                <motion.div
                                    key={section._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`group relative bg-surface rounded-[24px] border transition-all duration-300 overflow-hidden ${section.isActive
                                        ? 'border-foreground/5 shadow-sm hover:shadow-md hover:border-primary/20'
                                        : 'border-red-100 bg-red-50/10 opacity-75 grayscale-[0.5]'}`}
                                >
                                    {/* Status Indicator Line */}
                                    <div className={`h-1.5 w-full ${section.isActive ? 'bg-gradient-to-r from-primary/40 to-primary/10' : 'bg-red-200'}`} />

                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-4 mb-6">
                                            {/* Icon & Title */}
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-inner ${section.isActive ? 'bg-background text-primary' : 'bg-red-50 text-red-400'}`}>
                                                    <ComponentIcon />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-lg text-foreground tracking-tight leading-tight">{section.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-md">
                                                            {section.componentName}
                                                        </span>
                                                        {DATA_DRIVEN_COMPONENTS.includes(section.componentName) && (
                                                            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                                                <FaInfoCircle className="w-2.5 h-2.5" /> Auto
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Badge */}
                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] font-black uppercase text-foreground/20">Order</span>
                                                <span className="text-xl font-black text-foreground/10 tabular-nums leading-none">{String(section.order).padStart(2, '0')}</span>
                                            </div>
                                        </div>

                                        {/* Roles & Controls */}
                                        <div className="flex items-end justify-between mt-auto pt-6 border-t border-dashed border-foreground/5">
                                            <div className="flex flex-wrap gap-1.5 max-w-[60%]">
                                                {section.visibleFor.map(role => (
                                                    <span key={role} className="text-[9px] font-bold bg-foreground/5 text-foreground/60 px-2 py-1 rounded-md uppercase tracking-wider">
                                                        {role === 'MANUFACTURER' ? 'MFR' : role}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                {/* Reorder Group */}
                                                <div className="flex items-center bg-background rounded-[10px] border border-foreground/5 p-1 mr-2">
                                                    <button
                                                        onClick={() => handleMove(index, 'up')}
                                                        disabled={index === 0}
                                                        className="p-2 rounded-lg hover:bg-foreground/5 disabled:opacity-30 transition-colors text-foreground/60"
                                                        title="Move Earlier"
                                                    >
                                                        <FaArrowUp className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleMove(index, 'down')}
                                                        disabled={index === sections.length - 1}
                                                        className="p-2 rounded-lg hover:bg-foreground/5 disabled:opacity-30 transition-colors text-foreground/60"
                                                        title="Move Later"
                                                    >
                                                        <FaArrowDown className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleToggleActive(section._id, section.isActive)}
                                                    className={`p-2.5 rounded-[12px] transition-all border ${section.isActive ? 'bg-background border-foreground/5 text-foreground/40 hover:text-red-500 hover:border-red-200 hover:bg-red-50' : 'bg-green-50 text-green-600 border-green-200'}`}
                                                    title={section.isActive ? 'Disable' : 'Enable'}
                                                >
                                                    {section.isActive ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                                </button>

                                                <button
                                                    onClick={() => setEditingSection(section)}
                                                    className="p-2.5 bg-primary text-white rounded-[12px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                                    title="Edit Content"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
                {editingSection && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setEditingSection(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-surface w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden border border-foreground/10"
                        >
                            <div className="p-8 border-b border-foreground/5 sticky top-0 bg-surface z-10 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-black text-foreground">Edit Section</h2>
                                    <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest mt-1">{editingSection.sectionKey} — {editingSection.componentName}</p>
                                </div>
                                <button
                                    onClick={() => setEditingSection(null)}
                                    className="text-foreground/40 hover:text-foreground p-2"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleEditSave} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                                {/* Basic Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <EditorLabel>Display Title</EditorLabel>
                                        <input
                                            type="text"
                                            value={editingSection.title}
                                            onChange={e => setEditingSection({ ...editingSection, title: e.target.value })}
                                            className="w-full bg-background border border-foreground/10 rounded-[12px] px-4 py-3 text-sm focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <EditorLabel>Subtitle (Optional)</EditorLabel>
                                        <input
                                            type="text"
                                            value={editingSection.subtitle || ''}
                                            onChange={e => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                                            className="w-full bg-background border border-foreground/10 rounded-[12px] px-4 py-3 text-sm focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Visibility Roles */}
                                <div className="space-y-2">
                                    <EditorLabel>Visibility Roles</EditorLabel>
                                    <div className="flex flex-wrap gap-2">
                                        {['GUEST', 'CUSTOMER', 'DEALER', 'MANUFACTURER', 'ADMIN'].map(role => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => {
                                                    const current = editingSection.visibleFor;
                                                    const fresh = current.includes(role)
                                                        ? current.filter(r => r !== role)
                                                        : [...current, role];
                                                    setEditingSection({ ...editingSection, visibleFor: fresh });
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${editingSection.visibleFor.includes(role) ? 'bg-primary text-white' : 'bg-background border border-foreground/10 text-foreground/40'}`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Component-Specific Content Editor */}
                                <div className="border-t border-foreground/5 pt-6">
                                    <h4 className="text-sm font-black text-foreground mb-4 uppercase tracking-tighter flex items-center gap-2">
                                        <FaEdit className="w-3 h-3" /> Section Content
                                    </h4>
                                    <ContentEditor
                                        section={editingSection}
                                        setContent={(newContent: any) => setEditingSection({ ...editingSection, content: newContent })}
                                    />
                                </div>

                                {/* SEO */}
                                <div className="border-t border-foreground/5 pt-6">
                                    <h4 className="text-sm font-black text-foreground mb-4 uppercase tracking-tighter flex items-center gap-2">
                                        <FaSearch className="w-3 h-3" /> SEO Optimization
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <EditorLabel>Meta Title Override</EditorLabel>
                                            <input
                                                type="text"
                                                placeholder="Keep empty to use default"
                                                value={editingSection.seo?.metaTitle || ''}
                                                onChange={e => setEditingSection({ ...editingSection, seo: { ...(editingSection.seo || {}), metaTitle: e.target.value } })}
                                                className="w-full bg-background border border-foreground/10 rounded-[12px] px-4 py-3 text-sm focus:border-primary outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <EditorLabel>Meta Description</EditorLabel>
                                            <textarea
                                                rows={2}
                                                placeholder="Brief summary for search engines"
                                                value={editingSection.seo?.metaDescription || ''}
                                                onChange={e => setEditingSection({ ...editingSection, seo: { ...(editingSection.seo || {}), metaDescription: e.target.value } })}
                                                className="w-full bg-background border border-foreground/10 rounded-[12px] px-4 py-3 text-sm focus:border-primary outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="border-t border-foreground/5 pt-6 sticky bottom-0 bg-surface mt-auto">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full bg-primary text-white font-black py-4 rounded-[16px] flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                                    >
                                        {isSaving ? 'Saving Changes...' : 'Update Section Configuration'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
