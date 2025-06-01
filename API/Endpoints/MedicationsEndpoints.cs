using Microsoft.IdentityModel.Tokens;
using Mysqlx;

public static class MedicationsEndpoints
{
    public static void MapMedicationsEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapGet("/medications", async (IMedicationService _medicationsService) =>
        {
            try
            {
                var medications = await _medicationsService.Get();
                return Results.Ok(medications);
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }
        }).RequireAuthorization();

        routes.MapGet("/medications/{id}", async (int id, IMedicationService _medicationsService) =>
        {
            try
            {
                var medication = await _medicationsService.GetById(id);
                return Results.Ok(medication);
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }
        });

        routes.MapPost("/medications", async (Medication medication, IMedicationService _medicationsService) =>
        {
            try
            {
                await _medicationsService.Add(medication);
                return Results.Created($"/medications/{medication.Id}", medication);
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }
        }).RequireAuthorization();

        routes.MapGet("/medications/search", async (string query, IMedicationService _medicationService) =>
        {
            try
            {
                if (query.Length < 3)
                {
                    throw new Exception("Please provide more than two characters");
                }
                var medications = await _medicationService.GetByName(query);
                return Results.Ok(medications);
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }
        });

        routes.MapPost("/medications/delete/{id}", async (int id,IMedicationService _medicationsService, IPatientMedicationService _patientMedicationService) =>
        {
            try
            {
                var medication = await _medicationsService.GetById(id);
                if (medication == null)
                {
                    return Results.NotFound(new { message = $"No medication found with ID {id}" });
                }
                List<PatientMedicationDto> relations = await _patientMedicationService.getMedicationRelations(id);
                if (relations == null || relations.Count == 0)
                {
                    await _medicationsService.Delete(id);
                    return Results.Ok(new { message = "deletion successful" });
                }
                return Results.BadRequest(new { relations, message = "unable to delete medications due to relation(s)" });
            }
            catch (InvalidOperationException)
            {
                return Results.BadRequest(new { message = $"unable to find a medication with the id of {id}" });
            }
            catch (Exception error)
            {
               
                return Results.BadRequest(new { message = error.Message });
            }
        });
            

    }
}