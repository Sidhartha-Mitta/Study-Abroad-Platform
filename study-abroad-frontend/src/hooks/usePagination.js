import { useMemo, useState } from 'react'

export function usePagination(totalItems, itemsPerPage = 9) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const goToPage = (page) => setCurrentPage(Math.min(totalPages, Math.max(1, page)))
  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages])
  return {
    currentPage,
    totalPages,
    pageNumbers,
    goToPage,
    nextPage: () => goToPage(currentPage + 1),
    prevPage: () => goToPage(currentPage - 1),
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  }
}
