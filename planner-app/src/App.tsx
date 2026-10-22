import { useEffect, useMemo, useState } from 'react'
import TabBar from '@/components/TabBar'
import { buildPlan, defaultSettings, todayIso } from '@/lib/plan'
import { usePersistentState } from '@/lib/storage'
import type { AppState, Tab } from '@/lib/types'
import CourseView from '@/views/CourseView'
import PlanView from '@/views/PlanView'
import TodayView from '@/views/TodayView'

const initialState: AppState = { watched: {}, checked: {}, tasks: [] }

export default function App() {
  const [tab, setTab] = useState<Tab>(() => {
    const h = window.location.hash.replace('#', '')
    return h === 'plan' || h === 'course' ? h : 'today'
  })
  const changeTab = (t: Tab) => {
    setTab(t)
    window.location.hash = t
  }
  const [settings, setSettings] = usePersistentState('secplus.settings', defaultSettings)
  const [state, setState] = usePersistentState<AppState>('secplus.state', () => initialState)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => document.documentElement.classList.toggle('dark', mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const { days, daysUsed } = useMemo(() => buildPlan(settings), [settings])

  // The "today" plan day: today if it has items, otherwise the next day that does.
  const today = todayIso()
  const dayEntry = useMemo(() => {
    const t = days.find((d) => d.date === today)
    if (t && t.items.length > 0) return { day: t, label: today }
    const next = days.find((d) => d.date > today && d.items.length > 0)
    return next ? { day: next, label: next.date } : { day: t ?? null, label: today }
  }, [days, today])

  const toggleItem = (id: string) =>
    setState((s) => ({ ...s, checked: { ...s.checked, [id]: !s.checked[id] } }))

  const toggleVideo = (n: number) =>
    setState((s) => ({ ...s, watched: { ...s.watched, [n]: !s.watched[n] } }))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto min-h-screen w-full max-w-[430px] px-4 pb-28 pt-[max(1rem,env(safe-area-inset-top))]">
        {tab === 'today' && (
          <TodayView
            day={dayEntry.day}
            dayLabel={dayEntry.label}
            state={state}
            toggleItem={toggleItem}
            setState={setState}
          />
        )}
        {tab === 'plan' && (
          <PlanView
            settings={settings}
            setSettings={setSettings}
            state={state}
            days={days}
            daysUsed={daysUsed}
          />
        )}
        {tab === 'course' && <CourseView state={state} toggleVideo={toggleVideo} />}
      </div>
      <TabBar tab={tab} onChange={changeTab} />
    </div>
  )
}
