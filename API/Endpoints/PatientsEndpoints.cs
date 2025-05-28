
public static class PatientEndpoints
{

    public static void MapPatientEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/patients/{id}", async (int id, IPatientService _patientService) =>
        {
            try
            {
                var patient = await _patientService.GetById(id);
                return Results.Ok(patient);
            }
            catch (Exception e)
            {
                return Results.BadRequest(new { message = e.Message });
            }
        });

        routes.MapGet("/patients", async (IPatientService _patientService) =>
        {
            try
            {
                var patients = await _patientService.Get();
                return Results.Ok(patients);
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }
        }).RequireAuthorization();

        routes.MapGet("/patients/{id}/medications", async (int id, IPatientService _patientService) =>
        {
            try
            {
                var medications = await _patientService.GetMedications(id);
                if (medications == null || !medications.Any())
                {
                    return Results.NotFound();
                }
                else
                {

                    return Results.Ok(medications);
                }
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }
        });

        //get this weeks orders
        routes.MapGet("/patients/orders", async (IPatientService _patientService) =>
        {
            try
            {
                var patients = await _patientService.getOrders(DateTime.Today);
                if (patients == null || !patients.Any())
                {
                    return Results.NotFound();
                }
                else
                {
                    return Results.Ok(patients);
                }
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }
        }).RequireAuthorization();

        routes.MapPost("/patients/{id}/updateOrderDate", async (int id, IPatientService _patientService) =>
        {
            try
            {
                var patient = await _patientService.GetById(id);
                if (patient != null)
                {
                    var updatedPatient = await _patientService.updateDate(patient);
                    return Results.Ok(updatedPatient);
                }
                else
                {
                    return Results.NotFound();
                }
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }
        }).RequireAuthorization();

        routes.MapPost("/patients", async (Patient patient, IPatientService _patientService, IMedicationService _medicationsService, IGpPracticeService _gpService) =>
        {
            try
            {
                /*
                    the ef core will just assume that i am creating a new gp and medications
                    i have tried only sending the ids and creating the patient however that causes an error as its not matching the ids 
                    so i removed the data stripping from the client as its not needed
                    how is tis creating a new pm when i didnt call that service, what the fuck, unless the orm is just able to do that.
                */
                var fetchedGP = await _gpService.GetById(patient.Gp.Id);
                patient.Gp = fetchedGP;
                Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(patient));
                var newPatientMedication = new List<PatientMedication>();
                if (patient.patientMedication != null)
                {
                    foreach (PatientMedication pm in patient.patientMedication)
                    {
                        Medication fetchedMedication = await _medicationsService.GetById(pm.Medication.Id);
                        var newPm = new PatientMedication//creating a new relation row
                        {
                            Medication = fetchedMedication,
                            MedicationId = fetchedMedication.Id,
                            PatientId = patient.Id,
                            Patient = patient
                        };
                        newPatientMedication.Add(newPm);
                    }
                    patient.patientMedication = newPatientMedication;
                }
                await _patientService.Add(patient);
                return Results.Created($"/patient/{patient.Id}", patient);
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }
        }).RequireAuthorization();

        routes.MapGet("/patients/search", async (string surname, IPatientService _patientService) =>
        {
            try
            {
                if (surname.Length < 3)
                {
                    throw new Exception("Please provide more than two characters");
                }
                var patients = await _patientService.GetBySurname(surname);
                return Results.Ok(patients);
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }
        }).RequireAuthorization();


        routes.MapPatch("/patients/{id}", async (int id, Patient updatedPatient, IPatientService _patientService, IMedicationService _medicationsService, IPatientMedicationService _patientMedicationService) =>
        {
            try
            {
                var existingPatient = await _patientService.GetById(id);
                if (existingPatient == null)
                {
                    return Results.NotFound(new { message = "Patient not found." });
                }
                existingPatient.FirstName = updatedPatient.FirstName ?? existingPatient.FirstName;
                existingPatient.Surname = updatedPatient.Surname ?? existingPatient.Surname;
                existingPatient.Address = updatedPatient.Address ?? existingPatient.Address;
                existingPatient.Postcode = updatedPatient.Postcode ?? existingPatient.Postcode;
                existingPatient.Notes = updatedPatient.Notes ?? existingPatient.Notes;
                if (updatedPatient.DOB != default) existingPatient.DOB = updatedPatient.DOB;
                if (updatedPatient.GpPracticeId != 0) existingPatient.GpPracticeId = updatedPatient.GpPracticeId;
                if (updatedPatient.CollectionDate.HasValue) existingPatient.CollectionDate = updatedPatient.CollectionDate;
                if (updatedPatient.OrderDate.HasValue) existingPatient.OrderDate = updatedPatient.OrderDate;
                if (updatedPatient.OrderFrequency.HasValue) existingPatient.OrderFrequency = updatedPatient.OrderFrequency;
                if (updatedPatient.Active.HasValue) existingPatient.Active = updatedPatient.Active;
                //check list of medications to see if if there is any changes
                // loop through new list 
                // if it pm doesnt exist in new  list remove it from the exiting patient
                var newPatientMedication = new List<PatientMedication>();
                if (existingPatient.patientMedication != null)
                {
                    Dictionary<int, int> oldMedications = new Dictionary<int, int>();
                    //if found then set value to 1, if not 0, if key doesnt exist create new pm, if value doesnt exist remove pm
                    foreach (PatientMedication pm in existingPatient.patientMedication)
                    {
                        oldMedications.Add(pm.Medication.Id, 0);
                    }
                    foreach (PatientMedication pm in updatedPatient.patientMedication)
                    {
                        if (oldMedications.ContainsKey(pm.Medication.Id))
                        {
                            oldMedications[pm.Medication.Id] = 1;
                        }
                        else
                        {
                            var fetchedMedication = await _medicationsService.GetById(pm.Medication.Id);
                            var newPm = new PatientMedication//creating a new relation row
                            {
                                Medication = fetchedMedication,
                                MedicationId = fetchedMedication.Id,
                                PatientId = existingPatient.Id,
                                Patient = existingPatient
                            };
                            newPatientMedication.Add(newPm);
                        }
                    }
                    foreach (KeyValuePair<int, int> pair in oldMedications)//deletion
                    {
                        if (pair.Value == 0)
                        {
                            await _patientMedicationService.DeleteByIds(existingPatient.Id, pair.Key);
                            //cba passing in the patientmedication id, long to implement this is faster do implement
                        }
                    }
                }
                await _patientService.Update(existingPatient);
                //i am going to assume that the orm is going to need to be specifically add and delete pm objects as 
                //as it might think all the pms' are new
                foreach (PatientMedication pm in newPatientMedication)
                {
                    await _patientMedicationService.Add(pm);
                }
                return Results.Ok(existingPatient);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        }).RequireAuthorization();

        routes.MapPost("/patients/{id}/send", async (int id, IPatientService _patientService, IEmailService _emailService)=>
        {
            try
            {

                Patient patient = await _patientService.GetById(id);
                if (patient == null)
                {
                    throw new KeyNotFoundException($"Patient with ID {id} not found.");
                }
                _emailService.SendHtmlEmail(patient);
                return Results.Ok("email sent");
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }

            //send an email
        });



    }
    
    


}
