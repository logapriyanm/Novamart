'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { HiOutlineLocationMarker } from 'react-icons/hi';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then(mod => mod.MapContainer),
    { ssr: false }
) as any;
const TileLayer = dynamic(
    () => import('react-leaflet').then(mod => mod.TileLayer),
    { ssr: false }
) as any;
const Marker = dynamic(
    () => import('react-leaflet').then(mod => mod.Marker),
    { ssr: false }
) as any;
const Popup = dynamic(
    () => import('react-leaflet').then(mod => mod.Popup),
    { ssr: false }
) as any;
const Polyline = dynamic(
    () => import('react-leaflet').then(mod => mod.Polyline),
    { ssr: false }
) as any;

// Fix for Leaflet default icon issues in Next.js
import L from 'leaflet';

const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface DeliveryMapProps {
    sellerLocation?: { lat: number; lng: number; label?: string };
    customerLocation?: { lat: number; lng: number; label?: string };
}

export default function DeliveryMap({
    sellerLocation = { lat: 28.7041, lng: 77.1025, label: "Seller Location" }, // Default: Delhi
    customerLocation = { lat: 19.0760, lng: 72.8777, label: "Your Location" }  // Default: Mumbai
}: DeliveryMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="w-full h-[300px] bg-slate-100 rounded-lg animate-pulse flex items-center justify-center text-slate-400">
                Loading Map...
            </div>
        );
    }

    const center = {
        lat: (sellerLocation.lat + customerLocation.lat) / 2,
        lng: (sellerLocation.lng + customerLocation.lng) / 2
    };

    return (
        <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200 relative z-0">
            <MapContainer
                center={center}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Seller Marker */}
                <Marker position={sellerLocation} icon={customIcon}>
                    <Popup>
                        <div className="font-bold text-sm">{sellerLocation.label}</div>
                        <div className="text-xs text-gray-500">Dispatch Center</div>
                    </Popup>
                </Marker>

                {/* Customer Marker */}
                <Marker position={customerLocation} icon={customIcon}>
                    <Popup>
                        <div className="font-bold text-sm">{customerLocation.label}</div>
                        <div className="text-xs text-gray-500">Delivery Address</div>
                    </Popup>
                </Marker>

                {/* Route Line */}
                <Polyline
                    positions={[
                        [sellerLocation.lat, sellerLocation.lng],
                        [customerLocation.lat, customerLocation.lng]
                    ]}
                    pathOptions={{
                        color: "#1212A1", // NovaMart Blue
                        weight: 4,
                        opacity: 0.7,
                        dashArray: "10, 10"
                    }}
                />
            </MapContainer>

            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm z-[400] text-xs">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <span className="font-semibold text-gray-700">Route Estimate</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
