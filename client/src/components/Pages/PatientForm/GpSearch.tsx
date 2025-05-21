"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect } from "react";

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
  useEffect(()=>{
    if(patient.gp?.name !== undefined)
    {
      setValue(patient.gp.name)
    }
  },[])
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" w-[400px] justify-between"
        >
          {
            value? (() => {
              const selectedGp = gpList.find((gp) => gp.name === value);
              return selectedGp
                ? `${selectedGp.name} - ${selectedGp.address}`
                : "Select a Gp Practice...";
            })()
            : "Select a Gp Practice..."
          }
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
                    
                      setValue(currentValue === value ? "": currentValue);
                      setPatient((prev) => ({
                        ...prev,
                        gp: gp,
                      }));
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === gp.name ? "opacity-100" : "opacity-0")} />
                    {`${gp.name}`}
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
