import Link from "next/link"
import { HistoryCalendar } from "@/components/history-calendar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to To-Do List</span>
            </Link>
          </Button>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Task History</h1>
        </div>
        <ThemeToggle />
      </div>
      <HistoryCalendar />
    </div>
  )
}
