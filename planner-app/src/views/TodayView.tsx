import { useState } from 'react'
import ProgressRing from '@/components/ProgressRing'
import { fmtDate, fmtMinutes, todayIso } from '@/lib/plan'
import type { AppState, PlanDay } from '@/lib/types'

interface Props {
  day: PlanDay | null
  dayLabel: string
  state: AppState
  toggleItem: (id: string) => void
  setState: React.Dispatch<React.SetStateAction<AppState>>
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function TodayView({ day, dayLabel, state, toggleItem, setState }: Props) {
  const [draft, setDraft] = useState('')
  const items = day?.items ?? []
  const doneCount = items.filter((it) => state.checked[it.id]).length
  const total = items.length
  const progress = total === 0 ? 0 : doneCount / total
  const tasks = state.tasks
  const openTasks = tasks.filter((t) => !t.done)

  const addTask = () => {
    const title = draft.trim()
    if (!title) return
    setState((s) => ({ ...s, tasks: [...s.tasks, { id: `t-${Date.now()}`, title, done: false }] }))
    setDraft('')
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="px-1 pt-2">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-[#8E8E93]">
          {fmtDate(dayLabel, { weekday: 'long', month: 'long', day: 'numeric' })}
          {dayLabel !== todayIso() && <span className="ml-2 normal-case text-[#FF9500]">(upcoming)</span>}
        </p>
        <h1 className="mt-0.5 text-[28px] font-bold leading-tight">{greeting()}, Felix</h1>
      </header>

      {/* Summary card */}
      <div className="flex items-center gap-4 rounded-3xl bg-card p-4 shadow-sm">
        <div className="relative">
          <ProgressRing size={72} progress={progress} />
          <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold">
            {total === 0 ? '—' : `${doneCount}/${total}`}
          </span>
        </div>
        <div>
          <p className="text-[15px] font-semibold">
            {total === 0 ? 'No study sessions scheduled' : `${total - doneCount} session${total - doneCount === 1 ? '' : 's'} to go`}
          </p>
          <p className="text-[13px] text-muted-foreground">
            {total === 0 ? 'Enjoy your day off 🎉' : `${fmtMinutes(items.reduce((a, it) => a + it.minutes, 0))} of study planned · ${openTasks.length} open task${openTasks.length === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      {/* Sessions */}
      {total > 0 && (
        <section>
          <h2 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wide text-[#8E8E93]">Study sessions</h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-sm">
            {items.map((it) => {
              const done = !!state.checked[it.id]
              return (
                <button
                  key={it.id}
                  onClick={() => toggleItem(it.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left active:opacity-60"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors"
                    style={{
                      borderColor: done ? '#007AFF' : '#C7C7CC',
                      backgroundColor: done ? '#007AFF' : 'transparent',
                    }}
                  >
                    {done && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6.2 4.8 9 10 3.2" />
                      </svg>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-[15px] font-medium ${done ? 'text-muted-foreground line-through' : ''}`}>
                      {it.kind === 'watch' ? 'Watch' : 'Review'} · {it.sectionName}
                    </span>
                    {it.obj && <span className="block text-[12px] text-muted-foreground">{it.obj}</span>}
                  </span>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      backgroundColor: it.kind === 'watch' ? 'rgba(0,122,255,0.12)' : 'rgba(175,82,222,0.12)',
                      color: it.kind === 'watch' ? '#007AFF' : '#AF52DE',
                    }}
                  >
                    {fmtMinutes(it.minutes)}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Tasks */}
      <section>
        <h2 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wide text-[#8E8E93]">My tasks</h2>
        <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a task for today…"
              className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={addTask}
              className="rounded-full bg-[#007AFF] px-3 py-1 text-[13px] font-semibold text-white active:opacity-70"
            >
              Add
            </button>
          </div>
          {tasks.length === 0 ? (
            <p className="px-4 py-4 text-[13px] text-muted-foreground">No personal tasks yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <button
                    onClick={() => setState((s) => ({ ...s, tasks: s.tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)) }))}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px]"
                    style={{
                      borderColor: t.done ? '#34C759' : '#C7C7CC',
                      backgroundColor: t.done ? '#34C759' : 'transparent',
                    }}
                    aria-label="toggle task"
                  >
                    {t.done && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6.2 4.8 9 10 3.2" />
                      </svg>
                    )}
                  </button>
                  <span className={`min-w-0 flex-1 truncate text-[15px] ${t.done ? 'text-muted-foreground line-through' : ''}`}>
                    {t.title}
                  </span>
                  <button
                    onClick={() => setState((s) => ({ ...s, tasks: s.tasks.filter((x) => x.id !== t.id) }))}
                    className="text-[#FF3B30] text-[12px] font-medium active:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
