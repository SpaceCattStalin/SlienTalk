namespace Infrastructure.Services
{
    public class Utilities
    {
        public static Guid GenerateGuidFromString(string input)
        {
            using var provider = System.Security.Cryptography.MD5.Create();
            byte[] hash = provider.ComputeHash(System.Text.Encoding.UTF8.GetBytes(input));
            return new Guid(hash);
        }
    }
}
