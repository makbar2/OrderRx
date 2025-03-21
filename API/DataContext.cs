
using Microsoft.EntityFrameworkCore;
public class DataContext : DbContext
{
    public DbSet<Patient> Patients { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Medication> Medications { get; set; }
    public DbSet<GpPractice> GpPractices { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Corrected connection string for MySQL with port specified
        optionsBuilder.UseMySQL("server=127.0.0.1;port=3306;database=scriptTrack;user=root;password=root");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
         modelBuilder.Entity<Patient>()
            .Property(p => p.DOB)
            .HasConversion(new DateOnlyConverter());

        base.OnModelCreating(modelBuilder);
    }
       

    
}