export interface Settings {
  startDate: string // ISO yyyy-mm-dd
  examDate: string
  minutesPerDay: number
  newShare: number // fraction of daily minutes reserved for new material
}

export interface Task {
  id: string
  title: string
  done: boolean
}

export interface AppState {
  watched: Record<number, boolean> // video n -> watched
  checked: Record<string, boolean> // plan item id -> done
  tasks: Task[]
}

export type ItemKind = 'watch' | 'review'

export interface PlanItem {
  id: string
  kind: ItemKind
  sectionNum: number
  sectionName: string
  minutes: number
  obj: string
}

export interface PlanDay {
  date: string // ISO
  items: PlanItem[]
  minutes: number
  isNew: boolean // has new material
}

export type Tab = 'today' | 'plan' | 'course'
