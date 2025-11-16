import { themeConfig } from '@/config'

const FALLBACK_SITE = 'http://localhost/'

const siteUrl = (() => {
  try {
    return new URL(themeConfig.site.website || FALLBACK_SITE)
  } catch {
    return new URL(FALLBACK_SITE)
  }
})()

const normalizedBasePath = siteUrl.pathname.replace(/\/$/, '')

const isExternal = (value: string) => /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(value)
const isSpecialProtocol = (value: string) => /^(?:mailto:|tel:|data:)/i.test(value)
const ensureLeadingSlash = (value: string) => (value.startsWith('/') ? value : `/${value}`)

export const getBasePath = () => {
  if (import.meta.env.DEV) {
    return ''
  }
  return normalizedBasePath
}

export const withBasePath = (value = '/') => {
  if (!value) {
    return getBasePath() || '/'
  }

  if (isExternal(value) || isSpecialProtocol(value) || value.startsWith('#')) {
    return value
  }

  const path = ensureLeadingSlash(value)
  const base = getBasePath()
  return base ? `${base}${path}` : path
}

export const toAbsoluteUrl = (value = '/') => {
  if (!value || isExternal(value) || isSpecialProtocol(value)) {
    return value
  }

  const trimmed = value.startsWith('/') ? value.slice(1) : value
  return new URL(trimmed || '.', siteUrl).toString()
}
