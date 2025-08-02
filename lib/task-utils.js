import {
  format,
  parseISO,
  isSameDay,
  addDays,
  nextMonday,
  nextTuesday,
  nextWednesday,
  nextThursday,
  nextFriday,
  nextSaturday,
  nextSunday,
} from "date-fns"

const LOCAL_STORAGE_KEY = "todo-calendar-tasks"

export function getTasks() {
  if (typeof window === "undefined") return []
  const tasksJson = localStorage.getItem(LOCAL_STORAGE_KEY)
  return tasksJson ? JSON.parse(tasksJson) : []
}

export function saveTasks(tasks) {
  if (typeof window === "undefined") return
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks))
}

export function addTask(text, date) {
  const tasks = getTasks()
  const newTask = {
    id: crypto.randomUUID(),
    text,
    date: format(date, "yyyy-MM-dd"), // Store as YYYY-MM-DD string
    completed: false,
  }
  saveTasks([...tasks, newTask])
  return newTask
}

export function updateTask(updatedTask) {
  const tasks = getTasks()
  const newTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
  saveTasks(newTasks)
}

export function deleteTask(id) {
  const tasks = getTasks()
  const newTasks = tasks.filter((task) => task.id !== id)
  saveTasks(newTasks)
}

export function getTasksForDate(date) {
  const tasks = getTasks()
  return tasks.filter((task) => isSameDay(parseISO(task.date), date))
}

export function getCompletedTasks() {
  const tasks = getTasks()
  return tasks.filter((task) => task.completed)
}

// Helper to parse natural language date strings (no longer used by AI, but kept for potential future client-side parsing)
export function parseDateString(dateString) {
  const today = new Date()
  const lowerCaseDate = dateString.toLowerCase()

  if (lowerCaseDate === "today") {
    return today
  } else if (lowerCaseDate === "tomorrow") {
    return addDays(today, 1)
  } else if (lowerCaseDate === "next monday") {
    return nextMonday(today)
  } else if (lowerCaseDate === "next tuesday") {
    return nextTuesday(today)
  } else if (lowerCaseDate === "next wednesday") {
    return nextWednesday(today)
  } else if (lowerCaseDate === "next thursday") {
    return nextThursday(today)
  } else if (lowerCaseDate === "next friday") {
    return nextFriday(today)
  } else if (lowerCaseDate === "next saturday") {
    return nextSaturday(today)
  } else if (lowerCaseDate === "next sunday") {
    return nextSunday(today)
  } else {
    // Attempt to parse using date-fns parseISO or a more flexible parser if needed
    try {
      const parsed = new Date(dateString)
      // Check if parsed date is valid and not just current date due to invalid string
      if (!isNaN(parsed.getTime())) {
        return parsed
      }
    } catch (e) {
      // Fallback or error handling
    }
  }
  return null // Return null if date cannot be parsed
}
