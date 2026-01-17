using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace CleanCity.Core.Services
{
    public static class InsecureHasher
    {
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
    }
}
