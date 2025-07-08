
using System.Globalization;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore.Update.Internal;

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
                    //var updatedPatient = await _patientService.updateDate(patient);
                    //return Results.Ok(updatedPatient);
                    return Results.Ok("yep");
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
                PatientDto returnedPatient = await _patientService.Add(patient);
                return Results.Created($"/patient/{returnedPatient.Id}", returnedPatient);
            }
            catch (Exception error)
            {
                Console.WriteLine(error);
                return Results.BadRequest(new { message = error.Message });
            }
        }).RequireAuthorization();

        routes.MapGet("/patients/search", async (string query, IPatientService _patientService) =>
        {
            try
            {
                List<PatientDto> patients;
                if (query.Length < 3)
                {
                    throw new Exception("Please provide more than two characters");
                }
                if (checkIfDate(query) == true)
                {
                    DateTime date = DateTime.ParseExact(query, "dd/MM/yyyy",CultureInfo.InvariantCulture);
                    patients = await _patientService.GetByDob(date);
                }
                else
                {
                    patients = await _patientService.GetBySurname(query);
                }
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
                var oldMedList = await _patientService.GetMedications(updatedPatient.Id);
                await _patientService.Update(updatedPatient);
                //get the id of the patient and then pass in the medications

                await _patientMedicationService.UpdateRecord(updatedPatient.Id, updatedPatient.patientMedication,oldMedList);
                var fetchedPatient = await _patientService.GetById(id);
                return Results.Ok("something");
         
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        }).RequireAuthorization();

        routes.MapPost("/patients/{id}/send", async (int id, IPatientService _patientService, IEmailService _emailService) =>
        {
            try
            {

                PatientDto patient = await _patientService.GetById(id);
                if (patient == null)
                {
                    throw new KeyNotFoundException($"Patient with ID {id} not found.");
                }
                //_emailService.SendHtmlEmail(patient);
                return Results.Ok("email sent");
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }

            //send an email
        });



    }

    private static bool checkIfDate(string input)
    {
        string pattern = @"^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/([0-9]{4})$";
        return Regex.IsMatch(input, pattern);
    }
    


}
