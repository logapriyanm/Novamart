'use client';

import React from 'react';
import Link from 'next/link';
import { FaClock, FaArrowLeft } from 'react-icons/fa';

export default function PendingVerificationPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-[10px] sm:px-10 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
                        <FaClock className="h-8 w-8 text-yellow-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Under Verification</h2>

                    <p className="text-gray-600 mb-8">
                        Your account is currently pending verification. Our team is reviewing your details.
                        You will be notified once your account is approved.
                    </p>

                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-md">
                            <p className="text-sm text-blue-700">
                                This process usually takes 24-48 hours. If you have urgent queries, please contact support.
                            </p>
                        </div>

                        <Link
                            href="/"
                            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <FaArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
