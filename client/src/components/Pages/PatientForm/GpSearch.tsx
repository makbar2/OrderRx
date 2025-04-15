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
import Patient from "@/Interfaces/Patient"
import GpPractice from "@/Interfaces/GpPractice"



export default function GpSearch({gpList,patient, setPatient}:
  {
    gpList : GpPractice[]
    patient : Patient
    setPatient : React.Dispatch<React.SetStateAction<Patient>>
  }
)
{
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
          {value
            ? gpList?.find((gp) => gp.name === value)?.name
            : "Select a Gp Practice..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="select a medication" />
          <CommandList>
            <CommandEmpty>Unable to fetch gp Practice list List</CommandEmpty>
            <CommandGroup>
              {
                gpList?.map((gp : GpPractice) =>(
                  <CommandItem key={gp.id} value={gp.name} 
                    onSelect={(currentValue)=> {
                      let updatedPatient : Patient
                      setValue(currentValue === value ? "": currentValue);
                      updatedPatient = {
                        ...patient,
                        gp: gp
                      }
                      setPatient(updatedPatient);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === gp.name ? "opacity-100" : "opacity-0")} />
                    {`${gp.name} ${gp.address}`}
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
