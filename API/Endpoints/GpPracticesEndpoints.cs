public static class GpPracticesEndpoints
{
    public static void MapGpPracticesEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapPost("/gpSurgeries",async (GpPractice gp,IGpPracticeService _gpService) =>{
            try
            {
                await _gpService.Add(gp);
                return Results.Ok(gp);
            }
            catch (Exception error)
            {
            return Results.BadRequest(new { message = error.Message });
            }
        }).RequireAuthorization();

        routes.MapGet("/gpSurgeries", async (IGpPracticeService _gpService) =>
        {
            try
            {
                var results = await _gpService.Get();
                return Results.Ok(results);
            }
            catch (Exception error)
            {
                return Results.BadRequest(new { message = error.Message });
            }
        }).RequireAuthorization();
    }
}