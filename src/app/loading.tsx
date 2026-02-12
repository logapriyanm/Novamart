'use strict';
import Loader from '@/client/components/ui/Loader';

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Loader size="xl" variant="primary" />
        </div>
    );
}
