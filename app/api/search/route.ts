import { NextRequest } from 'next/server'
import { 
  withErrorHandling, 
  withRateLimit, 
  getPaginationParams, 
  createApiResponse, 
  createPaginationData,
  sanitizeString 
} from '@/lib/api-utils'
import { productQueries } from '@/lib/database'

interface SearchFilters {
  category?: string
  priceMin?: number
  priceMax?: number
  thcMin?: number
  thcMax?: number
  cbdMin?: number
  cbdMax?: number
  strainType?: 'sativa' | 'indica' | 'hybrid'
  effects?: string[]
  flavors?: string[]
  inStock?: boolean
  rating?: number
  sortBy?: 'price' | 'rating' | 'popularity' | 'newest' | 'name' | 'relevance'
  sortOrder?: 'asc' | 'desc'
}

interface SearchResult {
  products: any[]
  suggestions: string[]
  facets: {
    categories: { name: string; count: number }[]
    strainTypes: { name: string; count: number }[]
    effects: { name: string; count: number }[]
    priceRanges: { range: string; count: number }[]
  }
}

// Fuzzy string matching function
function fuzzyMatch(needle: string, haystack: string, threshold: number = 0.6): boolean {
  const needleLower = needle.toLowerCase()
  const haystackLower = haystack.toLowerCase()
  
  // Exact match
  if (haystackLower.includes(needleLower)) {
    return true
  }
  
  // Levenshtein distance for fuzzy matching
  const distance = levenshteinDistance(needleLower, haystackLower)
  const similarity = 1 - distance / Math.max(needleLower.length, haystackLower.length)
  
  return similarity >= threshold
}

function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null))
  
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j
  
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      )
    }
  }
  
  return matrix[b.length][a.length]
}

// Generate search suggestions
function generateSuggestions(query: string, allProducts: any[]): string[] {
  const suggestions = new Set<string>()
  const queryLower = query.toLowerCase()
  
  allProducts.forEach(product => {
    // Add product name if it partially matches
    if (product.name.toLowerCase().includes(queryLower)) {
      suggestions.add(product.name)
    }
    
    // Add category if it matches
    if (product.category && product.category.toLowerCase().includes(queryLower)) {
      suggestions.add(product.category)
    }
    
    // Add effects if they match
    if (product.effects && Array.isArray(product.effects)) {
      product.effects.forEach((effect: string) => {
        if (effect.toLowerCase().includes(queryLower)) {
          suggestions.add(effect)
        }
      })
    }
    
    // Add strain type if it matches
    if (product.strain_type && product.strain_type.toLowerCase().includes(queryLower)) {
      suggestions.add(product.strain_type)
    }
  })
  
  return Array.from(suggestions).slice(0, 10) // Limit to 10 suggestions
}

export const GET = withRateLimit(60000, 100)(withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const { page, limit, offset } = getPaginationParams(request)
  
  // Get search query and sanitize it
  const query = sanitizeString(searchParams.get('q') || '').trim()
  
  // Parse filters
  const filters: SearchFilters = {
    category: searchParams.get('category') || undefined,
    priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined,
    priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined,
    thcMin: searchParams.get('thcMin') ? parseFloat(searchParams.get('thcMin')!) : undefined,
    thcMax: searchParams.get('thcMax') ? parseFloat(searchParams.get('thcMax')!) : undefined,
    cbdMin: searchParams.get('cbdMin') ? parseFloat(searchParams.get('cbdMin')!) : undefined,
    cbdMax: searchParams.get('cbdMax') ? parseFloat(searchParams.get('cbdMax')!) : undefined,
    strainType: searchParams.get('strainType') as 'sativa' | 'indica' | 'hybrid' || undefined,
    effects: searchParams.getAll('effects').filter(Boolean),
    flavors: searchParams.getAll('flavors').filter(Boolean),
    inStock: searchParams.get('inStock') === 'true',
    rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
    sortBy: searchParams.get('sortBy') as any || 'relevance',
    sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'
  }

  try {
    let products: any[] = []
    let totalCount = 0
    let suggestions: string[] = []
    
    if (query) {
      // Perform text search with fuzzy matching
      const searchResults = await performAdvancedSearch(query, filters, page, limit, offset)
      products = searchResults.products
      totalCount = searchResults.totalCount
      
      // Generate suggestions for partial matches
      if (products.length < 5) {
        const allProducts = await productQueries.findAll({ page: 1, limit: 100, filters: {} })
        suggestions = generateSuggestions(query, allProducts)
      }
    } else {
      // No query - just apply filters
      const filterResults = await productQueries.findAll({
        page,
        limit,
        sortBy: filters.sortBy === 'relevance' ? 'created_at' : filters.sortBy,
        sortOrder: filters.sortOrder,
        filters
      })
      products = filterResults
      totalCount = await productQueries.count(filters)
    }

    // Generate facets for filtering UI
    const facets = await generateFacets(filters)
    
    const pagination = createPaginationData(page, limit, totalCount)
    
    const result: SearchResult = {
      products,
      suggestions,
      facets
    }

    return createApiResponse(result, 200, pagination)
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
}))

async function performAdvancedSearch(
  query: string, 
  filters: SearchFilters, 
  page: number, 
  limit: number, 
  offset: number
) {
  // This would be a more sophisticated search in a real implementation
  // For now, we'll simulate advanced search with the existing product queries
  
  const searchFilters = {
    ...filters,
    search: query
  }
  
  const products = await productQueries.findAll({
    page,
    limit,
    sortBy: filters.sortBy === 'relevance' ? 'created_at' : filters.sortBy,
    sortOrder: filters.sortOrder,
    filters: searchFilters
  })
  
  const totalCount = await productQueries.count(searchFilters)
  
  return { products, totalCount }
}

async function generateFacets(currentFilters: SearchFilters) {
  // Generate facets for the search UI
  // This would query the database to get counts for each facet
  
  // For now, return mock facets
  return {
    categories: [
      { name: 'Flower', count: 45 },
      { name: 'Edibles', count: 32 },
      { name: 'Concentrates', count: 28 },
      { name: 'Vapes', count: 23 },
      { name: 'Topicals', count: 15 }
    ],
    strainTypes: [
      { name: 'Hybrid', count: 67 },
      { name: 'Indica', count: 43 },
      { name: 'Sativa', count: 33 }
    ],
    effects: [
      { name: 'Relaxed', count: 89 },
      { name: 'Happy', count: 76 },
      { name: 'Euphoric', count: 65 },
      { name: 'Creative', count: 54 },
      { name: 'Focused', count: 43 }
    ],
    priceRanges: [
      { range: '$0-$25', count: 34 },
      { range: '$25-$50', count: 56 },
      { range: '$50-$75', count: 32 },
      { range: '$75+', count: 21 }
    ]
  }
}