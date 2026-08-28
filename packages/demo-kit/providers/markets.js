/* Market profiles — Fase 5. A new market = a config entry here + a translation file.
   Components must read these, never hardcode currency/portals/indices/fiscal fields. */

export const MARKETS = {
  AR: {
    code: 'AR',
    name: 'Argentina',
    locale: 'es-AR',
    lang: 'es',
    currencies: ['ARS', 'USD'],
    defaultCurrency: 'ARS',
    fx: { ARS: 1, USD: 1320 }, // 1 USD = 1320 ARS (demo)
    channels: ['whatsapp', 'instagram', 'web', 'booking'],
    portals: ['ZonaProp', 'ArgenProp', 'MercadoLibre', 'Instagram'],
    adjustmentIndices: ['IPC', 'ICL', 'UVA', 'Fijo'],
    fiscalFields: ['CUIT', 'IVA'],
    phoneCode: '+54'
  },
  UY: {
    code: 'UY',
    name: 'Uruguay',
    locale: 'es-UY',
    lang: 'es',
    currencies: ['UYU', 'USD'],
    defaultCurrency: 'USD',
    fx: { UYU: 40, USD: 1 },
    channels: ['whatsapp', 'instagram', 'web', 'booking'],
    portals: ['InfoCasas', 'Gallito', 'MercadoLibre', 'Instagram'],
    adjustmentIndices: ['UR', 'IPC', 'Fijo'],
    fiscalFields: ['RUT', 'IVA'],
    phoneCode: '+598'
  },
  ES: {
    code: 'ES',
    name: 'España',
    locale: 'es-ES',
    lang: 'es',
    currencies: ['EUR'],
    defaultCurrency: 'EUR',
    fx: { EUR: 1 },
    channels: ['whatsapp', 'instagram', 'web', 'booking'],
    portals: ['Idealista', 'Fotocasa', 'Habitaclia'],
    adjustmentIndices: ['IPC', 'IRAV', 'Fijo'],
    fiscalFields: ['NIF', 'IVA'],
    // check-in verification is legally required (SES) — flag drives H6 copy
    guestRegistrationRequired: true,
    phoneCode: '+34'
  }
}

export const DEFAULT_MARKET = 'AR'
export const marketList = () => Object.values(MARKETS)
