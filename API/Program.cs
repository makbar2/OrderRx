using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Cookies;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IGpPracticeService, GpPracticeService>();
builder.Services.AddScoped<IMedicationService, MedicationService>();
builder.Services.AddScoped<IPatientMedicationService, PatientMedicationService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEmailService, EmailService>();

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
    .AddJwtBearer(options =>
    {
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Try to get token from cookie
                if (context.Request.Cookies.ContainsKey("token"))
                {
                    context.Token = context.Request.Cookies["token"];
                }
                return Task.CompletedTask;
            }
        };
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });



    
builder.Services.AddAuthorization();

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
app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();

// Map API routes
app.MapPatientEndpoints();
app.MapGpPracticesEndpoints();
app.MapMedicationsEndpoints();
app.MapPatientMedicationEndpoints();
app.MapUserEndpoints();


app.Run();
