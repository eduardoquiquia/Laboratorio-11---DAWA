"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { PlusIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ConfirmDelete } from "@/components/ConfirmDelete"
import { TaskForm } from "@/components/TaskForm"
import type { Task } from "@/lib/data"
import { useDashboard } from "@/lib/store"

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado":
      return "default"
    case "En progreso":
      return "secondary"
    case "Pendiente":
      return "outline"
    default:
      return "outline"
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgente":
      return "destructive"
    case "Alta":
      return "default"
    case "Media":
      return "secondary"
    case "Baja":
      return "outline"
    default:
      return "outline"
  }
}

export function TasksTable() {
  const { tasks, projects, members, settings, deleteTask } = useDashboard()
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [toDelete, setToDelete] = useState<Task | null>(null)

  const pageSize = Number(settings.pageSize)
  const totalPages = Math.max(1, Math.ceil(tasks.length / pageSize))
  // Al eliminar la última fila de una página, se muestra la página anterior
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const pageTasks = tasks.slice(start, start + pageSize)

  const openForm = (task: Task | null) => {
    setEditing(task)
    setFormOpen(true)
  }

  const goTo = (e: React.MouseEvent, target: number) => {
    e.preventDefault()
    setPage(Math.min(Math.max(target, 1), totalPages))
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => openForm(null)}>
        <PlusIcon />
        Nueva tarea
      </Button>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {tasks.length} tareas en total - página {currentPage} de {totalPages}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tarea</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.description}</TableCell>
                <TableCell>{projects.find((p) => p.id === task.projectId)?.name}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                </TableCell>
                <TableCell>
                  {members.find((m) => m.userId === task.userId)?.name ?? "Sin asignar"}
                </TableCell>
                <TableCell>{format(parseISO(task.dateline), "dd/MM/yyyy")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => openForm(task)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setToDelete(task)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text="Anterior"
              aria-disabled={currentPage === 1}
              onClick={(e) => goTo(e, currentPage - 1)}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                href="#"
                isActive={number === currentPage}
                onClick={(e) => goTo(e, number)}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              text="Siguiente"
              aria-disabled={currentPage === totalPages}
              onClick={(e) => goTo(e, currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {formOpen && <TaskForm task={editing} onClose={() => setFormOpen(false)} />}

      {toDelete && (
        <ConfirmDelete
          title="¿Eliminar tarea?"
          description={`Se eliminará la tarea "${toDelete.description}".`}
          onConfirm={() => deleteTask(toDelete)}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  )
}
