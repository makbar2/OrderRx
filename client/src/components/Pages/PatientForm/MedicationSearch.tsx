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



export function MedicationSearch({medicationList,setMedicationList,setNewMedication}:
  {
    setNewMedication : React.Dispatch<React.SetStateAction<Medication | undefined>>//medication to be added to the patient 
    medicationList : Medication[] | undefined,//list of all the medications that can be added
    setMedicationList:React.Dispatch<React.SetStateAction<Medication[]>>//idk why this is here 
  }
)
//todo add the abitlity to add new medications as in the ability to add medciations to the database from this component
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
            ? medicationList?.find((medication) => medication.name === value)?.name
            : "Select medication..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="select a medication" />
          <CommandList>
            <CommandEmpty>Unable to fetch medicatiion List</CommandEmpty>
            <CommandGroup>
              {
                medicationList?.map((medication : Medication) =>(
                  <CommandItem key={medication.id} value={medication.name} 
                    onSelect={(currentValue)=> {
                      setValue(currentValue === value ? "": currentValue);
                      setNewMedication(medication);
                      setOpen(false);
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
