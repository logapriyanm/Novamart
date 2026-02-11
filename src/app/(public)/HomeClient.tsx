import DynamicHome from '@/client/components/cms/DynamicHome';

export default function HomeClient() {
    return (
        <div className="min-h-screen bg-[#F1F5F9]/50 pt-40 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                <DynamicHome />
            </div>
        </div>
    );
}
