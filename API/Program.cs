using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IGpPracticeService, GpPracticeService>();
builder.Services.AddScoped<IMedicationService, MedicationService>();
builder.Services.AddScoped<IPatientMedicationService,PatientMedicationService >();

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
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options=>{
        options.TokenValidationParameters =  new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
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

















app.MapGet("/medications", async (IMedicationService _medicationsService) =>
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
});

app.MapGet("/medications/{id}", async (int id,IMedicationService _medicationsService) =>
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

app.MapPost("/medications", async (Medication medication, IMedicationService _medicationsService) =>{
    try
    {
        await _medicationsService.Add(medication);
        return Results.Created($"/medications/{medication.Id}", medication);
    }
    catch (Exception error)
    {
        return Results.BadRequest(new { message = error.Message });
    }
});






app.MapPost("/gpSurgeries",async (GpPractice gp,IGpPracticeService _gpService) =>{
    try
    {
        await _gpService.Add(gp);
        return Results.Ok(gp);
    }
    catch (Exception error)
    {
        return Results.BadRequest(new { message = error.Message });
    }
});

app.MapGet("/gpSurgeries", async (IGpPracticeService _gpService) =>
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
});

app.Run();
