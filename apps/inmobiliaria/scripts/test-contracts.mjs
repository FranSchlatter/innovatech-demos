import { contracts, deriveContract, TODAY, fmtDate } from '../src/data/admin/mockContracts.js'

let ok = 0, fail = 0
const check = (name, cond, extra = '') => { if (cond) { ok++ } else { fail++; console.log('  ✗', name, extra) } }

console.log(`TODAY = ${TODAY}\n`)
const expected = {
  'CT-1041': 'active', 'CT-1058': 'active', 'CT-1063': 'active',
  'CT-1070': 'expiring', 'CT-1072': 'expired', 'CT-1075': 'terminated',
  'CT-1078': 'active', 'CT-1080': 'expiring'
}

for (const c of contracts) {
  const d = deriveContract(c)
  const exp = expected[c.id]
  console.log(`${c.id}  ${d.status.label.padEnd(11)} | end ${fmtDate(d.endDate)} (${d.daysToEnd}d) | actual ${d.currentRent.toLocaleString('es-AR')} | adj ${d.adjustments.filter(a => a.applied).length}/${d.adjustments.length} aplicados | prox ${d.nextAdjustment ? d.nextAdjustment.days + 'd' : '-'}`)
  check(`${c.id} status=${exp}`, d.statusId === exp, `got ${d.statusId}`)
  check(`${c.id} currentRent>0`, d.currentRent > 0)
  check(`${c.id} currentRent>=base`, d.currentRent >= c.baseRent)
  const monotonic = d.adjustments.every((a, i, arr) => i === 0 || a.newRent >= arr[i - 1].newRent)
  check(`${c.id} adjustments monotonic`, monotonic)
  check(`${c.id} clauses>=6`, d.clauses.length >= 6)
  check(`${c.id} docs=5`, d.documents.length === 5)
  if (d.statusId === 'terminated' || d.statusId === 'expired') check(`${c.id} no nextAdj`, d.nextAdjustment === null)
}

const derived = contracts.map((c) => deriveContract(c))
const alive = derived.filter((c) => c.statusId === 'active' || c.statusId === 'expiring')
const monthly = alive.reduce((s, c) => s + c.currentRent, 0)
console.log(`\nCartera activa: ${alive.length} contratos · renta mensual $${monthly.toLocaleString('es-AR')}`)
check('renta mensual > 0', monthly > 0)
check('hay 2 contratos por vencer', derived.filter((c) => c.statusId === 'expiring').length === 2)

console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'}: ${ok} ok, ${fail} fail`)
process.exit(fail === 0 ? 0 : 1)
