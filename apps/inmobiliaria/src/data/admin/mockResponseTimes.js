// Response-time-per-agent (the metric that sells): how fast each agent replies to a
// new lead. Portals penalize slow replies; the AI covers nights/weekends.
// Ported from the v2 demo. Minutes.

export const responseTimes = {
  teamAvg: 6,      // minutes, current
  teamPrev: 34,    // minutes, before AI + unified inbox
  slaTarget: 10,   // minutes
  agents: [
    { id: 'AG-001', name: 'Sofía Vera', avgMin: 4, leads: 38, converted: 11 },
    { id: 'AG-002', name: 'Martín Ávila', avgMin: 7, leads: 31, converted: 8 },
    { id: 'AG-003', name: 'Lucía Rossi', avgMin: 12, leads: 24, converted: 4 },
    { id: 'AG-004', name: 'Diego Paz', avgMin: 21, leads: 19, converted: 2 }
  ],
  // Share of leads answered by the AI outside business hours
  aiAfterHoursShare: 63
}

// Traffic light by SLA: green under target, amber up to 2x, red beyond.
export function lightFor(avgMin, target = 10) {
  if (avgMin <= target) return 'green'
  if (avgMin <= target * 2) return 'amber'
  return 'red'
}
