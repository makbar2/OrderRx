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

app.MapPost("/patient", async (Patient patient, IPatientService _patientService, IMedicationService _medicationsService,IGpPracticeService _gpService) =>
{
    try
    {
        /*
            the ef core will just assume that i am creating a new gp and medications
            i have tried only sending the ids and creating the patient however that causes an error as its not matching the ids 
            so i removed the data stripping from the client as its not needed
        */
        var fetchedGP = await _gpService.GetById(patient.Gp.Id);
        patient.Gp = fetchedGP;
        Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(patient));
        var newPatientMedication = new List<PatientMedication>();
        if(patient.patientMedication != null)
        {
            foreach(PatientMedication pm in patient.patientMedication)
            {
                Medication fetchedMedication = await  _medicationsService.GetById(pm.Medication.Id);
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
        return Results.Ok(patient);
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

app.MapPatch("/patient/{id}", async (int id, Patient updatedData, IPatientService _patientService) =>
{
    try
    {
        var existingPatient = await _patientService.GetById(id);

        if (existingPatient == null)
        {
            return Results.NotFound(new { message = "Patient not found." });
        }
        existingPatient.FirstName = updatedData.FirstName ?? existingPatient.FirstName;
        existingPatient.Surname = updatedData.Surname ?? existingPatient.Surname;
        existingPatient.Address = updatedData.Address ?? existingPatient.Address;
        existingPatient.Postcode = updatedData.Postcode ?? existingPatient.Postcode;
        existingPatient.Notes = updatedData.Notes ?? existingPatient.Notes;
        if (updatedData.DOB != default) existingPatient.DOB = updatedData.DOB;
        if (updatedData.GpPracticeId != 0) existingPatient.GpPracticeId = updatedData.GpPracticeId;
        if (updatedData.CollectionDate.HasValue) existingPatient.CollectionDate = updatedData.CollectionDate;
        if (updatedData.OrderDate.HasValue) existingPatient.OrderDate = updatedData.OrderDate;
        if (updatedData.OrderFrequency.HasValue) existingPatient.OrderFrequency = updatedData.OrderFrequency;
        if (updatedData.Active.HasValue) existingPatient.Active = updatedData.Active;

        await _patientService.Update(existingPatient);

        return Results.Ok(existingPatient);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { message = ex.Message });
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

app.MapPost("/medications", async (Medication medication, IMedicationService _medicationsService) =>{
    try
    {
        await _medicationsService.Add(medication);
        return Results.Ok(medication);
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

app.MapDelete("/patient/{patientId}/medication/{medicationId}",async (int patientId,int medicationId,IPatientService _patientService, IMedicationService _medicationsService, IPatientMedicationService _patientMedicationService) =>{
    //todo: seperate routes out into seperate files, and make a function for the duplicate code in here and the post route for patient medications, because its the same but flipped on  the check
        var patient = await _patientService.GetById(patientId);
        var fetchedMedication = await _medicationsService.GetById(medicationId);//client could modifiy the data, so a check is done
        //create patientMedication then do a check to see if there is a patient medication that already exists so no duplicates happen
        PatientMedication pm = new PatientMedication{
            Patient = patient,
            Medication = fetchedMedication,
            PatientId = patient.Id,
            MedicationId = fetchedMedication.Id
        };
        var fetchedPM = await _patientMedicationService.checkExists(pm);
        if(fetchedPM != null)
        {
            await _patientMedicationService.Delete(fetchedPM.Id);
            return Results.Ok(pm);
        }else{
            throw new Exception($"unable to find a relation with patient {patientId} and medication {medicationId}");
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
