using Microsoft.AspNetCore.Http;
using Shared.DTos.MedicalTestDTos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction.Common
{
    public interface IFileStorageService
    {
        //Task<string> UploadFileAsync(IFormFile file, string objectName);
        //Task DeleteFileAsync(string objectName);
        Task<string> UploadFileAsync(IFormFile file, string objectName);
        Task DeleteFileAsync(string objectName);
        Task<MedicalTestFileDto> DownloadFileAsync(string objectName);

        Task<string?> GenerateReadUrlAsync(string? objectName, TimeSpan? duration = null);
    }
}
