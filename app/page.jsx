import Link from "next/link"
import { CalendarWithTasks } from "@/components/calendar-with-tasks"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { History } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">My To-Do Calendar</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/history">
              <History className="h-4 w-4" />
              <span className="sr-only">View History</span>
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
      <CalendarWithTasks />
    </div>
  )
}
