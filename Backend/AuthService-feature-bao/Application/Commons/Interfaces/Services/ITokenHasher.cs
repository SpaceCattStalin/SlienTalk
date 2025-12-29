namespace Application.Commons.Interfaces.Services
{
    /// <summary>
    /// Provides functionality for hashing and verifying refresh tokens for secure storage
    /// </summary>
    public interface ITokenHasher
    {
        /// <summary>
        /// Hashes a plain text refresh token for secure storage in the database
        /// </summary>
        /// <param name="plainTextToken">The plain text refresh token to hash</param>
        /// <returns>The hashed representation of the token</returns>
        string HashToken(string plainTextToken);

        /// <summary>
        /// Verifies if a plain text token matches the stored hash
        /// </summary>
        /// <param name="plainTextToken">The plain text token to verify</param>
        /// <param name="hashedToken">The stored hashed token</param>
        /// <returns>True if the tokens match, false otherwise</returns>
        bool VerifyToken(string plainTextToken, string hashedToken);

        /// <summary>
        /// Generates a cryptographically secure salt for token hashing
        /// </summary>
        /// <returns>A new salt value</returns>
        string GenerateSalt();

        /// <summary>
        /// Hashes a plain text refresh token with a specific salt
        /// </summary>
        /// <param name="plainTextToken">The plain text refresh token to hash</param>
        /// <param name="salt">The salt to use for hashing</param>
        /// <returns>The hashed representation of the token</returns>
        string HashTokenWithSalt(string plainTextToken, string salt);
    }
}