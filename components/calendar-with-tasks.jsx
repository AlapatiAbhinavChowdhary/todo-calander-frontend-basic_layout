"use client"

import * as React from "react"
import { format, isSameDay, parseISO, startOfWeek, endOfWeek } from "date-fns"
import { CalendarIcon, Plus, Trash2, Edit, CheckCircle2, Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getTasks, addTask, updateTask, deleteTask, getTasksForDate, parseDateString } from "@/lib/task-utils"
import { VoiceInput } from "@/components/voice-input" // Re-import the VoiceInput component
import { useToast } from "@/hooks/use-toast"

export function CalendarWithTasks() {
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [tasks, setTasks] = React.useState([])
  const [newTaskText, setNewTaskText] = React.useState("")
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = React.useState(false)
  const [editingTask, setEditingTask] = React.useState(null)
  const { toast } = useToast()

  React.useEffect(() => {
    // Load all tasks initially
    setTasks(getTasks())
  }, [])

  const refreshTasksForSelectedDate = React.useCallback(() => {
    if (selectedDate) {
      setTasks(getTasksForDate(selectedDate))
    } else {
      setTasks([])
    }
  }, [selectedDate])

  React.useEffect(() => {
    refreshTasksForSelectedDate()
  }, [selectedDate, refreshTasksForSelectedDate])

  const handleAddTask = () => {
    if (newTaskText.trim() && selectedDate) {
      addTask(newTaskText.trim(), selectedDate)
      setNewTaskText("")
      setIsAddTaskDialogOpen(false)
      refreshTasksForSelectedDate() // Refresh tasks after adding
      toast({
        title: "Task Added!",
        description: `"${newTaskText}" added to ${format(selectedDate, "PPP")}.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Please enter a task and select a date.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTask = () => {
    if (editingTask) {
      updateTask(editingTask)
      setEditingTask(null)
      refreshTasksForSelectedDate() // Refresh tasks after updating
      toast({
        title: "Task Updated!",
        description: `Task "${editingTask.text}" updated.`,
      })
    }
  }

  const handleDeleteTask = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id)
    deleteTask(id)
    refreshTasksForSelectedDate() // Refresh tasks after deleting
    toast({
      title: "Task Deleted!",
      description: `Task "${taskToDelete?.text || "Unknown Task"}" deleted.`,
    })
  }

  const handleToggleComplete = (task) => {
    const updatedTask = { ...task, completed: !task.completed }
    updateTask(updatedTask)
    refreshTasksForSelectedDate() // Refresh tasks after toggling
    toast({
      title: "Task Status Updated!",
      description: `Task "${task.text}" marked as ${updatedTask.completed ? "completed" : "incomplete"}.`,
    })
  }

  const tasksForSelectedDate = React.useMemo(() => {
    if (!selectedDate) return []
    return tasks.filter((task) => isSameDay(parseISO(task.date), selectedDate))
  }, [tasks, selectedDate])

  // Re-added function to handle commands from VoiceInput
  const handleVoiceCommand = (command) => {
    console.log("Received voice command:", command)
    const { action, task, date, query } = command

    let targetDate = selectedDate
    if (date) {
      const parsedDate = parseDateString(date)
      if (parsedDate) {
        targetDate = parsedDate
      } else {
        toast({
          title: "Could not understand date",
          description: `I couldn't parse the date "${date}". Please try again.`,
          variant: "destructive",
        })
        return
      }
    }

    switch (action) {
      case "add_task":
        if (task && targetDate) {
          addTask(task, targetDate)
          setSelectedDate(targetDate) // Switch to the date the task was added to
          refreshTasksForSelectedDate()
          toast({
            title: "Task Added by Voice!",
            description: `"${task}" added to ${format(targetDate, "PPP")}.`,
          })
        } else {
          toast({
            title: "Missing Information",
            description: "Please specify a task and a date to add.",
            variant: "destructive",
          })
        }
        break
      case "show_tasks":
        if (targetDate) {
          setSelectedDate(targetDate) // Switch to the date to show tasks for
          toast({
            title: "Showing Tasks",
            description: `Displaying tasks for ${format(targetDate, "PPP")}.`,
          })
        } else if (query && query.toLowerCase().includes("this week")) {
          const start = startOfWeek(new Date())
          const end = endOfWeek(new Date())
          const weeklyTasks = getTasks().filter((t) => {
            const taskDate = parseISO(t.date)
            return taskDate >= start && taskDate <= end
          })
          toast({
            title: "This Week's Schedule",
            description: `You have ${weeklyTasks.length} tasks this week.`,
          })
        } else {
          toast({
            title: "Could not understand query",
            description: "Please specify a date or a clear query like 'this week'.",
            variant: "destructive",
          })
        }
        break
      case "delete_task":
        if (task) {
          const tasksToDelete = getTasks().filter((t) => t.text.toLowerCase().includes(task.toLowerCase()))
          if (tasksToDelete.length > 0) {
            tasksToDelete.forEach((t) => deleteTask(t.id))
            refreshTasksForSelectedDate()
            toast({
              title: "Task(s) Deleted by Voice!",
              description: `Deleted task(s) matching "${task}".`,
            })
          } else {
            toast({
              title: "Task Not Found",
              description: `No task found matching "${task}".`,
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Missing Information",
            description: "Please specify which task to delete.",
            variant: "destructive",
          })
        }
        break
      case "complete_task":
        if (task) {
          const tasksToComplete = getTasks().filter(
            (t) => t.text.toLowerCase().includes(task.toLowerCase()) && !t.completed,
          )
          if (tasksToComplete.length > 0) {
            tasksToComplete.forEach((t) => updateTask({ ...t, completed: true }))
            refreshTasksForSelectedDate()
            toast({
              title: "Task(s) Completed by Voice!",
              description: `Marked task(s) matching "${task}" as complete.`,
            })
          } else {
            toast({
              title: "Task Not Found or Already Completed",
              description: `No incomplete task found matching "${task}".`,
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Missing Information",
            description: "Please specify which task to complete.",
            variant: "destructive",
          })
        }
        break
      case "unknown":
      default:
        toast({
          title: "Command Not Understood",
          description: "I couldn't understand your command. Please try again.",
          variant: "destructive",
        })
        break
    }
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-6xl shadow-lg">
        <CardContent className="p-0 flex flex-col md:flex-row">
          {/* Calendar Section */}
          <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r">
            <CardTitle className="mb-4 text-2xl font-bold">Select a Date</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mb-4",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground mt-2">Click on a date to view and manage tasks for that day.</p>
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
                  <p className="text-center text-sm">Click "Add New Task" or use voice command to get started!</p>
                </div>
              ) : (
                tasksForSelectedDate.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-card text-card-foreground transition-all hover:shadow-md"
                  >
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleComplete(task)}
                        className="rounded-full"
                        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                      <label
                        htmlFor={`task-${task.id}`}
                        className={cn(
                          "text-base font-medium leading-none",
                          task.completed && "line-through text-muted-foreground",
                        )}
                      >
                        {task.text}
                      </label>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingTask(task)}
                            aria-label="Edit task"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Task</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTask(task.id)}
                            aria-label="Delete task"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Task</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => setIsAddTaskDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add New Task
              </Button>
              <VoiceInput onCommand={handleVoiceCommand} /> {/* Re-add the VoiceInput component */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskText" className="text-right">
                Task
              </Label>
              <Input
                id="taskText"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Submit assignment"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskDate" className="text-right">
                Date
              </Label>
              <Input
                id="taskDate"
                value={selectedDate ? format(selectedDate, "PPP") : ""}
                readOnly
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editTaskText" className="text-right">
                Task
              </Label>
              <Input
                id="editTaskText"
                value={editingTask?.text || ""}
                onChange={(e) => setEditingTask((prev) => (prev ? { ...prev, text: e.target.value } : null))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editTaskDate" className="text-right">
                Date
              </Label>
              <Input
                id="editTaskDate"
                value={editingTask ? format(parseISO(editingTask.date), "PPP") : ""}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editTaskCompleted" className="text-right">
                Completed
              </Label>
              <Checkbox
                id="editTaskCompleted"
                checked={editingTask?.completed || false}
                onCheckedChange={(checked) =>
                  setEditingTask((prev) => (prev ? { ...prev, completed: !!checked } : null))
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
