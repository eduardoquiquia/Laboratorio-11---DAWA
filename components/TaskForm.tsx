"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { DatePicker } from "@/components/DatePicker"
import { FormAlert } from "@/components/FormAlert"
import { SelectField } from "@/components/SelectField"
import { PRIORITIES, TASK_STATUSES, type Task } from "@/lib/data"
import { useDashboard } from "@/lib/store"

const emptyTask: Task = {
  id: "",
  description: "",
  projectId: "",
  status: "Pendiente",
  priority: "",
  userId: "",
  dateline: "",
}

type TaskFormProps = {
  task: Task | null // null = crear
  onClose: () => void
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const { projects, members, saveTask } = useDashboard()
  const [form, setForm] = useState(task ?? emptyTask)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const validate = () => {
    const result: string[] = []
    if (form.description.trim().length < 5) {
      result.push("La descripción debe tener al menos 5 caracteres.")
    }
    if (!form.projectId) result.push("Selecciona un proyecto.")
    if (!form.status) result.push("Selecciona un estado.")
    if (!form.priority) result.push("Selecciona la prioridad.")
    if (!form.userId) result.push("Selecciona un responsable.")
    if (!form.dateline) result.push("Selecciona la fecha límite.")
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validate()
    setErrors(result)
    if (result.length > 0) return

    setSaving(true)
    await saveTask({ ...form, description: form.description.trim() })
    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[525px]">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>{task ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
            <DialogDescription>Completa la información de la tarea.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormAlert errors={errors} />

            <div className="grid gap-2">
              <Label htmlFor="task-description">
                Descripción <span className="text-destructive">*</span>
              </Label>
              <Input
                id="task-description"
                placeholder="Implementar autenticación"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <SelectField
              id="task-project"
              label="Proyecto"
              required
              placeholder="Selecciona un proyecto"
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
              value={form.projectId}
              onChange={(projectId) => setForm({ ...form, projectId })}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                id="task-status"
                label="Estado"
                required
                options={TASK_STATUSES}
                value={form.status}
                onChange={(status) => setForm({ ...form, status })}
              />

              <SelectField
                id="task-priority"
                label="Prioridad"
                required
                placeholder="Selecciona la prioridad"
                options={PRIORITIES}
                value={form.priority}
                onChange={(priority) => setForm({ ...form, priority })}
              />

              <SelectField
                id="task-user"
                label="Responsable"
                required
                placeholder="Selecciona un miembro"
                options={members.map((m) => ({ value: m.userId, label: m.name }))}
                value={form.userId}
                onChange={(userId) => setForm({ ...form, userId })}
              />

              <div className="grid gap-2">
                <Label htmlFor="task-dateline">
                  Fecha límite <span className="text-destructive">*</span>
                </Label>
                <DatePicker
                  id="task-dateline"
                  value={form.dateline}
                  onChange={(dateline) => setForm({ ...form, dateline })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
