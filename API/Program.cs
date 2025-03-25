
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IPatientService,PatientService>();
builder.Services.AddScoped<IGpPracticeService,GpPracticeService>();
builder.Services.AddScoped<IMedicationService,MedicationService>();



builder.Services.AddDbContext<DataContext>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/patients/{id}", async (int id, IPatientService _patientService) =>
{
    try{
        var patient = await _patientService.GetById(id);
        return Results.Ok(patient);
    }catch(Exception error) 
    {
        return Results.BadRequest(new {message = error.Message});
    }
});

app.MapGet("/patients/",async (string surname, IPatientService _patientService) =>{
    try{
        if(surname.Length < 3)
        {
            throw new Exception("Please provide more than two characters");
        }
        var patients = await _patientService.GetBySurname(surname);
        return Results.Ok(patients);
    }catch(Exception error)
    {
        return Results.BadRequest(new {message = error.Message});
    }
});



app.Run();

