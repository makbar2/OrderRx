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
            

    }
}