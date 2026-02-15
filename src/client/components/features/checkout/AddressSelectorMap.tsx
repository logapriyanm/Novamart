'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { toast } from 'sonner';

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
const useMapEvents = dynamic(
    () => import('react-leaflet').then(mod => mod.useMapEvents),
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

interface AddressData {
    line1: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
}

interface AddressSelectorMapProps {
    onAddressSelect: (address: AddressData) => void;
}

function LocationMarker({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<L.LatLng | null>(null);

    const map = useMapEvents({
        click(e: any) {
            setPosition(e.latlng);
            onSelect(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={customIcon} />
    );
}

export default function AddressSelectorMap({ onAddressSelect }: AddressSelectorMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLocationSelect = async (lat: number, lng: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();

            if (data && data.address) {
                const address: AddressData = {
                    line1: [
                        data.address.house_number,
                        data.address.road,
                        data.address.suburb,
                        data.address.neighbourhood
                    ].filter(Boolean).join(', ') || data.display_name.split(',')[0],
                    city: data.address.city || data.address.town || data.address.village || data.address.county || '',
                    state: data.address.state || '',
                    zip: data.address.postcode || '',
                    lat,
                    lng
                };
                onAddressSelect(address);
                toast.success('Address details fetched from map!');
            }
        } catch (error) {
            console.error('Failed to fetch address:', error);
            toast.error('Could not fetch address details. Please enter manually.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isMounted) {
        return (
            <div className="w-full h-[300px] bg-slate-100 rounded-lg animate-pulse flex items-center justify-center text-slate-400">
                Loading Map...
            </div>
        );
    }

    return (
        <div className="w-full h-[350px] rounded-lg overflow-hidden border border-gray-200 relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker onSelect={handleLocationSelect} />
            </MapContainer>

            {isLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-[500] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-bold text-primary">Fetching Address...</span>
                    </div>
                </div>
            )}

            <div className="absolute top-4 left-16 right-4 z-[400] pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200 shadow-sm inline-block">
                    <p className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                        <HiOutlineLocationMarker className="text-primary" />
                        Click on map to select delivery location
                    </p>
                </div>
            </div>
        </div>
    );
}
