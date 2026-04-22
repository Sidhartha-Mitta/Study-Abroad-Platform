import { format, formatDistanceToNow } from 'date-fns'
import { STATUS_COLORS } from './constants'

export const formatCurrency = (amount, currency = 'USD') => `${new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(amount || 0))} / year`
export const formatDate = (dateString) => (dateString ? format(new Date(dateString), 'MMM d, yyyy') : 'Not available')
export const formatRelativeDate = (dateString) => (dateString ? `${formatDistanceToNow(new Date(dateString))} ago` : 'Recently')
export const getCountryFlag = (countryName = '') => ({
  USA: '🇺🇸', UK: '🇬🇧', Canada: '🇨🇦', Australia: '🇦🇺', Germany: '🇩🇪', Netherlands: '🇳🇱', France: '🇫🇷',
  'New Zealand': '🇳🇿', Ireland: '🇮🇪', Singapore: '🇸🇬',
}[countryName] || '🌍')
export const getStatusColor = (status) => STATUS_COLORS[status] || 'neutral'
export const truncateText = (text = '', maxLength = 100) => (text.length > maxLength ? `${text.slice(0, maxLength)}...` : text)

export const asArray = (payload) => payload?.data || payload?.items || payload?.universities || payload?.programs || payload?.applications || payload?.recommendations || (Array.isArray(payload) ? payload : [])
export const getName = (obj, fallback = 'Untitled') => obj?.name || obj?.universityName || obj?.programName || obj?.title || fallback
