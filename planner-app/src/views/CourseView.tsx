import { useMemo, useState } from 'react'
import { COURSE } from '@/data/course'
import { fmtClock } from '@/lib/plan'
import type { AppState } from '@/lib/types'

interface Props {
  state: AppState
  toggleVideo: (n: number) => void
}

export default function CourseView({ state, toggleVideo }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Record<number, boolean>>({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COURSE
    return COURSE.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.videos.some((v) => v.title.toLowerCase().includes(q)),
    )
  }, [query])

  const totalWatched = useMemo(
    () => COURSE.reduce((a, s) => a + s.videos.filter((v) => state.watched[v.n]).length, 0),
    [state.watched],
  )
  const totalVideos = COURSE.reduce((a, s) => a + s.videos.length, 0)

  return (
    <div className="space-y-5">
      <header className="px-1 pt-2">
        <h1 className="text-[28px] font-bold leading-tight">Course</h1>
        <p className="text-[13px] text-muted-foreground">
          Security+ SY0-701 · {totalWatched}/{totalVideos} videos watched
        </p>
      </header>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-2xl bg-card px-3 py-2.5 shadow-sm">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#8E8E93" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3 3" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sections or videos…"
          className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {filtered.map((s) => {
          const done = s.videos.filter((v) => state.watched[v.n]).length
          const total = s.videos.length
          const pct = total === 0 ? 0 : done / total
          const isOpen = !!open[s.num]
          const q = query.trim().toLowerCase()
          const matching = q ? s.videos.filter((v) => v.title.toLowerCase().includes(q)) : s.videos
          return (
            <div key={s.num} className="overflow-hidden rounded-2xl bg-card shadow-sm">
              <button
                className="flex w-full items-center gap-3 px-4 py-3 text-left active:opacity-60"
                onClick={() => setOpen((o) => ({ ...o, [s.num]: !isOpen }))}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold text-white"
                  style={{ backgroundColor: pct === 1 && total > 0 ? '#34C759' : '#007AFF' }}
                >
                  {String(s.num).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold">{s.name}</span>
                  <span className="block text-[12px] text-muted-foreground">
                    {total === 0 ? 'No videos' : `${done}/${total} videos · ${fmtClock(s.videos.reduce((a, v) => a + v.dur, 0))}`}
                  </span>
                </span>
                {total > 0 && (
                  <span className="flex w-12 shrink-0 items-center">
                    <span className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${pct * 100}%`, backgroundColor: pct === 1 ? '#34C759' : '#007AFF', transition: 'width 0.3s ease' }}
                      />
                    </span>
                  </span>
                )}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="#C7C7CC"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                >
                  <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
                </svg>
              </button>
              {isOpen && total > 0 && (
                <div className="divide-y divide-border border-t border-border">
                  {matching.map((v) => {
                    const doneV = !!state.watched[v.n]
                    return (
                      <div key={v.n} className="flex items-center gap-3 px-4 py-2.5">
                        <button
                          onClick={() => toggleVideo(v.n)}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-[1.5px]"
                          style={{
                            borderColor: doneV ? '#34C759' : '#C7C7CC',
                            backgroundColor: doneV ? '#34C759' : 'transparent',
                          }}
                          aria-label="toggle watched"
                        >
                          {doneV && (
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 6.2 4.8 9 10 3.2" />
                            </svg>
                          )}
                        </button>
                        <span className={`min-w-0 flex-1 truncate text-[14px] ${doneV ? 'text-muted-foreground line-through' : ''}`}>
                          {v.title}
                        </span>
                        {v.obj && <span className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{v.obj}</span>}
                        <span className="shrink-0 text-[12px] text-muted-foreground">{fmtClock(v.dur)}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-[14px] text-muted-foreground">No matches for “{query}”.</p>
        )}
      </div>
    </div>
  )
}
