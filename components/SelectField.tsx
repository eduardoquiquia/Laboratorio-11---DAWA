"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SelectFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: (string | { value: string; label: string })[]
  placeholder?: string
  required?: boolean
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
}: SelectFieldProps) {
  const items = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option
  )

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {/* items permite mostrar el label en lugar del value seleccionado */}
      <Select items={items} value={value || null} onValueChange={(v) => onChange(v ?? "")}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
