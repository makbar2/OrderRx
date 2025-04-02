"use client"
import Medication from "@/Interfaces/Medication"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"



export function MedicationSearch({medicationList,setMedicationList}:
  {
    medicationList : Medication[] | undefined,
    setMedicationList:React.Dispatch<React.SetStateAction<Medication[]>>
  }
)
{
  console.log(medicationList);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" w-[400px] justify-between"
        >
          {/* {
          value
          ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."
          } */}
          {value
            ? medicationList?.find((medication) => medication.name === value)?.name
            : "Select medication..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {
                medicationList?.map((medication : Medication) =>(
                  <CommandItem key={medication.id} value={medication.name} 
                    onSelect={(currentValue)=> {
                      setValue(currentValue === value ? "": currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === medication.name ? "opacity-100" : "opacity-0")} />
                    {medication.name}
                  </CommandItem>
                ))
              }
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
