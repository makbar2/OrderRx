"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({
    value,
    name,
    onChange,
  }: {
    value: string
    name: string
    onChange: (name: string, value: string) => void
  }) {
    const [date, setDate] = React.useState<Date>()
  
    React.useEffect(() => {
      if (value && value !== "") {
        const newDate = new Date(value)
        setDate(newDate)
      }
    }, [value])
  
    const handleSelect = (selected: Date | undefined) => {
      if (!selected) return
      setDate(selected)
  
      onChange(name, selected.toISOString()) // or your preferred format
    }
  
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <input type="date"></input>
          {/* <Calendar
            captionLayout="dropdown-buttons"
            fromYear={1900}
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          /> */}
        </PopoverContent>
      </Popover>
    )
  }
  
