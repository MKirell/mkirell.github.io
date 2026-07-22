import portfolioData from '@/data/portfolio.json'

const LANDSCAPE_DOCS = new Set(portfolioData.docs.landscape || [])

export function docUrl(filename) {
  return filename
    ? `${import.meta.env.BASE_URL}files/${filename}#view=FitV`
    : null
}

export function imgUrl(filename) {
  return filename ? `${import.meta.env.BASE_URL}imgs/${filename}` : null
}

export function docOrientation(url) {
  if (!url) return 'portrait'
  const filename = decodeURIComponent(url.split('#')[0].split('/').pop())
  return LANDSCAPE_DOCS.has(filename) ? 'landscape' : 'portrait'
}
