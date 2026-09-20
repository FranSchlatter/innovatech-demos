// Central registry of all translations.
// Each namespace lives in its own file (es/*.js + en/*.js) so the dictionaries
// stay small, reviewable and mergeable without conflicts. Add a namespace here
// once and it's available as t('<namespace>.<key>') everywhere.

import esCommon from './es/common'
import esNav from './es/nav'
import esLanding from './es/landing'
import esLandingExtra from './es/landingExtra'
import esPortal from './es/portal'
import esClient from './es/client'
import esStation from './es/station'
import esAdminA from './es/adminA'
import esAdminB from './es/adminB'
import esAdminC from './es/adminC'
import esAdminD from './es/adminD'

import enCommon from './en/common'
import enNav from './en/nav'
import enLanding from './en/landing'
import enLandingExtra from './en/landingExtra'
import enPortal from './en/portal'
import enClient from './en/client'
import enStation from './en/station'
import enAdminA from './en/adminA'
import enAdminB from './en/adminB'
import enAdminC from './en/adminC'
import enAdminD from './en/adminD'

export const LANGUAGES = [
  { code: 'es', label: 'ES', name: 'Español', flag: '🇦🇷' },
  { code: 'en', label: 'EN', name: 'English', flag: '🇬🇧' },
]

// Spanish first: the demo targets an Argentine audience, so the hotel opens in
// Spanish and the guest can flip to English from the navbar.
export const DEFAULT_LANGUAGE = 'es'

// `landing` and `admin` are split across several files (one per parallel work
// area) and merged here by disjoint top-level keys.
export const translations = {
  es: {
    common: esCommon,
    nav: esNav,
    landing: { ...esLanding, ...esLandingExtra },
    portal: esPortal,
    client: esClient,
    station: esStation,
    admin: { ...esAdminA, ...esAdminB, ...esAdminC, ...esAdminD },
  },
  en: {
    common: enCommon,
    nav: enNav,
    landing: { ...enLanding, ...enLandingExtra },
    portal: enPortal,
    client: enClient,
    station: enStation,
    admin: { ...enAdminA, ...enAdminB, ...enAdminC, ...enAdminD },
  },
}
