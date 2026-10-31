"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { PlusIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmDelete } from "@/components/ConfirmDelete"
import { MemberForm } from "@/components/MemberForm"
import type { Member } from "@/lib/data"
import { useDashboard } from "@/lib/store"

export function TeamTable() {
  const { members, projects, deleteMember } = useDashboard()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [toDelete, setToDelete] = useState<Member | null>(null)

  const openForm = (member: Member | null) => {
    setEditing(member)
    setFormOpen(true)
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => openForm(null)}>
        <PlusIcon />
        Nuevo miembro
      </Button>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Miembro</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Nacimiento</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No hay miembros registrados.
                </TableCell>
              </TableRow>
            )}
            {members.map((member) => (
              <TableRow key={member.userId}>
                <TableCell>{member.userId}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>{format(parseISO(member.birthdate), "dd/MM/yyyy")}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>
                  {projects.find((p) => p.id === member.projectId)?.name ?? "Sin proyecto"}
                </TableCell>
                <TableCell>
                  <Badge variant={member.isActive ? "default" : "secondary"}>
                    {member.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => openForm(member)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setToDelete(member)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {formOpen && <MemberForm member={editing} onClose={() => setFormOpen(false)} />}

      {toDelete && (
        <ConfirmDelete
          title="¿Eliminar miembro?"
          description={`Se eliminará a ${toDelete.name} y sus tareas quedarán sin asignar.`}
          onConfirm={() => deleteMember(toDelete)}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  )
}
