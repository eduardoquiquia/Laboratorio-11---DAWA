"use client"

import { useState } from "react"
import { format } from "date-fns"
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
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "@/components/DatePicker"
import { FormAlert } from "@/components/FormAlert"
import { SelectField } from "@/components/SelectField"
import { isValidEmail, ROLES, type Member } from "@/lib/data"
import { useDashboard } from "@/lib/store"

const emptyMember: Member = {
  userId: "",
  role: "",
  name: "",
  email: "",
  position: "",
  birthdate: "",
  phone: "",
  projectId: "",
  isActive: true,
}

type MemberFormProps = {
  member: Member | null // null = crear
  onClose: () => void
}

export function MemberForm({ member, onClose }: MemberFormProps) {
  const { projects, members, saveMember } = useDashboard()
  const [form, setForm] = useState(member ?? emptyMember)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const validate = () => {
    const result: string[] = []
    const email = form.email.trim().toLowerCase()
    if (!form.name.trim()) result.push("El nombre es obligatorio.")
    if (!isValidEmail(email)) result.push("Ingresa un correo válido.")
    if (members.some((m) => m.email === email && m.userId !== form.userId)) {
      result.push("Ya existe un miembro con ese correo.")
    }
    if (!form.role) result.push("Selecciona un rol.")
    if (!form.position.trim()) result.push("El cargo es obligatorio.")
    if (!form.birthdate) result.push("Selecciona la fecha de nacimiento.")
    if (form.birthdate >= format(new Date(), "yyyy-MM-dd")) {
      result.push("La fecha de nacimiento debe ser anterior a hoy.")
    }
    if (!/^\d{9}$/.test(form.phone)) result.push("El teléfono debe tener 9 dígitos.")
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validate()
    setErrors(result)
    if (result.length > 0) return

    setSaving(true)
    await saveMember({
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      position: form.position.trim(),
    })
    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[525px]">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>{member ? "Editar miembro" : "Nuevo miembro"}</DialogTitle>
            <DialogDescription>
              {member ? `Usuario ${member.userId}` : "El userId se genera automáticamente."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormAlert errors={errors} />

            <div className="grid gap-2">
              <Label htmlFor="member-name">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="member-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="member-email">
                Correo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="member-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                id="member-role"
                label="Rol"
                required
                placeholder="Selecciona un rol"
                options={ROLES}
                value={form.role}
                onChange={(role) => setForm({ ...form, role })}
              />

              <div className="grid gap-2">
                <Label htmlFor="member-position">
                  Cargo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="member-position"
                  placeholder="Frontend Developer"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="member-birthdate">
                  Fecha de nacimiento <span className="text-destructive">*</span>
                </Label>
                <DatePicker
                  id="member-birthdate"
                  dropdown
                  value={form.birthdate}
                  onChange={(birthdate) => setForm({ ...form, birthdate })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="member-phone">
                  Teléfono <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="member-phone"
                  placeholder="987654321"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <SelectField
              id="member-project"
              label="Proyecto"
              options={[
                { value: "none", label: "Sin proyecto" },
                ...projects.map((p) => ({ value: p.id, label: p.name })),
              ]}
              value={form.projectId || "none"}
              onChange={(value) => setForm({ ...form, projectId: value === "none" ? "" : value })}
            />

            <div className="flex items-center gap-2">
              <Switch
                id="member-active"
                checked={form.isActive}
                onCheckedChange={(isActive) => setForm({ ...form, isActive })}
              />
              <Label htmlFor="member-active">Miembro activo</Label>
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
