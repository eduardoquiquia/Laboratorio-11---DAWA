"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { FormAlert } from "@/components/FormAlert"
import { SelectField } from "@/components/SelectField"
import { CATEGORIES, PRIORITIES } from "@/lib/data"
import { useDashboard } from "@/lib/store"

const emptyForm = { name: "", description: "", category: "", priority: "" }

export function ProjectForm() {
  const { projects, members, createProject } = useDashboard()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [memberIds, setMemberIds] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setFormData(emptyForm)
    setMemberIds([])
    setErrors([])
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) reset()
  }

  const toggleMember = (userId: string, checked: boolean) => {
    setMemberIds((prev) => (checked ? [...prev, userId] : prev.filter((id) => id !== userId)))
  }

  const validate = () => {
    const result: string[] = []
    const name = formData.name.trim()
    if (!name) result.push("El nombre del proyecto es obligatorio.")
    if (projects.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      result.push("Ya existe un proyecto con ese nombre.")
    }
    if (!formData.category) result.push("Selecciona una categoría.")
    if (!formData.priority) result.push("Selecciona la prioridad.")
    if (memberIds.length === 0) result.push("Selecciona al menos un miembro del equipo.")
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validate()
    setErrors(result)
    if (result.length > 0) return

    setSaving(true)
    await createProject({ ...formData, name: formData.name.trim() }, memberIds)
    setSaving(false)

    // Limpiar y cerrar
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <PlusIcon />
        Nuevo Proyecto
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[525px]">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Completa la información del proyecto. Click en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormAlert errors={errors} />

            <div className="grid gap-2">
              <Label htmlFor="name">
                Nombre del Proyecto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Mi Proyecto Increíble"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Breve descripción del proyecto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <SelectField
              id="category"
              label="Categoría"
              required
              placeholder="Selecciona una categoría"
              options={CATEGORIES}
              value={formData.category}
              onChange={(category) => setFormData({ ...formData, category })}
            />

            <SelectField
              id="priority"
              label="Prioridad"
              required
              placeholder="Selecciona la prioridad"
              options={PRIORITIES}
              value={formData.priority}
              onChange={(priority) => setFormData({ ...formData, priority })}
            />

            <div className="grid gap-2">
              <Label>
                Miembros del equipo <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Cada miembro pertenece a un solo proyecto: si ya tiene uno, pasará a este.
              </p>
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border p-3">
                {members.map((member) => (
                  <label key={member.userId} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={memberIds.includes(member.userId)}
                      onCheckedChange={(checked) => toggleMember(member.userId, checked)}
                    />
                    {member.name}
                    <span className="text-xs text-muted-foreground">
                      {projects.find((p) => p.id === member.projectId)?.name ?? "Sin proyecto"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner />}
              Crear Proyecto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
