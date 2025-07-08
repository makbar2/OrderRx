using Humanizer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Bcpg.OpenPgp;
using ZstdSharp.Unsafe;

public class PatientMedicationService : IPatientMedicationService
{
    private readonly DataContext _context;

    public PatientMedicationService(DataContext context)
    {
        _context = context;
    }

    public async Task<PatientMedication> Add(PatientMedication patientMedication)
    {
        _context.PatientMedications.Add(patientMedication);
        await _context.SaveChangesAsync();
        return patientMedication;
    }

    public async Task<bool> Delete(int patientMedicationId)
    {
        var pm = await _context.PatientMedications.FirstAsync(i => i.Id == patientMedicationId) ?? 
            throw new Exception($"Unable to find a relation  with the id of{patientMedicationId}");
        _context.PatientMedications.Remove(pm);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<PatientMedication>> Get()
    {
        List<PatientMedication> pms = await _context.PatientMedications.ToListAsync() ?? throw new Exception("Unable to retrieve any records from the patient medication join table check the database");
        return pms;
    }

    public async Task<PatientMedication> GetById(int id)
    {
        PatientMedication pm = await _context.PatientMedications
            .FirstOrDefaultAsync(i => i.Id == id) ?? throw new Exception($"Unable to find a patient medication with the id : {id}");
        return pm;
    }
    

    public async Task<PatientMedication?> checkExists(PatientMedication patientMedication)
    {
        return await _context.PatientMedications.FirstOrDefaultAsync(i => i.PatientId == patientMedication.PatientId && i.MedicationId == patientMedication.MedicationId);
    }

    public async Task<bool> DeleteByIds(int patientId, int medicationId)
    {
        var pm = await _context.PatientMedications.FirstAsync(i => i.PatientId == patientId && i.MedicationId == medicationId) ?? 
            throw new Exception($"Unable to find a relation between patient : {patientId} and medication : {medicationId}");
        _context.PatientMedications.Remove(pm);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<PatientMedicationDto>> getMedicationRelations(int medicationId)
    {
        var pms = await _context.PatientMedications
            .Where(i => i.MedicationId == medicationId)
            .Select(pm => new PatientMedicationDto
            {
                PatientId = pm.PatientId,
                FirstName = pm.Patient.FirstName,
                Surname = pm.Patient.Surname,
                DOB = pm.Patient.DOB.ToDateTime(TimeOnly.MinValue),//never using date only ever again
                
                Medication = pm.Medication
            })
            .ToListAsync();
        return pms;
        
    }

    public async Task<List<PatientMedicationDto>> UpdateRecord(int patientId, List<PatientMedication> newMedlist, List<PatientMedication> oldMedlist)
    {
        //newmedlists is an updated list sent from the client, 
        //this will be a pm object with only the medication field populated
        //oldmedlist is what the list stored on the db
        List<PatientMedication> toAdd = new List<PatientMedication>();
        List<PatientMedication> toRemove = new List<PatientMedication>();
        if (oldMedlist == null)
        {
            toAdd = newMedlist;
        }
        else
        {
            toAdd = getMedicationsToAdd(newMedlist, oldMedlist);//check to see if items from the new list are new items
            toRemove = getMedicationsToRemove(oldMedlist, newMedlist);//check items have been removed in the new list 
        }
        if (toAdd != null)
        {
            foreach (var pm in toAdd)
            {
                pm.MedicationId = pm.Medication.Id;
                pm.PatientId = patientId;
                pm.Medication = null;
                await this.Add(pm);
            }
        }
        if (toRemove != null)
        {
            foreach (var pm in toRemove)
            {
                await this.Delete(pm.Id);
            }
        }
        return await this.getPatientRelations(patientId);
       
    }


    private List<PatientMedication> getMedicationsToAdd(List<PatientMedication> newMedlist, List<PatientMedication> oldMedlist)
    {
        List<PatientMedication> medList = new List<PatientMedication>();
        foreach (PatientMedication xPm in newMedlist)
        {
            bool found = false;
            foreach (PatientMedication yPm in oldMedlist)
            {
            
                if (xPm.Medication.Id == yPm.MedicationId)
                    {
                        found = true;
                        break;//dont search the rest
                    }
            }
            if (!found)
            {
                medList.Add(xPm);
            }
        }
        return medList;
    }

    private List<PatientMedication> getMedicationsToRemove(List<PatientMedication> oldMedlist,List<PatientMedication> newMedlist)
    {
        List<PatientMedication> medList = new List<PatientMedication>();
        foreach (PatientMedication xPm in oldMedlist)
        {
            bool found = false;
            foreach (PatientMedication yPm in newMedlist)
            {
                if (xPm.MedicationId == yPm.Medication.Id)//medication is found in the new list 
                {
                    found = true;
                }
            }
            if (!found)
            {
                medList.Add(xPm);
            }
        }
        return medList;
    }

    private List<PatientMedication> findDifference(List<PatientMedication> toFind, List<PatientMedication> toSearch, bool newItems)
    {
        List<PatientMedication> medList = new List<PatientMedication>();
        foreach (PatientMedication xPm in toFind)
        {
            bool found = !newItems;
            foreach (PatientMedication yPm in toSearch)
            {
            
                if (xPm.Medication.Id == yPm.MedicationId)
                    {
                        found = true;
                        break;//dont search the rest
                    }
            }
            if (!found)
            {
                medList.Add(xPm);
            }
        }
        return medList;
    }

    public async Task<List<PatientMedicationDto>> getPatientRelations(int patientId)
    {
        var pms = await _context.PatientMedications
            .Where(i => i.PatientId == patientId).Select(pm => new PatientMedicationDto
            {
                PatientId = pm.PatientId,
                FirstName = pm.Patient.FirstName,
                Surname = pm.Patient.Surname,
                DOB = pm.Patient.DOB.ToDateTime(TimeOnly.MinValue),//never using date only ever again
                
                Medication = pm.Medication
            }).ToListAsync();
        return pms;
    }
}
