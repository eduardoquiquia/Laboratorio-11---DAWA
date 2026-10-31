"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import {
  nextId,
  seedActivity,
  seedMembers,
  seedProjects,
  seedSettings,
  seedTasks,
  type Activity,
  type Member,
  type Project,
  type Settings,
  type Task,
} from "@/lib/data"

// Simula la latencia de una petición al backend
const fakeRequest = () => new Promise((resolve) => setTimeout(resolve, 800))

function useDashboardState() {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState(seedProjects)
  const [members, setMembers] = useState(seedMembers)
  const [tasks, setTasks] = useState(seedTasks)
  const [settings, setSettings] = useState(seedSettings)
  const [activity, setActivity] = useState(seedActivity)
  const activityId = useRef(seedActivity.length)

  // Carga inicial simulada
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode)
  }, [settings.darkMode])

  const log = (action: string, target: string) => {
    const entry: Activity = {
      id: ++activityId.current,
      user: settings.adminName,
      action,
      target,
      time: new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
    }
    setActivity((prev) => [entry, ...prev].slice(0, 5))
  }

  const createProject = async (data: Omit<Project, "id">, memberIds: string[]) => {
    await fakeRequest()
    const id = nextId("P", projects.map((p) => p.id))
    setProjects((prev) => [...prev, { ...data, id }])
    // Un miembro pertenece a un solo proyecto (Member.projectId)
    setMembers((prev) =>
      prev.map((m) => (memberIds.includes(m.userId) ? { ...m, projectId: id } : m))
    )
    log("creó el proyecto", data.name)
  }

  const deleteProject = async (project: Project) => {
    await fakeRequest()
    setProjects((prev) => prev.filter((p) => p.id !== project.id))
    setTasks((prev) => prev.filter((t) => t.projectId !== project.id))
    setMembers((prev) =>
      prev.map((m) => (m.projectId === project.id ? { ...m, projectId: "" } : m))
    )
    log("eliminó el proyecto", project.name)
  }

  // Sin userId crea un miembro nuevo; con userId actualiza el existente
  const saveMember = async (member: Member) => {
    await fakeRequest()
    if (member.userId) {
      setMembers((prev) => prev.map((m) => (m.userId === member.userId ? member : m)))
      log("actualizó a", member.name)
    } else {
      const userId = nextId("U", members.map((m) => m.userId))
      setMembers((prev) => [...prev, { ...member, userId }])
      log("agregó a", member.name)
    }
  }

  const deleteMember = async (member: Member) => {
    await fakeRequest()
    setMembers((prev) => prev.filter((m) => m.userId !== member.userId))
    setTasks((prev) =>
      prev.map((t) => (t.userId === member.userId ? { ...t, userId: "" } : t))
    )
    log("eliminó a", member.name)
  }

  // Sin id crea una tarea nueva; con id actualiza la existente
  const saveTask = async (task: Task) => {
    await fakeRequest()
    if (task.id) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
      log("actualizó la tarea", task.description)
    } else {
      const id = nextId("T", tasks.map((t) => t.id))
      setTasks((prev) => [...prev, { ...task, id }])
      log("creó la tarea", task.description)
    }
  }

  const deleteTask = async (task: Task) => {
    await fakeRequest()
    setTasks((prev) => prev.filter((t) => t.id !== task.id))
    log("eliminó la tarea", task.description)
  }

  const saveSettings = async (data: Settings) => {
    await fakeRequest()
    setSettings(data)
  }

  return {
    loading,
    projects,
    members,
    tasks,
    settings,
    activity,
    createProject,
    deleteProject,
    saveMember,
    deleteMember,
    saveTask,
    deleteTask,
    saveSettings,
  }
}

const DashboardContext = createContext<ReturnType<typeof useDashboardState> | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const state = useDashboardState()
  return <DashboardContext.Provider value={state}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) throw new Error("useDashboard debe usarse dentro de DashboardProvider")
  return context
}
