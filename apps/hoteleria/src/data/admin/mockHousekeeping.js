// Mock housekeeping tasks data for hotel admin system
import { mockStaff } from './mockStaff'

const today = new Date()
const formatDateTime = (date) => date.toISOString()
const addHours = (date, hours) => {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

export const mockHousekeepingTasks = [
  // Pending tasks
  {
    id: 'HK-001',
    roomId: 6,
    roomNumber: '415',
    floor: 4,
    type: 'checkout-clean',
    priority: 'high',
    status: 'pending',
    assignedTo: null,
    assignedToName: null,
    scheduledTime: formatDateTime(addHours(today, 1)),
    startedAt: null,
    completedAt: null,
    notes: 'Guest checking out at 11am',
    checklistItems: [
      { id: 1, task: 'Strip and change bed linens', completed: false },
      { id: 2, task: 'Deep clean bathroom', completed: false },
      { id: 3, task: 'Vacuum and mop floors', completed: false },
      { id: 4, task: 'Restock minibar', completed: false },
      { id: 5, task: 'Restock toiletries', completed: false },
      { id: 6, task: 'Dust all surfaces', completed: false },
      { id: 7, task: 'Check all electronics', completed: false },
      { id: 8, task: 'Final inspection', completed: false }
    ]
  },
  {
    id: 'HK-002',
    roomId: 9,
    roomNumber: '302',
    floor: 3,
    type: 'checkout-clean',
    priority: 'high',
    status: 'pending',
    assignedTo: null,
    assignedToName: null,
    scheduledTime: formatDateTime(addHours(today, 1)),
    startedAt: null,
    completedAt: null,
    notes: 'Guest checking out at 11am',
    checklistItems: [
      { id: 1, task: 'Strip and change bed linens', completed: false },
      { id: 2, task: 'Deep clean bathroom', completed: false },
      { id: 3, task: 'Vacuum and mop floors', completed: false },
      { id: 4, task: 'Restock minibar', completed: false },
      { id: 5, task: 'Restock toiletries', completed: false },
      { id: 6, task: 'Dust all surfaces', completed: false },
      { id: 7, task: 'Final inspection', completed: false }
    ]
  },
  {
    id: 'HK-003',
    roomId: 2,
    roomNumber: '205',
    floor: 2,
    type: 'checkout-clean',
    priority: 'high',
    status: 'assigned',
    assignedTo: 'STAFF-002',
    assignedToName: 'Carlos Rodriguez',
    scheduledTime: formatDateTime(addHours(today, 0)),
    startedAt: null,
    completedAt: null,
    notes: 'Late checkout - 12pm',
    checklistItems: [
      { id: 1, task: 'Strip and change bed linens', completed: false },
      { id: 2, task: 'Deep clean bathroom', completed: false },
      { id: 3, task: 'Vacuum and mop floors', completed: false },
      { id: 4, task: 'Restock minibar', completed: false },
      { id: 5, task: 'Restock toiletries', completed: false },
      { id: 6, task: 'Dust all surfaces', completed: false },
      { id: 7, task: 'Final inspection', completed: false }
    ]
  },
  // In progress
  {
    id: 'HK-004',
    roomId: 7,
    roomNumber: '508',
    floor: 5,
    type: 'daily',
    priority: 'normal',
    status: 'in-progress',
    assignedTo: 'STAFF-001',
    assignedToName: 'Maria Garcia',
    scheduledTime: formatDateTime(addHours(today, -1)),
    startedAt: formatDateTime(addHours(today, -0.5)),
    completedAt: null,
    notes: 'Guest requested cleaning while at breakfast',
    checklistItems: [
      { id: 1, task: 'Make bed', completed: true },
      { id: 2, task: 'Clean bathroom', completed: true },
      { id: 3, task: 'Replace towels', completed: true },
      { id: 4, task: 'Empty trash', completed: false },
      { id: 5, task: 'Vacuum floor', completed: false },
      { id: 6, task: 'Restock amenities', completed: false }
    ]
  },
  {
    id: 'HK-005',
    roomId: 4,
    roomNumber: '310',
    floor: 3,
    type: 'daily',
    priority: 'normal',
    status: 'in-progress',
    assignedTo: 'STAFF-003',
    assignedToName: 'Ana Martinez',
    scheduledTime: formatDateTime(addHours(today, -1)),
    startedAt: formatDateTime(addHours(today, -0.3)),
    completedAt: null,
    notes: '',
    checklistItems: [
      { id: 1, task: 'Make bed', completed: true },
      { id: 2, task: 'Clean bathroom', completed: false },
      { id: 3, task: 'Replace towels', completed: false },
      { id: 4, task: 'Empty trash', completed: false },
      { id: 5, task: 'Vacuum floor', completed: false }
    ]
  },
  // Completed today
  {
    id: 'HK-006',
    roomId: 8,
    roomNumber: '601',
    floor: 6,
    type: 'daily',
    priority: 'high',
    status: 'completed',
    assignedTo: 'STAFF-001',
    assignedToName: 'Maria Garcia',
    scheduledTime: formatDateTime(addHours(today, -3)),
    startedAt: formatDateTime(addHours(today, -3)),
    completedAt: formatDateTime(addHours(today, -2)),
    notes: 'VIP room - extra attention required',
    checklistItems: [
      { id: 1, task: 'Make bed with premium linens', completed: true },
      { id: 2, task: 'Deep clean bathroom', completed: true },
      { id: 3, task: 'Replace all towels', completed: true },
      { id: 4, task: 'Empty trash', completed: true },
      { id: 5, task: 'Vacuum and mop', completed: true },
      { id: 6, task: 'Restock premium amenities', completed: true },
      { id: 7, task: 'Fresh flowers arrangement', completed: true },
      { id: 8, task: 'Polish all surfaces', completed: true }
    ]
  },
  {
    id: 'HK-007',
    roomId: 5,
    roomNumber: '412',
    floor: 4,
    type: 'daily',
    priority: 'normal',
    status: 'completed',
    assignedTo: 'STAFF-002',
    assignedToName: 'Carlos Rodriguez',
    scheduledTime: formatDateTime(addHours(today, -4)),
    startedAt: formatDateTime(addHours(today, -4)),
    completedAt: formatDateTime(addHours(today, -3)),
    notes: '',
    checklistItems: [
      { id: 1, task: 'Make bed', completed: true },
      { id: 2, task: 'Clean bathroom', completed: true },
      { id: 3, task: 'Replace towels', completed: true },
      { id: 4, task: 'Empty trash', completed: true },
      { id: 5, task: 'Vacuum floor', completed: true },
      { id: 6, task: 'Restock amenities', completed: true }
    ]
  },
  // Turndown service tasks
  {
    id: 'HK-008',
    roomId: 8,
    roomNumber: '601',
    floor: 6,
    type: 'turndown',
    priority: 'normal',
    status: 'pending',
    assignedTo: null,
    assignedToName: null,
    scheduledTime: formatDateTime(addHours(today, 8)),
    startedAt: null,
    completedAt: null,
    notes: 'VIP room',
    checklistItems: [
      { id: 1, task: 'Turn down bed', completed: false },
      { id: 2, task: 'Close curtains', completed: false },
      { id: 3, task: 'Place chocolates', completed: false },
      { id: 4, task: 'Refresh towels if needed', completed: false },
      { id: 5, task: 'Empty trash', completed: false }
    ]
  },
  {
    id: 'HK-009',
    roomId: 5,
    roomNumber: '412',
    floor: 4,
    type: 'turndown',
    priority: 'normal',
    status: 'pending',
    assignedTo: null,
    assignedToName: null,
    scheduledTime: formatDateTime(addHours(today, 8)),
    startedAt: null,
    completedAt: null,
    notes: 'Anniversary couple',
    checklistItems: [
      { id: 1, task: 'Turn down bed', completed: false },
      { id: 2, task: 'Close curtains', completed: false },
      { id: 3, task: 'Place rose petals', completed: false },
      { id: 4, task: 'Place chocolates', completed: false },
      { id: 5, task: 'Light candles', completed: false }
    ]
  },
  // Inspection task
  {
    id: 'HK-010',
    roomId: 3,
    roomNumber: '305',
    floor: 3,
    type: 'inspection',
    priority: 'normal',
    status: 'pending',
    assignedTo: null,
    assignedToName: null,
    scheduledTime: formatDateTime(addHours(today, 2)),
    startedAt: null,
    completedAt: null,
    notes: 'Pre-arrival inspection for VIP',
    checklistItems: [
      { id: 1, task: 'Check all lights working', completed: false },
      { id: 2, task: 'Check AC/Heating', completed: false },
      { id: 3, task: 'Check TV and remote', completed: false },
      { id: 4, task: 'Check minibar stocked', completed: false },
      { id: 5, task: 'Check safe working', completed: false },
      { id: 6, task: 'Check bathroom fixtures', completed: false },
      { id: 7, task: 'Overall cleanliness check', completed: false }
    ]
  }
]

// Helper functions
export const getPendingTasks = () => {
  return mockHousekeepingTasks.filter(t => t.status === 'pending')
}

export const getInProgressTasks = () => {
  return mockHousekeepingTasks.filter(t => t.status === 'in-progress')
}

export const getTasksByFloor = (floor) => {
  return mockHousekeepingTasks.filter(t => t.floor === floor)
}

export const getTasksByStaff = (staffId) => {
  return mockHousekeepingTasks.filter(t => t.assignedTo === staffId)
}

export const getCompletedTodayTasks = () => {
  const todayStart = new Date(today)
  todayStart.setHours(0, 0, 0, 0)
  return mockHousekeepingTasks.filter(t =>
    t.status === 'completed' &&
    new Date(t.completedAt) >= todayStart
  )
}

// ---------------------------------------------------------------------------
// Team performance history (H10)
// ---------------------------------------------------------------------------
// The live task list only holds "today". To power per-worker metrics (avg time,
// weekly/monthly volume, productivity, quality) we synthesize a deterministic
// body of completed tasks for the last 30 days. A seeded PRNG keeps the numbers
// stable across renders and reloads so rankings don't jump around.

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Per-worker profile: how many tasks they clear a day, how fast, and how well.
// Maria = top performer (fast + high quality), Ana = thorough but slower.
const HK_PROFILES = {
  'STAFF-001': { tasksPerDay: [7, 10], baseMinutes: 26, minutesVar: 8, qualityBase: 4.8, seed: 101 },
  'STAFF-002': { tasksPerDay: [5, 8], baseMinutes: 34, minutesVar: 10, qualityBase: 4.3, seed: 202 },
  'STAFF-003': { tasksPerDay: [4, 7], baseMinutes: 41, minutesVar: 12, qualityBase: 4.6, seed: 303 }
}

const HISTORY_DAYS = 30
const HISTORY_TYPES = ['daily', 'checkout-clean', 'deep-clean', 'turndown', 'inspection']
const HISTORY_ROOMS = ['104', '108', '112', '205', '210', '214', '305', '308', '312', '410', '415', '508', '601', '605']

// Duration offset (minutes) by task type — deep cleans run long, turndowns short.
const TYPE_MINUTES_OFFSET = {
  'daily': 0,
  'checkout-clean': 8,
  'deep-clean': 18,
  'turndown': -8,
  'inspection': -4
}

function buildHousekeepingHistory() {
  const out = []
  let uid = 1

  Object.entries(HK_PROFILES).forEach(([staffId, profile]) => {
    const rand = mulberry32(profile.seed)
    const member = mockStaff.find(s => s.id === staffId)
    const [lo, hi] = profile.tasksPerDay

    // Days 1..30 back — strictly the past, so "today" is owned by the live task list.
    for (let d = 1; d <= HISTORY_DAYS; d++) {
      const day = new Date(today)
      day.setDate(day.getDate() - d)
      const dow = day.getDay()
      const weekendFactor = dow === 0 || dow === 6 ? 0.7 : 1
      const count = Math.max(1, Math.round((lo + rand() * (hi - lo)) * weekendFactor))

      for (let i = 0; i < count; i++) {
        const type = HISTORY_TYPES[Math.floor(rand() * HISTORY_TYPES.length)]
        const minutes = Math.max(
          10,
          Math.round(profile.baseMinutes + TYPE_MINUTES_OFFSET[type] + (rand() - 0.5) * 2 * profile.minutesVar)
        )
        const startHour = 8 + Math.floor(rand() * 9) // 08:00–16:59
        const start = new Date(day)
        start.setHours(startHour, Math.floor(rand() * 60), 0, 0)
        const end = new Date(start.getTime() + minutes * 60000)

        // Quality wobbles around the worker's baseline, snapped to nearest 0.5.
        const rawQuality = profile.qualityBase + (rand() - 0.5) * 0.9
        const qualityRating = Math.max(3, Math.min(5, Math.round(rawQuality * 2) / 2))

        const roomNumber = HISTORY_ROOMS[Math.floor(rand() * HISTORY_ROOMS.length)]

        out.push({
          id: `HKH-${uid++}`,
          staffId,
          staffName: member?.name || staffId,
          type,
          status: 'completed',
          startedAt: start.toISOString(),
          completedAt: end.toISOString(),
          durationMinutes: minutes,
          qualityRating,
          roomNumber,
          floor: parseInt(roomNumber[0], 10)
        })
      }
    }
  })

  return out
}

export const mockHousekeepingHistory = buildHousekeepingHistory()

// --- Metric helpers -------------------------------------------------------

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

// Midnight, `n` days before today.
const startOfDaysAgo = (n) => {
  const d = new Date(today)
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d
}

// Completed-tasks-per-day for the last 7 days (index 0 = 6 days ago … 6 = today).
// History fills the past; live tasks fill today.
export const getWeeklyCompletion = (currentTasks = [], history = mockHousekeepingHistory) => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push({
      date: d,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count: 0
    })
  }

  const bump = (dateStr) => {
    if (!dateStr) return
    const dt = new Date(dateStr)
    const slot = days.find(x => isSameDay(x.date, dt))
    if (slot) slot.count++
  }

  history.forEach(h => bump(h.completedAt))
  currentTasks.filter(t => t.status === 'completed').forEach(t => bump(t.completedAt))
  return days
}

