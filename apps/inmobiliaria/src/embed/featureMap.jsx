import MortgageCalculator from '../components/MortgageCalculator'
import PropertyValuation from '../components/PropertyValuation'
import NearbyPlaces from '../components/NearbyPlaces'
import AdjustmentSimulator from '../components/admin/contracts/AdjustmentSimulator'
import properties from '../data/properties.json'

// A real listing seeds the standalone NearbyPlaces preview (it derives the score
// and POIs from the property's neighborhood).
const sampleProperty =
  properties.find((p) => p.neighborhood === 'Palermo') || properties[0]

// Registry of marketplace-embeddable features for this demo.
// The `id` is the shared contract with the landing's features.json:
//   - `embed`  → rendered standalone inside an iframe via ?embed=<id> (isolated preview)
//   - `live`   → how the full demo deep-links to the feature via ?feature=<id> ("ver en vivo")
//                { viewMode, scrollTo? }. Omit `live` for features with no clean
//                in-context landing spot (the marketplace just hides "ver en vivo").
export const FEATURE_MAP = {
  'mortgage-calculator': {
    title: 'Calculadora hipotecaria',
    embed: <MortgageCalculator />,
    live: { viewMode: 'main', scrollTo: 'calculator' },
  },
  'property-valuation': {
    title: 'Tasador online',
    embed: <PropertyValuation />,
    live: { viewMode: 'main', scrollTo: 'valuation' },
  },
  'nearby-places': {
    title: 'Qué hay cerca',
    embed: <NearbyPlaces property={sampleProperty} />,
  },
  'adjustment-simulator': {
    title: 'Simulador de ajuste de alquiler',
    embed: <AdjustmentSimulator />,
    live: { viewMode: 'admin' },
  },
}

export const isEmbeddable = (id) => Boolean(FEATURE_MAP[id])
