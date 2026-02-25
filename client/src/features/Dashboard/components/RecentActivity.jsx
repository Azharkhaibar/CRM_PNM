import React from 'react';

/**
 * Component untuk menampilkan recent activity feed
 * Untuk sementara menggunakan data dummy
 */
export default function RecentActivity() {
    // Data dummy untuk recent activity
    const activities = [
        {
            id: 1,
            icon: '✅',
            message: 'Risk mitigation completed for',
            target: 'Operational Risk',
            type: 'success',
        },
        {
            id: 2,
            icon: '📌',
            message: 'New risk assessment added in',
            target: 'Market Risk',
            type: 'info',
        },
        {
            id: 3,
            icon: '🔄',
            message: 'Credit risk data updated for',
            target: 'Q4',
            type: 'update',
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-slate-700 mb-4">
                📊 Recent Activity
            </h3>
            <div className="space-y-3">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <span className="text-xl">{activity.icon}</span>
                        <div>
                            <p className="text-slate-700 text-sm">
                                {activity.message}{' '}
                                <strong className="text-slate-900 font-semibold">
                                    {activity.target}
                                </strong>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
