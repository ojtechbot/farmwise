import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"
import { Leaf } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/dashboard" className="hidden md:flex items-center gap-2 text-lg font-semibold">
          <Leaf className="h-6 w-6 text-primary" />
          <span>FarmWise</span>
        </Link>
      </div>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* Search can go here if needed in header */}
        </div>
        <UserNav />
      </div>
    </header>
  )
}
