// Ubicación: /components/shared/search-form.tsx
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Props {
  placeholder?: string
}

export function SearchForm({ placeholder = "Buscar..." }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const filtro = formData.get("filtro") as string
    const params = new URLSearchParams(searchParams)
    
    if (filtro) {
      params.set("filtro", filtro)
    } else {
      params.delete("filtro")
    }
    params.set("page", "1") // Reset to page 1 on new search
    
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        name="filtro"
        defaultValue={searchParams.get("filtro") || ""}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg pl-8 sm:w-[250px] lg:w-[300px]"
      />
    </form>
  )
}