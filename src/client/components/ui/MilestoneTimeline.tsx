import React from 'react';
import { FaCheck, FaClock, FaCog } from 'react-icons/fa';

interface Milestone {
    _id: string;
    milestoneType: string;
    completed: boolean;
    completedAt?: string;
    notes?: string;
}

interface MilestoneTimelineProps {
    milestones: Milestone[];
}

const MILESTONE_LABELS: Record<string, string> = {
    DESIGN_APPROVED: 'Design Approved',
    PRODUCTION_STARTED: 'Production Started',
    QUALITY_CHECK: 'Quality Check',
    READY_TO_DISPATCH: 'Ready to Dispatch',
    DISPATCHED: 'Dispatched'
};

export default function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
    const sortedMilestones = [...milestones].sort((a, b) => {
        const order = ['DESIGN_APPROVED', 'PRODUCTION_STARTED', 'QUALITY_CHECK', 'READY_TO_DISPATCH', 'DISPATCHED'];
        return order.indexOf(a.milestoneType) - order.indexOf(b.milestoneType);
    });

    return (
        <div className="space-y-4">
            {sortedMilestones.map((milestone, index) => {
                const isCompleted = milestone.completed;
                const isLast = index === sortedMilestones.length - 1;

                return (
                    <div key={milestone._id} className="relative">
                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-[10px] border-2 transition-all ${isCompleted
                                    ? 'bg-green-500 border-green-500'
                                    : 'bg-white border-slate-200'
                                }`}>
                                {isCompleted ? (
                                    <FaCheck className="w-5 h-5 text-white" />
                                ) : (
                                    <FaClock className="w-5 h-5 text-slate-400" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-8">
                                <div className={`rounded-[15px] p-4 border transition-all ${isCompleted
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-slate-50 border-slate-200'
                                    }`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className={`font-black uppercase tracking-wider text-sm ${isCompleted ? 'text-green-800' : 'text-slate-600'
                                            }`}>
                                            {MILESTONE_LABELS[milestone.milestoneType] || milestone.milestoneType}
                                        </h4>
                                        {isCompleted && milestone.completedAt && (
                                            <span className="text-xs font-bold text-green-600">
                                                {new Date(milestone.completedAt).toLocaleDateString('en-IN', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    {milestone.notes && (
                                        <p className="text-xs text-slate-600 font-bold mt-2">
                                            {milestone.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Connector Line */}
                        {!isLast && (
                            <div className={`absolute left-6 top-12 w-0.5 h-full -translate-x-1/2 ${isCompleted ? 'bg-green-500' : 'bg-slate-200'
                                }`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
