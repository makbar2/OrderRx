"use client"
import Medication from "@/Interfaces/Medication"
import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

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

export function MedicationSearch({
  medicationList,
  setMedicationList,
  setNewMedication,
}: {
  setNewMedication: React.Dispatch<React.SetStateAction<Medication | undefined>>
  medicationList: Medication[] | undefined
  setMedicationList: React.Dispatch<React.SetStateAction<Medication[]>>
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [input, setInput] = React.useState("")


  const filteredMedications = medicationList?.filter((med) =>
    med.name.toLowerCase().includes(input.toLowerCase())
  ) || [];

  const medicationExists = filteredMedications.some(med => med.name.toLowerCase() === input.toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {value || "Select medication..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search or add medication"
            value={input}
            onValueChange={setInput}
          />
          <CommandList>
            {filteredMedications.length === 0 ? (
              <CommandEmpty>No medication found</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredMedications.map((medication) => (
                  <CommandItem
                    key={medication.id}
                    value={medication.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue)
                      setNewMedication(medication)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === medication.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {medication.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {!medicationExists && input.trim() !== "" && (
              <CommandGroup>
                <CommandItem onSelect={()=> {handleCreateNewMedication(input,setMedicationList,setNewMedication,setValue,setOpen)}}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add "{input}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


async function handleCreateNewMedication(
  input:string, 
  setMedicationList :  React.Dispatch<React.SetStateAction<Medication[]>>,
  setNewMedication :  React.Dispatch<React.SetStateAction<Medication | undefined>>,
  setValue : React.Dispatch<React.SetStateAction<string>>,
  setOpen :React.Dispatch<React.SetStateAction<boolean>>
){
    const newMedication: Medication = {
      id:0,
      name: input,
    }
    try{
      const response = await fetch(`https://localhost:7295/medications`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        
        },
        body: JSON.stringify(newMedication)
      });
      if(response.status === 201)
      {
        const data = await response.json();
        console.log(data);
        setMedicationList(prev => [...(prev || []), data]);
        setNewMedication(data);
        setValue(input);
        setOpen(false);
      }else{
        console.log("unable to create medication", response);
      }
    }catch(error)
    {
      console.log("unable to connect to backend");
    }

  }