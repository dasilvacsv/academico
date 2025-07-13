// Ubicación: /components/shared/data-table-pagination.tsx
"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  currentPage: number
  totalPages: number
}

export function DataTablePagination({ currentPage, totalPages }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <CardFooter className="flex items-center justify-between border-t px-6 py-4">
      <div className="text-xs text-muted-foreground">
        Página {currentPage} de {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
        >
          <Link href={createPageURL(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-2">Anterior</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
        >
          <Link href={createPageURL(currentPage + 1)}>
            <span className="sr-only sm:not-sr-only sm:mr-2">Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </CardFooter>
  )
}