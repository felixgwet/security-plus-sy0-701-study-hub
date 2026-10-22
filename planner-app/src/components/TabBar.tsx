import type { ReactElement } from 'react'
import type { Tab } from '@/lib/types'

const TABS: { id: Tab; label: string; icon: (active: boolean) => ReactElement }[] = [
  {
    id: 'today',
    label: 'Today',
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? '#007AFF' : '#8E8E93'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4.5" width="18" height="16" rx="3.5" />
        <path d="M3 9.5h18" stroke={a ? '#007AFF' : '#C7C7CC'} />
        <circle cx="8.2" cy="14.5" r="1.4" fill={a ? '#007AFF' : '#C7C7CC'} stroke="none" />
        <path d="M13 14.5h5" stroke={a ? '#007AFF' : '#C7C7CC'} />
      </svg>
    ),
  },
  {
    id: 'plan',
    label: 'Plan',
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? '#007AFF' : '#8E8E93'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l2.4 5.3 5.6.6-4.2 3.9 1.2 5.6L12 15.5 7 18.4l1.2-5.6L4 8.9l5.6-.6z" />
      </svg>
    ),
  },
  {
    id: 'course',
    label: 'Course',
    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a ? '#007AFF' : '#8E8E93'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
        <path d="M4 20.5V5.5" stroke={a ? '#007AFF' : '#C7C7CC'} />
        <path d="M9 7.5h7M9 10.5h5" stroke={a ? '#007AFF' : '#C7C7CC'} />
      </svg>
    ),
  },
]

export default function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-[430px] border-t border-border bg-card/80 backdrop-blur-xl">
        <div className="grid grid-cols-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="flex flex-col items-center gap-0.5 outline-none"
              aria-label={t.label}
            >
              {t.icon(tab === t.id)}
              <span className={`text-[10px] font-medium ${tab === t.id ? 'text-[#007AFF]' : 'text-[#8E8E93]'}`}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
