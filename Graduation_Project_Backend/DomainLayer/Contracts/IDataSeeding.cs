namespace DomainLayer.Contracts
{
    public interface IDataSeeding
    {
        Task IdentityDataSeedingAsync();
        Task SeedDoctorsAndPatientsAsync();

    }
}
