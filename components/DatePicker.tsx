"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DatePickerProps = {
  id: string
  value: string // yyyy-MM-dd
  onChange: (value: string) => void
  // Muestra selectores de mes y año, útil para fechas lejanas
  dropdown?: boolean
}

export function DatePicker({ id, value, onChange, dropdown }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const date = value ? parseISO(value) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button id={id} type="button" variant="outline" className="w-full justify-start font-normal" />
        }
      >
        <CalendarIcon />
        {date ? format(date, "dd/MM/yyyy") : "Selecciona una fecha"}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={es}
          selected={date}
          defaultMonth={date}
          captionLayout={dropdown ? "dropdown" : "label"}
          startMonth={new Date(1950, 0)}
          endMonth={new Date(2040, 11)}
          onSelect={(day) => {
            onChange(day ? format(day, "yyyy-MM-dd") : "")
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
