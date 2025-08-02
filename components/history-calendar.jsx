"use client"

import * as React from "react"
import { format, isSameDay, parseISO } from "date-fns"
import { CheckCircle2, Circle } from "lucide-react" // Import Circle for incomplete tasks
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { getTasks } from "@/lib/task-utils" // Change to get all tasks
import { cn } from "@/lib/utils" // Import cn for conditional class names

export function HistoryCalendar() {
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [allTasks, setAllTasks] = React.useState([]) // State to hold all tasks

  React.useEffect(() => {
    setAllTasks(getTasks()) // Fetch all tasks
  }, [])

  const tasksForSelectedDate = React.useMemo(() => {
    if (!selectedDate) return []
    return allTasks.filter((task) => isSameDay(parseISO(task.date), selectedDate))
  }, [allTasks, selectedDate])

  // Get all unique dates that have any tasks
  const datesWithTasks = React.useMemo(() => {
    const dates = new Set()
    allTasks.forEach((task) => {
      dates.add(parseISO(task.date).toISOString().split("T")[0]) // Store YYYY-MM-DD string
    })
    return Array.from(dates).map((dateStr) => parseISO(dateStr))
  }, [allTasks])

  const modifiers = {
    hasTasks: datesWithTasks, // Modifier for days with any tasks
  }

  const modifiersClassNames = {
    hasTasks: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold rounded-md", // Highlight days with tasks
  }

  return (
    <Card className="w-full max-w-6xl shadow-lg">
      <CardContent className="p-0 flex flex-col md:flex-row">
        {/* Calendar Section */}
        <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r">
          <CardTitle className="mb-4 text-2xl font-bold">Task History Overview</CardTitle>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            initialFocus
            className="rounded-md border"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Dates highlighted in blue have tasks. Click on a date to view them.
          </p>
        </div>

        {/* Tasks Section */}
        <div className="w-full md:w-1/2 p-6">
          <CardTitle className="mb-4 text-2xl font-bold">
            Tasks for {selectedDate ? format(selectedDate, "PPP") : "No Date Selected"}
          </CardTitle>
          <div className="space-y-3 mb-6 min-h-[150px]">
            {tasksForSelectedDate.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                <p className="text-center">No tasks scheduled for this date.</p>
              </div>
            ) : (
              tasksForSelectedDate.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-card text-card-foreground"
                >
                  <div className="flex items-center space-x-3">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span
                      className={cn(
                        "text-base font-medium leading-none",
                        task.completed && "line-through text-muted-foreground",
                      )}
                    >
                      {task.text}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