// Aggregate metrics for one worker, blending 30-day history with any tasks the
// admin completes live this session.
export const getStaffMetrics = (staffId, currentTasks = [], history = mockHousekeepingHistory) => {
  const hist = history.filter(h => h.staffId === staffId)
  const liveCompleted = currentTasks.filter(t => t.status === 'completed' && t.assignedTo === staffId)

  const weekStart = startOfDaysAgo(6) // inclusive of today
  const monthStart = startOfDaysAgo(29)
  const inRange = (dateStr, start) => dateStr && new Date(dateStr) >= start

  const histWeek = hist.filter(h => inRange(h.completedAt, weekStart))
  const histMonth = hist.filter(h => inRange(h.completedAt, monthStart))
  const liveToday = liveCompleted.filter(t => t.completedAt && isSameDay(new Date(t.completedAt), today))

  const completedToday = liveToday.length
  const completedWeek = histWeek.length + completedToday
  const completedMonth = histMonth.length + completedToday

  // Average minutes per task: month history durations + any live task with timings.
  const liveDurations = liveCompleted
    .filter(t => t.startedAt && t.completedAt)
    .map(t => (new Date(t.completedAt) - new Date(t.startedAt)) / 60000)
  const durations = [...histMonth.map(h => h.durationMinutes), ...liveDurations].filter(m => m > 0)
  const avgMinutes = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : 0

  const quality = histMonth.length
    ? Math.round((histMonth.reduce((a, h) => a + h.qualityRating, 0) / histMonth.length) * 10) / 10
    : 0

  // Throughput as tasks/hour — the inverse of average handling time.
  const productivity = avgMinutes ? Math.round((60 / avgMinutes) * 10) / 10 : 0

  return {
    staffId,
    completedToday,
    completedWeek,
    completedMonth,
    avgMinutes,
    quality,
    productivity
  }
}
