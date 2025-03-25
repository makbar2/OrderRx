
public interface IGpPracticeService
{
    Task<IEnumerable<GpPractice>> Get();
    Task<GpPractice> GetById(int id);
    Task<GpPractice> Add(GpPractice gp);
    Task<GpPractice> Update(GpPractice gp);
    Task<List<GpPractice>> GetByName(string name);
    Task<bool> Delete(int id);
}

