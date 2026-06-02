import React from 'react'

const actions = [
  {
    label: 'Book a Visit',
    sub: 'Schedule with Dr. Elena',
    bgColor: 'bg-[#e8f0eb]',
    icon: (
      <svg className="w-5 h-5 text-[#4a7c59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 13v4m-2-2h4" />
      </svg>
    ),
  },
  {
    label: 'Upload Test Results',
    sub: 'Bloodwork, Scans, etc.',
    bgColor: 'bg-[#fce8e4]',
    icon: (
      <svg className="w-5 h-5 text-[#c0614f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m-4-4l4-4 4 4" />
      </svg>
    ),
  },
  {
    label: 'View Prediction Reports',
    sub: 'AI Health Insights',
    bgColor: 'bg-[#ebe8f5]',
    icon: (
      <svg className="w-5 h-5 text-[#7c6aad]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {actions.map(({ label, sub, bgColor, icon }) => (
        <button
          key={label}
          className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between hover:shadow-sm transition-shadow text-left"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
              {icon}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            </div>
          </div>
          <svg className="w-4 h-4 text-gray-300 flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ))}
    </div>
  )
}