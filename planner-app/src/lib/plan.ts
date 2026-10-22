import { COURSE, type Section } from '@/data/course'
import type { PlanDay, PlanItem, Settings } from './types'

const DAY_MS = 86_400_000

export function isoDay(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDay(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(iso: string, n: number): string {
  const d = parseDay(iso)
  d.setDate(d.getDate() + n)
  return isoDay(d)
}

export function todayIso(): string {
  return isoDay(new Date())
}

export function fmtDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return parseDay(iso).toLocaleDateString(undefined, opts ?? { weekday: 'short', month: 'short', day: 'numeric' })
}

export function fmtMinutes(min: number): string {
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function fmtClock(sec: number): string {
  return fmtMinutes(Math.round(sec / 60))
}

const REVIEW_DELAYS = [1, 3, 7, 14]

function reviewMinutes(sectionSec: number): number {
  return Math.max(10, Math.min(25, Math.round(sectionSec / 60 / 5)))
}

interface Assignment {
  section: Section
  dayIndex: number
}

/** Assign sections to days, filling each day up to the new-material budget. */
function assignNewSections(settings: Settings): { assignments: Assignment[]; daysUsed: number } {
  const sections = COURSE.filter((s) => s.videos.length > 0)
  const budgetMin = Math.max(15, settings.minutesPerDay * settings.newShare)
  const assignments: Assignment[] = []
  let dayIndex = 0
  let used = 0
  for (const s of sections) {
    const dur = s.videos.reduce((a, v) => a + v.dur, 0) / 60
    if (used > 0 && used + dur > budgetMin) {
      dayIndex += 1
      used = 0
    }
    assignments.push({ section: s, dayIndex })
    used += dur
  }
  return { assignments, daysUsed: dayIndex + 1 }
}

/** Build the full plan: new material spread over days + spaced reviews. */
export function buildPlan(settings: Settings): { days: PlanDay[]; daysUsed: number } {
  const { assignments, daysUsed } = assignNewSections(settings)
  const map = new Map<number, PlanItem[]>()
  const push = (idx: number, item: PlanItem) => {
    const arr = map.get(idx) ?? []
    arr.push(item)
    map.set(idx, arr)
  }

  for (const { section, dayIndex } of assignments) {
    const secSec = section.videos.reduce((a, v) => a + v.dur, 0)
    push(dayIndex, {
      id: `new-${section.num}`,
      kind: 'watch',
      sectionNum: section.num,
      sectionName: section.name,
      minutes: Math.round(secSec / 60),
      obj: section.videos[0]?.obj ?? '',
    })
    for (const delay of REVIEW_DELAYS) {
      push(dayIndex + delay, {
        id: `rev-${section.num}-${delay}`,
        kind: 'review',
        sectionNum: section.num,
        sectionName: section.name,
        minutes: reviewMinutes(secSec),
        obj: section.videos[0]?.obj ?? '',
      })
    }
  }

  const lastReview = Math.max(...[...map.keys()], 0)
  const totalDays = Math.max(daysUsed, lastReview + 1)
  const days: PlanDay[] = []
  for (let i = 0; i < totalDays; i++) {
    const date = addDays(settings.startDate, i)
    const items = (map.get(i) ?? []).sort((a, b) => (a.kind === b.kind ? a.sectionNum - b.sectionNum : a.kind === 'watch' ? -1 : 1))
    days.push({
      date,
      items,
      minutes: items.reduce((a, it) => a + it.minutes, 0),
      isNew: items.some((it) => it.kind === 'watch'),
    })
  }
  return { days, daysUsed }
}

/** Days between two ISO dates, inclusive of start, exclusive of end. */
export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((parseDay(toIso).getTime() - parseDay(fromIso).getTime()) / DAY_MS)
}

export function defaultSettings(): Settings {
  const start = todayIso()
  return {
    startDate: start,
    examDate: addDays(start, 42),
    minutesPerDay: 90,
    newShare: 0.65,
  }
}
