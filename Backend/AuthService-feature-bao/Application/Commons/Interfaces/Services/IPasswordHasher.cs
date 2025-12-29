namespace Application.Commons.Interfaces.Services
{
    public interface IPasswordHasher
    {
        /// <summary>
        /// Hashes a plain text password using a secure one-way hashing algorithm.
        /// </summary>
        string HashPassword(string password);

        /// <summary>
        /// Verifies a plain text password against an existing hash.
        /// Returns true if the password is correct, otherwise false.
        /// </summary>
        bool VerifyPassword(string hashedPassword, string providedPassword);
    }
}
