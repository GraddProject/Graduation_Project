using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ServicesAbstraction.Common;
using Shared.DTos.MedicalTestDTos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Common
{
    //#region
    //public class GoogleCloudStorageService : IFileStorageService
    //{
    //    private readonly StorageClient _storageClient;
    //    private readonly string _bucketName;

    //    public GoogleCloudStorageService(IConfiguration configuration)
    //    {
    //        _bucketName = configuration["GoogleCloud:BucketName"]
    //            ?? throw new InvalidOperationException("GoogleCloud:BucketName is not configured.");

    //        var credentialsPath = configuration["GoogleCloud:CredentialsPath"]
    //            ?? throw new InvalidOperationException("GoogleCloud:CredentialsPath is not configured.");

    //        var credential = GoogleCredential.FromFile(credentialsPath);
    //        _storageClient = StorageClient.Create(credential);
    //    }

    //    public async Task<string> UploadFileAsync(IFormFile file, string objectName)
    //    {
    //        using var stream = file.OpenReadStream();

    //        await _storageClient.UploadObjectAsync(
    //            bucket: _bucketName,
    //            objectName: objectName,
    //            contentType: file.ContentType,
    //            source: stream);

    //        return objectName;
    //    }

    //    public async Task DeleteFileAsync(string objectName)
    //    {
    //        await _storageClient.DeleteObjectAsync(_bucketName, objectName);
    //    }

    //}

    //#endregion

    public class GoogleCloudStorageService : IFileStorageService
    {
        private readonly StorageClient _storageClient;
        private readonly string _bucketName;

        public GoogleCloudStorageService(IConfiguration configuration)
        {
            _bucketName = configuration["GoogleCloud:BucketName"]
                ?? throw new InvalidOperationException("GoogleCloud:BucketName is not configured.");

            var credentialsPath = configuration["GoogleCloud:CredentialsPath"];

            if (!string.IsNullOrWhiteSpace(credentialsPath) && File.Exists(credentialsPath))
            {
                var credential = Google.Apis.Auth.OAuth2.GoogleCredential.FromFile(credentialsPath);
                _storageClient = StorageClient.Create(credential);
            }
            else
            {
                _storageClient = StorageClient.Create();
            }
        }


        public async Task<string> UploadFileAsync(IFormFile file, string objectName)
        {
            using var stream = file.OpenReadStream();

            await _storageClient.UploadObjectAsync(
                bucket: _bucketName,
                objectName: objectName,
                contentType: file.ContentType,
                source: stream);

            return objectName;
        }

        public async Task DeleteFileAsync(string objectName)
        {
            await _storageClient.DeleteObjectAsync(_bucketName, objectName);
        }

        public async Task<MedicalTestFileDto> DownloadFileAsync(string objectName)
        {
            var storageObject = await _storageClient.GetObjectAsync(_bucketName, objectName);

            using var memoryStream = new MemoryStream();

            await _storageClient.DownloadObjectAsync(storageObject, memoryStream);

            return new MedicalTestFileDto
            {
                Content = memoryStream.ToArray(),
                ContentType = string.IsNullOrWhiteSpace(storageObject.ContentType)
                    ? "application/octet-stream"
                    : storageObject.ContentType
            };
        }
    }
}
