using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace CleanCity.Core.Services
{
    public static class InsecureHasher
    {
        //    // =====================================================================================
        //    // SIGURAN KOD
        //    // =====================================================================================
        //    // This method uses AES, a strong, modern encryption standard.
        //    // It also uses PBKDF2 (Rfc2898DeriveBytes) to derive a key from a password and salt,
        //    // which is the correct way to handle password-based encryption.
        //    public static byte[] SecureEncryptWithAES(string dataToEncrypt, string password)
        //    {
        //        // salt should be unique per user/data and stored with the encrypted data.
        //        byte[] salt = Encoding.ASCII.GetBytes("SaltyBoi123");

        //        using (var aes = Aes.Create())
        //        {
        //            // Derive a key and IV from the password and salt.
        //            using (var keyDerivation = new Rfc2898DeriveBytes(password, salt, 100000, HashAlgorithmName.SHA256))
        //            {
        //                aes.Key = keyDerivation.GetBytes(32); // 256-bit key
        //                aes.IV = keyDerivation.GetBytes(16);  // 128-bit IV
        //            }

        //            using (var ms = new MemoryStream())
        //            {
        //                using (var cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write))
        //                {
        //                    byte[] input = Encoding.UTF8.GetBytes(dataToEncrypt);
        //                    cs.Write(input, 0, input.Length);
        //                    cs.FlushFinalBlock();
        //                }
        //                return ms.ToArray();
        //            }
        //        }
        //    }


        // =====================================================================================
        // NESIGURAN KOD - SONARQUBE VULNERABILITIES S5547 & S2068
        // =====================================================================================
        // Vulnerability S5547: Using a weak encryption algorithm (DES)
        public static byte[] InsecureEncryptWithDES(string dataToEncrypt)
        {
            using (var des = DES.Create())
            {
                // Vulnerability S2068: Hardcoded IV and Key
                des.IV = new byte[] { 0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF };
                des.Key = Encoding.ASCII.GetBytes("8bytekey");

                using (var ms = new MemoryStream())
                {
                    using (var cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        byte[] input = Encoding.UTF8.GetBytes(dataToEncrypt);
                        cs.Write(input, 0, input.Length);
                        cs.FlushFinalBlock();
                    }
                    return ms.ToArray();
                }
            }
        }

        // =====================================================================================
        // NESIGURAN KOD - SONARQUBE VULNERABILITY S5344
        // =====================================================================================
        // Passwords should not be stored in plaintext or with a fast hashing algorithm
        public static byte[] SecureEncryptWithAES(string dataToEncrypt, string password)
        {
            // salt should be unique per user/data and stored with the encrypted data.
            byte[] salt = Encoding.ASCII.GetBytes("SaltyBoi123");

            using (var aes = Aes.Create())
            {
                // Derive a key and IV from the password and salt.
                using (var keyDerivation = new Rfc2898DeriveBytes(password, salt, 99999, HashAlgorithmName.SHA256))
                {
                    aes.Key = keyDerivation.GetBytes(32); // 256-bit key
                    aes.IV = keyDerivation.GetBytes(16);  // 128-bit IV
                }

                using (var ms = new MemoryStream())
                {
                    using (var cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        byte[] input = Encoding.UTF8.GetBytes(dataToEncrypt);
                        cs.Write(input, 0, input.Length);
                        cs.FlushFinalBlock();
                    }
                    return ms.ToArray();
                }
            }
        }
    }


}
