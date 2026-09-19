// Logic test for the H22 service-request → Inbox handoff helpers.
// Run: node apps/hoteleria/scripts/test-service-threads.mjs
import {
  serviceConvId,
  serviceReplyTemplate,
  buildServiceConversation,
  firstNameOf,
  SERVICE_TYPE_LABELS
} from '../src/data/admin/serviceThreads.js'
import { mockConversations } from '../src/data/admin/mockConversations.js'
import { mockServiceRequests } from '../src/data/admin/mockServiceRequests.js'

let passed = 0
let failed = 0
function check(name, cond) {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.error(`  ✗ ${name}`)
  }
}

// Simulate the find-or-create resolution done inside InboxManagement's effect.
function resolve(target, serviceThreads) {
  const existing = mockConversations.find(
    (c) => c.guest.toLowerCase() === (target.guestName || '').toLowerCase()
  )
  if (existing) return { id: existing.id, threads: serviceThreads, created: false }
  const id = serviceConvId(target)
  if (serviceThreads.some((c) => c.id === id)) {
    return { id, threads: serviceThreads, created: false }
  }
  const conv = buildServiceConversation(target, 1_700_000_000_000)
  return { id, threads: [conv, ...serviceThreads], created: true }
}

const sr = mockServiceRequests[0] // Sarah Johnson, room 508, room-service
const target = {
  requestId: sr.id,
  guestName: sr.guestName,
  roomNumber: sr.roomNumber,
  type: sr.type,
  description: sr.description
}

console.log('\nH22 service-thread helpers')

// 1. Stable id: same guest+room → same id regardless of nonce/other fields.
check('serviceConvId is stable & slugified',
  serviceConvId(target) === 'svc-508-sarah-johnson'.replace('svc', 'SVC'))
check('serviceConvId ignores volatile fields',
  serviceConvId({ ...target, requestId: 'X', description: 'other' }) === serviceConvId(target))

// 2. Different room or guest → different id.
check('different room → different id',
  serviceConvId({ ...target, roomNumber: '999' }) !== serviceConvId(target))
check('different guest → different id',
  serviceConvId({ ...target, guestName: 'Other Person' }) !== serviceConvId(target))

// 3. Find-or-create: first call creates, second reuses (no duplicate).
let threads = []
const r1 = resolve(target, threads)
check('first resolve creates a thread', r1.created === true && r1.threads.length === 1)
const r2 = resolve(target, r1.threads)
check('second resolve reuses (no duplicate)', r2.created === false && r2.threads.length === 1)
check('reused id matches created id', r1.id === r2.id)

// 4. Existing conversation match (by guest name) short-circuits creation.
const existingGuest = mockConversations[0].guest // 'Carolina Núñez'
const rExisting = resolve({ ...target, guestName: existingGuest }, [])
check('existing guest reuses mock conversation',
  rExisting.created === false && rExisting.id === mockConversations[0].id)

// 5. Seeded conversation shape.
const conv = buildServiceConversation(target, 1_700_000_000_000)
check('conversation channel is service', conv.channel === 'service')
check('seed message is from guest with the description',
  conv.messages.length === 1 &&
  conv.messages[0].from === 'guest' &&
  conv.messages[0].text === sr.description)
check('seed message carries request id in meta',
  conv.messages[0].meta.includes(sr.id))
check('context reservation shows the room', conv.context.reservation === 'Habitación 508')

// 6. Template: greeting + type label, ends open for the agent to continue.
const tpl = serviceReplyTemplate(target)
check('template greets by first name', tpl.startsWith('Hola Sarah,'))
check('template mentions the service type', tpl.includes(SERVICE_TYPE_LABELS['room-service']))
check('template ends with a trailing space (open)', tpl.endsWith(', '))

// 7. firstNameOf edge cases.
check('firstNameOf handles empty', firstNameOf('') === 'huésped')
check('firstNameOf handles single name', firstNameOf('Madonna') === 'Madonna')

// 8. Every mock service request produces a valid, non-colliding id.
const ids = new Set(mockServiceRequests.map((s) =>
  serviceConvId({ guestName: s.guestName, roomNumber: s.roomNumber })))
// Same guest+room repeats across requests, so ids collapse — that's intended.
check('all requests yield well-formed ids',
  [...ids].every((id) => /^SVC-[a-z0-9-]+$/.test(id)))

console.log(`\n${passed} passed, ${failed} failed\n`)
process.exit(failed ? 1 : 0)
