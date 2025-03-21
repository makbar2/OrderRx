using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

public class DateOnlyConverter : ValueConverter<DateOnly, DateTime>
{
    public DateOnlyConverter() : base(
        v => v.ToDateTime(TimeOnly.MinValue),  // Convert DateOnly to DateTime
        v => DateOnly.FromDateTime(v)          // Convert DateTime to DateOnly
    ) { }
}