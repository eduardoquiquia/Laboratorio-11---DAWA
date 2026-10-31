"use client"

import { CircleCheckIcon, ClockIcon, FolderIcon, UsersIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getProjectStatus } from "@/lib/data"
import { useDashboard } from "@/lib/store"

export function Overview() {
  const { projects, members, tasks, activity } = useDashboard()

  const completed = tasks.filter((t) => t.status === "Completado").length
  const pending = tasks.filter((t) => t.status === "Pendiente").length
  const inProgress = tasks.length - completed - pending
  const active = members.filter((m) => m.isActive).length
  const finishedProjects = projects.filter(
    (p) => getProjectStatus(tasks, p.id) === "Completado"
  ).length
  const completedRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  const stats = [
    { title: "Total Proyectos", value: projects.length, note: `Completados: ${finishedProjects}`, Icon: FolderIcon },
    { title: "Tareas Completadas", value: completed, note: `${completedRate}% de ${tasks.length} tareas`, Icon: CircleCheckIcon },
    { title: "Tareas Pendientes", value: pending, note: `${inProgress} en progreso`, Icon: ClockIcon },
    { title: "Miembros Activos", value: active, note: `de ${members.length} miembros`, Icon: UsersIcon },
  ]

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ title, value, note, Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas actualizaciones de tus proyectos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{item.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">{item.user}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.action} <span className="font-medium">{item.target}</span>
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">{item.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
