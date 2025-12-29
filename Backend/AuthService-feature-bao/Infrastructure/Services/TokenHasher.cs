using Application.Commons.Interfaces.Services;
using System.Security.Cryptography;

namespace Infrastructure.Services
{
    public sealed class TokenHasher : ITokenHasher
    {
        private const int _saltSize = 32;
        private const int _hashSize = 32;
        private const int _iterations = 100000;

        /// <summary>
        /// Hashes a token using a random salt
        /// </summary>
        public string HashToken(string plainTextToken)
        {
            if (string.IsNullOrEmpty(plainTextToken))
                throw new ArgumentException("Token cannot be null or empty", nameof(plainTextToken));

            var salt = GenerateSaltBytes();
            var hash = HashWithPbkdf2(plainTextToken, salt);

            // Combine salt and hash: [salt][hash]
            var combined = new byte[_saltSize + _hashSize];
            Array.Copy(salt, 0, combined, 0, _saltSize);
            Array.Copy(hash, 0, combined, _saltSize, _hashSize);

            return Convert.ToBase64String(combined);
        }

        /// <summary>
        /// Verifies a plain text token against a stored hash
        /// </summary>
        public bool VerifyToken(string plainTextToken, string hashedToken)
        {
            if (string.IsNullOrEmpty(plainTextToken) || string.IsNullOrEmpty(hashedToken))
                return false;

            try
            {
                var combined = Convert.FromBase64String(hashedToken);

                if (combined.Length != _saltSize + _hashSize)
                    return false;

                // Extract salt and hash
                var salt = new byte[_saltSize];
                var storedHash = new byte[_hashSize];

                Array.Copy(combined, 0, salt, 0, _saltSize);
                Array.Copy(combined, _saltSize, storedHash, 0, _hashSize);

                // Hash the provided token with the extracted salt
                var testHash = HashWithPbkdf2(plainTextToken, salt);

                // Compare hashes in constant time to prevent timing attacks
                return SlowEquals(storedHash, testHash);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Generates a cryptographically secure salt as a Base64 string
        /// </summary>
        public string GenerateSalt()
        {
            return Convert.ToBase64String(GenerateSaltBytes());
        }

        /// <summary>
        /// Hashes a token with a specific salt (useful for testing or custom scenarios)
        /// </summary>
        public string HashTokenWithSalt(string plainTextToken, string salt)
        {
            if (string.IsNullOrEmpty(plainTextToken))
                throw new ArgumentException("Token cannot be null or empty", nameof(plainTextToken));

            if (string.IsNullOrEmpty(salt))
                throw new ArgumentException("Salt cannot be null or empty", nameof(salt));

            var saltBytes = Convert.FromBase64String(salt);
            var hash = HashWithPbkdf2(plainTextToken, saltBytes);

            var combined = new byte[saltBytes.Length + hash.Length];
            Array.Copy(saltBytes, 0, combined, 0, saltBytes.Length);
            Array.Copy(hash, 0, combined, saltBytes.Length, hash.Length);

            return Convert.ToBase64String(combined);
        }

        // ============================================
        // PRIVATE HELPER METHODS
        // ============================================

        private byte[] GenerateSaltBytes()
        {
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[_saltSize];
            rng.GetBytes(salt);
            return salt;
        }

        private byte[] HashWithPbkdf2(string input, byte[] salt)
        {
            using var pbkdf2 = new Rfc2898DeriveBytes(input, salt, _iterations, HashAlgorithmName.SHA256);
            return pbkdf2.GetBytes(_hashSize);
        }

        /// <summary>
        /// Compares two byte arrays in constant time to prevent timing attacks
        /// </summary>
        private static bool SlowEquals(byte[] a, byte[] b)
        {
            if (a.Length != b.Length)
                return false;

            var diff = 0;
            for (var i = 0; i < a.Length; i++)
                diff |= a[i] ^ b[i];

            return diff == 0;
        }
    }
}