using Mysqlx.Expr;
using Org.BouncyCastle.Bcpg.OpenPgp;

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

app.MapPost("/patient/{id}/medications",async (int id,Medication medication, IPatientService _patientService, IMedicationService _medicationsService, IPatientMedicationService _patientMedicationService) =>{
    try
    {
        var patient = await _patientService.GetById(id);
        var fetchedMedication = await _medicationsService.GetById(medication.Id);//client could modifiy the data, so a check is done
        //create patientMedication then do a check to see if there is a patient medication that already exists so no duplicates happen
        PatientMedication pm = new PatientMedication{
            Patient = patient,
            Medication = fetchedMedication,
            PatientId = patient.Id,
            MedicationId = fetchedMedication.Id
        };
        if(await _patientMedicationService.checkExists(pm) == null)
        {
            await _patientMedicationService.Add(pm);
            return Results.Ok(pm);
        }else{
            throw new Exception("this patient medication relation already exists, you can't find a duplicate record");
        }
    }catch(Exception error)
    {
        return Results.BadRequest(new { message = error.Message });
    }
} );

app.MapDelete("/patient/{id}/medications",async (int id,Medication medication, IPatientService _patientService, IMedicationService _medicationsService, IPatientMedicationService _patientMedicationService) =>{
    //todo: seperate routes out into seperate files, and make a function for the duplicate code in here and the post route for patient medications, because its the same but flipped on  the check
        var patient = await _patientService.GetById(id);
        var fetchedMedication = await _medicationsService.GetById(medication.Id);//client could modifiy the data, so a check is done
        //create patientMedication then do a check to see if there is a patient medication that already exists so no duplicates happen
        PatientMedication pm = new PatientMedication{
            Patient = patient,
            Medication = fetchedMedication,
            PatientId = patient.Id,
            MedicationId = fetchedMedication.Id
        };
        if(await _patientMedicationService.checkExists(pm) != null)
        {
            await _patientMedicationService.Delete(pm.Id);
            return Results.Ok(pm);
        }else{
            throw new Exception("this patient medication relation already exists, you can't find a duplicate record");
        }
});

app.MapGet("/patients/medications", async (IPatientMedicationService _patientMedicationService)=>{
    try{

        var patientMedications = _patientMedicationService.Get();
        return Results.Ok(patientMedications);
    }catch(Exception error)
    {
        return Results.BadRequest(new { message = error.Message });
    }
});




app.Run();
