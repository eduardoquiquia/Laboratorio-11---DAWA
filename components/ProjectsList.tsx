"use client"

import { useState } from "react"
import { UsersIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmDelete } from "@/components/ConfirmDelete"
import { getProjectProgress, getProjectStatus, type Project } from "@/lib/data"
import { useDashboard } from "@/lib/store"

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado":
      return "default"
    case "En progreso":
      return "secondary"
    default:
      return "outline"
  }
}

function ProjectDetails({ project, onClose }: { project: Project; onClose: () => void }) {
  const { members, tasks } = useDashboard()
  const projectMembers = members.filter((m) => m.projectId === project.id)
  const projectTasks = tasks.filter((t) => t.projectId === project.id)

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
          <DialogDescription>{project.description || "Sin descripción"}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>
            <span className="text-muted-foreground">Categoría:</span> {project.category}
          </p>
          <p>
            <span className="text-muted-foreground">Prioridad:</span> {project.priority}
          </p>
          <p>
            <span className="text-muted-foreground">Estado:</span>{" "}
            {getProjectStatus(tasks, project.id)}
          </p>
          <p>
            <span className="text-muted-foreground">Progreso:</span>{" "}
            {getProjectProgress(tasks, project.id)}%
          </p>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium">Miembros ({projectMembers.length})</h4>
          {projectMembers.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin miembros asignados.</p>
          )}
          <ul className="space-y-1 text-sm">
            {projectMembers.map((member) => (
              <li key={member.userId} className="flex justify-between gap-2">
                {member.name}
                <span className="text-muted-foreground">{member.position}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium">Tareas ({projectTasks.length})</h4>
          {projectTasks.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin tareas registradas.</p>
          )}
          <ul className="space-y-1 text-sm">
            {projectTasks.map((task) => (
              <li key={task.id} className="flex justify-between gap-2">
                {task.description}
                <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ProjectsList() {
  const { projects, members, tasks, deleteProject } = useDashboard()
  const [detail, setDetail] = useState<Project | null>(null)
  const [toDelete, setToDelete] = useState<Project | null>(null)

  if (projects.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay proyectos registrados.</p>
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const status = getProjectStatus(tasks, project.id)
          const progress = getProjectProgress(tasks, project.id)
          const team = members.filter((m) => m.projectId === project.id).length

          return (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <Badge variant={statusVariant(status)}>{status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersIcon className="size-4" />
                      {team} {team === 1 ? "miembro" : "miembros"}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setDetail(project)}>
                        Ver detalles
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setToDelete(project)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {detail && <ProjectDetails project={detail} onClose={() => setDetail(null)} />}

      {toDelete && (
        <ConfirmDelete
          title="¿Eliminar proyecto?"
          description={`Se eliminará "${toDelete.name}" junto con sus tareas, y sus miembros quedarán sin proyecto.`}
          onConfirm={() => deleteProject(toDelete)}
          onClose={() => setToDelete(null)}
        />
      )}
    </>
  )
}
