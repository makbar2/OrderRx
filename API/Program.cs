var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IGpPracticeService, GpPracticeService>();
builder.Services.AddScoped<IMedicationService, MedicationService>();

// CORS Policy setup
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder.WithOrigins("http://localhost:5173", "https://localhost:5173") // React frontend
                          .AllowCredentials()
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .WithExposedHeaders("Content-Type", "Authorization")); // Allow exposed headers if needed
});

builder.Services.AddDbContext<DataContext>();

var app = builder.Build();

// Use CORS middleware before other middleware
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Map API routes
app.MapGet("/patient/{id}", async (int id, IPatientService _patientService) =>
{
    try
    {
        var patient = await _patientService.GetById(id);
        return Results.Ok(patient);
    }
    catch (Exception error)
    {
        return Results.BadRequest(new { message = error.Message });
    }
});

app.MapGet("/patient", async (IPatientService _patientService) =>
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
});

app.MapGet("/patients/search", async (string surname, IPatientService _patientService) =>
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
});

app.Run();
