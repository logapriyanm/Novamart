'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTimes, FaPlus, FaCheck, FaSpinner } from 'react-icons/fa';
import MediaUpload from '../../ui/MediaUpload';
import { toast } from 'sonner';
import axios from 'axios';

interface ReviewFormProps {
    type: 'PRODUCT' | 'SELLER';
    orderId: string;
    targetId: string; // productId or sellerId
    orderItemId?: string; // Only for product reviews
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function ReviewForm({ type, orderId, targetId, orderItemId, onSuccess, onCancel }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    // Seller Specific Ratings
    const [deliveryRating, setDeliveryRating] = useState(0);
    const [packagingRating, setPackagingRating] = useState(0);
    const [communicationRating, setCommunicationRating] = useState(0);

    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [pros, setPros] = useState<string[]>([]);
    const [cons, setCons] = useState<string[]>([]);
    const [newPro, setNewPro] = useState('');
    const [newCon, setNewCon] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return toast.error('Please provide a rating');
        if (!title.trim()) return toast.error('Please provide a title');
        if (!comment.trim()) return toast.error('Please write a review');

        setIsSubmitting(true);
        try {
            const endpoint = type === 'PRODUCT' ? '/api/reviews/product' : '/api/reviews/seller';
            const payload = type === 'PRODUCT' ? {
                orderItemId,
                productId: targetId,
                rating,
                title,
                comment,
                pros,
                cons,
                images
            } : {
                orderId,
                sellerId: targetId,
                rating,
                delivery: deliveryRating,
                packaging: packagingRating,
                communication: communicationRating,
                title,
                comment,
                images // Though backend doesn't explicitly store image array for Seller reviews in Schema, we can add it or ignore. Schema has images: [String], so it's fine.
            };

            await axios.post(endpoint, payload);
            toast.success('Review submitted successfully!');
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addPro = () => {
        if (newPro.trim()) {
            setPros([...pros, newPro.trim()]);
            setNewPro('');
        }
    };

    const addCon = () => {
        if (newCon.trim()) {
            setCons([...cons, newCon.trim()]);
            setNewCon('');
        }
    };

    const handleImageUpload = (result: any) => {
        setImages([...images, result.secure_url]);
    };

    const StarRating = ({ value, onChange, label, size = 'md' }: any) => {
        const [hover, setHover] = useState(0);
        return (
            <div className="flex flex-col gap-1">
                {label && <span className="text-sm font-medium text-slate-600">{label}</span>}
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => onChange(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className={`${size === 'lg' ? 'text-3xl' : 'text-xl'} transition-colors ${star <= (hover || value) ? 'text-yellow-400' : 'text-slate-200'
                                }`}
                        >
                            <FaStar />
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl font-bold text-slate-800">
                Write a {type === 'PRODUCT' ? 'Product' : 'Seller'} Review
            </h3>

            {/* Main Rating */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col items-center gap-2">
                <span className="text-lg font-semibold text-slate-700">Overall Rating</span>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className={`text-4xl transition-all hover:scale-110 ${star <= (hoverRating || rating) ? 'text-yellow-400 drop-shadow-sm' : 'text-slate-200'
                                }`}
                        >
                            <FaStar />
                        </button>
                    ))}
                </div>
                <span className="text-sm font-medium text-slate-500">
                    {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : rating === 1 ? 'Terrible' : 'Select a rating'}
                </span>
            </div>

            {/* Seller Specific Ratings */}
            {type === 'SELLER' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StarRating label="Delivery" value={deliveryRating} onChange={setDeliveryRating} />
                    <StarRating label="Packaging" value={packagingRating} onChange={setPackagingRating} />
                    <StarRating label="Communication" value={communicationRating} onChange={setCommunicationRating} />
                </div>
            )}

            {/* Title & Comment */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Review Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Summarize your experience"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#2772A0]/20 focus:border-[#2772A0] outline-none transition-all"
                        maxLength={100}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Review</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like or dislike? How was the quality?"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#2772A0]/20 focus:border-[#2772A0] outline-none transition-all min-h-[120px]"
                        maxLength={1000}
                    />
                    <div className="text-right text-xs text-slate-400 mt-1">{comment.length}/1000</div>
                </div>
            </div>

            {/* Pros & Cons (Product Only) */}
            {type === 'PRODUCT' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-green-600 mb-1">Pros</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newPro}
                                onChange={(e) => setNewPro(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
                                placeholder="Add a pro"
                                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-green-500 outline-none"
                            />
                            <button type="button" onClick={addPro} className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                                <FaPlus size={12} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {pros.map((pro, idx) => (
                                <span key={idx} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                    <FaCheck size={8} /> {pro}
                                    <button type="button" onClick={() => setPros(pros.filter((_, i) => i !== idx))} className="ml-1 hover:text-green-900"><FaTimes size={10} /></button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-red-600 mb-1">Cons</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newCon}
                                onChange={(e) => setNewCon(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
                                placeholder="Add a con"
                                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-red-500 outline-none"
                            />
                            <button type="button" onClick={addCon} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                <FaPlus size={12} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {cons.map((con, idx) => (
                                <span key={idx} className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                    <FaTimes size={8} /> {con}
                                    <button type="button" onClick={() => setCons(cons.filter((_, i) => i !== idx))} className="ml-1 hover:text-red-900"><FaTimes size={10} /></button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Media Upload */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Add Photos</label>
                <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200">
                            <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FaTimes size={10} />
                            </button>
                        </div>
                    ))}
                    {images.length < 5 && (
                        <div className="aspect-square">
                            <MediaUpload
                                onUploadSuccess={handleImageUpload}
                                folder="reviews"
                                resourceType="image"
                                label="Add Photo"
                                multiple={false}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2 rounded-xl bg-[#2772A0] text-white font-bold hover:bg-[#1f5c82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#2772A0]/20"
                >
                    {isSubmitting ? (
                        <>
                            <FaSpinner className="animate-spin" /> Submitting...
                        </>
                    ) : (
                        'Submit Review'
                    )}
                </button>
            </div>
        </form>
    );
}
