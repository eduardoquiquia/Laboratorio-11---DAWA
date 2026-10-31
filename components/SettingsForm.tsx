"use client"

import { useState } from "react"
import { CircleCheckIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { FormAlert } from "@/components/FormAlert"
import { SelectField } from "@/components/SelectField"
import { isValidEmail, type Settings } from "@/lib/data"
import { useDashboard } from "@/lib/store"

export function SettingsForm() {
  const { settings, saveSettings } = useDashboard()
  const [form, setForm] = useState(settings)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = (changes: Partial<Settings>) => {
    setForm({ ...form, ...changes })
    setSaved(false)
  }

  const validate = () => {
    const result: string[] = []
    if (!form.workspaceName.trim()) result.push("El nombre del espacio es obligatorio.")
    if (!form.adminName.trim()) result.push("El nombre del administrador es obligatorio.")
    if (!isValidEmail(form.adminEmail.trim())) result.push("Ingresa un correo válido.")
    return result
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validate()
    setErrors(result)
    setSaved(false)
    if (result.length > 0) return

    setSaving(true)
    await saveSettings(form)
    setSaving(false)
    setSaved(true)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid max-w-xl gap-4">
      <FormAlert errors={errors} />
      {saved && (
        <Alert>
          <CircleCheckIcon />
          <AlertTitle>Configuración guardada</AlertTitle>
          <AlertDescription>Los cambios se aplicaron correctamente.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-2">
        <Label htmlFor="workspace-name">Nombre del espacio de trabajo</Label>
        <Input
          id="workspace-name"
          value={form.workspaceName}
          onChange={(e) => update({ workspaceName: e.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="admin-name">Administrador</Label>
          <Input
            id="admin-name"
            value={form.adminName}
            onChange={(e) => update({ adminName: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="admin-email">Correo del administrador</Label>
          <Input
            id="admin-email"
            type="email"
            value={form.adminEmail}
            onChange={(e) => update({ adminEmail: e.target.value })}
          />
        </div>

        <SelectField
          id="language"
          label="Idioma"
          options={["Español", "English"]}
          value={form.language}
          onChange={(language) => update({ language })}
        />

        <SelectField
          id="page-size"
          label="Tareas por página"
          options={["5", "10", "20"]}
          value={form.pageSize}
          onChange={(pageSize) => update({ pageSize })}
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="email-notifications"
          checked={form.emailNotifications}
          onCheckedChange={(emailNotifications) => update({ emailNotifications })}
        />
        <Label htmlFor="email-notifications">Notificaciones por correo</Label>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="dark-mode"
          checked={form.darkMode}
          onCheckedChange={(darkMode) => update({ darkMode })}
        />
        <Label htmlFor="dark-mode">Modo oscuro</Label>
      </div>

      <div>
        <Button type="submit" disabled={saving}>
          {saving && <Spinner />}
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}
