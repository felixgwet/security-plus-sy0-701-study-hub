import { useMemo, useState } from 'react'
import { COURSE, TOTAL_SECONDS } from '@/data/course'
import { daysBetween, fmtDate, fmtMinutes, todayIso } from '@/lib/plan'
import type { AppState, PlanDay, Settings } from '@/lib/types'

interface Props {
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  state: AppState
  days: PlanDay[]
  daysUsed: number
}

export default function PlanView({ settings, setSettings, state, days, daysUsed }: Props) {
  const [showAll, setShowAll] = useState(false)
  const today = todayIso()

  const stats = useMemo(() => {
    const totalMin = TOTAL_SECONDS / 60
    const doneMin = watchedMinutes(state)
    const remaining = totalMin - doneMin
    const daysLeft = Math.max(0, daysBetween(today, settings.examDate))
    const planNewMin = days
      .filter((d) => d.date >= today)
      .flatMap((d) => d.items)
      .filter((it) => it.kind === 'watch')
      .reduce((a, it) => a + it.minutes, 0)
    const pace = daysLeft > 0 ? Math.ceil(Math.min(planNewMin, remaining) / daysLeft) : Math.ceil(remaining)
    return { totalMin, doneMin, remaining, daysLeft, pace }
  }, [state.watched, settings.examDate, days, today])

  const visibleDays = showAll ? days : days.filter((d) => d.date >= today)

  return (
    <div className="space-y-5">
      <header className="px-1 pt-2">
        <h1 className="text-[28px] font-bold leading-tight">Revision Plan</h1>
        <p className="text-[13px] text-muted-foreground">CompTIA Security+ SY0-701 · {fmtMinutes(Math.round(stats.totalMin))} course</p>
      </header>

      {/* Progress + pace card */}
      <div className="rounded-3xl bg-card p-4 shadow-sm">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[13px] font-semibold text-muted-foreground">Course progress</span>
          <span className="text-[15px] font-bold" style={{ color: '#34C759' }}>
            {Math.round((stats.doneMin / stats.totalMin) * 100)}%
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.min(100, (stats.doneMin / stats.totalMin) * 100)}%`, backgroundColor: '#34C759', transition: 'width 0.4s ease' }}
          />
        </div>
        <div className="mt-3 grid grid-cols-3 divide-x divide-border text-center">
          <div>
            <p className="text-[17px] font-bold">{stats.daysLeft}</p>
            <p className="text-[11px] text-muted-foreground">days to exam</p>
          </div>
          <div>
            <p className="text-[17px] font-bold">{fmtMinutes(Math.round(stats.remaining))}</p>
            <p className="text-[11px] text-muted-foreground">left to watch</p>
          </div>
          <div>
            <p className="text-[17px] font-bold" style={{ color: '#FF9500' }}>
              {fmtMinutes(stats.pace)}
            </p>
            <p className="text-[11px] text-muted-foreground">pace / day</p>
          </div>
        </div>
      </div>

      {/* Settings card */}
      <div className="rounded-3xl bg-card p-4 shadow-sm">
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[#8E8E93]">Plan settings</h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between gap-3">
            <span className="text-[15px]">Start date</span>
            <input
              type="date"
              value={settings.startDate}
              onChange={(e) => e.target.value && setSettings((s) => ({ ...s, startDate: e.target.value }))}
              className="rounded-lg bg-secondary px-2 py-1 text-[14px] outline-none"
            />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span className="text-[15px]">Exam date</span>
            <input
              type="date"
              value={settings.examDate}
              onChange={(e) => e.target.value && setSettings((s) => ({ ...s, examDate: e.target.value }))}
              className="rounded-lg bg-secondary px-2 py-1 text-[14px] outline-none"
            />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span className="text-[15px]">Study time per day</span>
            <span className="flex items-center gap-2">
              <button
                className="h-7 w-7 rounded-full bg-secondary text-[16px] font-semibold active:opacity-60"
                onClick={() => setSettings((s) => ({ ...s, minutesPerDay: Math.max(30, s.minutesPerDay - 15) }))}
              >
                −
              </button>
              <span className="w-14 text-center text-[15px] font-semibold">{fmtMinutes(settings.minutesPerDay)}</span>
              <button
                className="h-7 w-7 rounded-full bg-secondary text-[16px] font-semibold active:opacity-60"
                onClick={() => setSettings((s) => ({ ...s, minutesPerDay: Math.min(360, s.minutesPerDay + 15) }))}
              >
                +
              </button>
            </span>
          </label>
        </div>
        <p className="mt-3 text-[12px] leading-snug text-muted-foreground">
          New material is spread over <span className="font-semibold">{daysUsed} days</span>, then each section is
          reviewed after 1, 3, 7 and 14 days. Exam date {fmtDate(settings.examDate, { month: 'long', day: 'numeric' })}.
        </p>
      </div>

      {/* Timeline */}
      <section>
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[#8E8E93]">Schedule</h2>
          <button className="text-[13px] font-medium text-[#007AFF] active:opacity-60" onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Hide past' : 'Show all'}
          </button>
        </div>
        <div className="space-y-3">
          {visibleDays.map((d) => {
            const isToday = d.date === today
            const allDone = d.items.length > 0 && d.items.every((it) => state.checked[it.id])
            const past = d.date < today
            if (d.items.length === 0 && !isToday) return null
            return (
              <div
                key={d.date}
                className={`overflow-hidden rounded-2xl bg-card shadow-sm ${isToday ? 'ring-2 ring-[#007AFF]' : ''} ${past ? 'opacity-55' : ''}`}
              >
                <div className="flex items-center justify-between px-4 pt-3">
                  <p className={`text-[14px] font-semibold ${isToday ? 'text-[#007AFF]' : ''}`}>
                    {isToday ? 'Today' : fmtDate(d.date, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {d.items.length === 0 ? 'Rest day' : `${d.items.length} session${d.items.length === 1 ? '' : 's'} · ${fmtMinutes(d.minutes)}${allDone ? ' · done ✓' : ''}`}
                  </p>
                </div>
                {d.items.length > 0 && (
                  <div className="mt-1 divide-y divide-border">
                    {d.items.map((it) => {
                      const done = !!state.checked[it.id]
                      return (
                        <div key={it.id} className="flex items-center gap-2.5 px-4 py-2.5">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: done ? '#C7C7CC' : it.kind === 'watch' ? '#007AFF' : '#AF52DE' }}
                          />
                          <span className={`min-w-0 flex-1 truncate text-[14px] ${done ? 'text-muted-foreground line-through' : ''}`}>
                            {it.kind === 'watch' ? 'Watch' : 'Review'} · {it.sectionName}
                          </span>
                          <span className="shrink-0 text-[12px] text-muted-foreground">{fmtMinutes(it.minutes)}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
                <div className="h-2" />
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function watchedMinutes(state: AppState): number {
  // derived from course data at module level to keep this cheap
  let min = 0
  for (const sec of COURSE) {
    for (const v of sec.videos) {
      if (state.watched[v.n]) min += v.dur / 60
    }
  }
  return min
}
