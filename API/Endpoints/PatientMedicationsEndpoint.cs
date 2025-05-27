//this endpoint isnt really needed i am just doing it because i created it
public static class PatientMedicationEndpoints
{
    public static void MapPatientMedicationEndpoints(this IEndpointRouteBuilder routes)
    {

        routes.MapGet("/patientMedication/{id}", async (int id, IPatientMedicationService service) =>
        {
            try
            {
                var pm = await service.GetById(id);
                return Results.Ok(pm);
            }
            catch (Exception e)
            {
                return Results.BadRequest(new { message = e.Message });
            }
        }).RequireAuthorization();

        routes.MapGet("/patientMedication/", async (int id, IPatientMedicationService service) =>
        {
            try
            {
                var pm = await service.Get();
                return Results.Ok(pm);
            }
            catch (Exception e)
            {
                return Results.BadRequest(new { message = e.Message });
            }
        }).RequireAuthorization();
    }
    
}