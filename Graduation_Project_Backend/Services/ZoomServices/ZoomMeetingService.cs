using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using ServicesAbstraction.ZoomAbstraction;
using Shared.DTos.ZoomDTos;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace Services.ZoomServices
{
    public class ZoomMeetingService : IZoomMeetingService
    {
        private const string AccessTokenCacheKey = "zoom:s2s:access-token";
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _memoryCache;
        private readonly ZoomOptions _options;

        public ZoomMeetingService(
            HttpClient httpClient,
            IMemoryCache memoryCache,
            IOptions<ZoomOptions> options)
        {
            _httpClient = httpClient;
            _memoryCache = memoryCache;
            _options = options.Value;
        }

        public async Task<ZoomMeetingResult> CreateMeetingAsync(
            string topic,
            DateTime startAt,
            TimeSpan duration,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(topic))
                topic = "HerJourney Online Session";

            if (duration.TotalMinutes <= 0)
                throw new ArgumentException("Meeting duration must be greater than zero.", nameof(duration));

            var accessToken = await GetAccessTokenAsync(cancellationToken);

            using var request = new HttpRequestMessage(
                HttpMethod.Post,
                $"https://api.zoom.us/v2/users/{Uri.EscapeDataString(_options.HostUserId)}/meetings");

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var payload = new
            {
                topic,
                type = 2,
                start_time = startAt.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ"),
                duration = (int)Math.Ceiling(duration.TotalMinutes),
                timezone = _options.Timezone,
                settings = new
                {
                    waiting_room = true,
                    join_before_host = false,
                    approval_type = 2,
                    mute_upon_entry = true,
                    participant_video = false,
                    host_video = true,
                    auto_recording = "none"
                }
            };

            request.Content = JsonContent.Create(payload);

            using var response = await _httpClient.SendAsync(request, cancellationToken);
            var body = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException($"Zoom create meeting failed. StatusCode: {(int)response.StatusCode}, Body: {body}");

            using var json = JsonDocument.Parse(body);
            return MapMeetingResult(json.RootElement, requireStartUrl: true);
        }

        public async Task<ZoomMeetingResult?> GetMeetingAsync(long meetingId, CancellationToken cancellationToken = default)
        {
            if (meetingId <= 0)
                return null;

            var accessToken = await GetAccessTokenAsync(cancellationToken);

            using var request = new HttpRequestMessage(
                HttpMethod.Get,
                $"https://api.zoom.us/v2/meetings/{meetingId}");

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            using var response = await _httpClient.SendAsync(request, cancellationToken);
            var body = await response.Content.ReadAsStringAsync(cancellationToken);

            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                return null;

            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException($"Zoom get meeting failed. StatusCode: {(int)response.StatusCode}, Body: {body}");

            using var json = JsonDocument.Parse(body);
            return MapMeetingResult(json.RootElement, requireStartUrl: false);
        }

        public async Task UpdateMeetingAsync(
            long meetingId,
            string topic,
            DateTime startAt,
            TimeSpan duration,
            CancellationToken cancellationToken = default)
        {
            if (meetingId <= 0)
                return;

            if (duration.TotalMinutes <= 0)
                throw new ArgumentException("Meeting duration must be greater than zero.", nameof(duration));

            var accessToken = await GetAccessTokenAsync(cancellationToken);

            using var request = new HttpRequestMessage(
                HttpMethod.Patch,
                $"https://api.zoom.us/v2/meetings/{meetingId}");

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var payload = new
            {
                topic = string.IsNullOrWhiteSpace(topic) ? "HerJourney Online Session" : topic,
                start_time = startAt.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ"),
                duration = (int)Math.Ceiling(duration.TotalMinutes),
                timezone = _options.Timezone,
                settings = new
                {
                    waiting_room = true,
                    join_before_host = false,
                    approval_type = 2,
                    mute_upon_entry = true,
                    participant_video = false,
                    host_video = true,
                    auto_recording = "none"
                }
            };

            request.Content = JsonContent.Create(payload);

            using var response = await _httpClient.SendAsync(request, cancellationToken);
            var body = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException($"Zoom update meeting failed. StatusCode: {(int)response.StatusCode}, Body: {body}");
        }

        public async Task DeleteMeetingAsync(long meetingId, CancellationToken cancellationToken = default)
        {
            if (meetingId <= 0)
                return;

            var accessToken = await GetAccessTokenAsync(cancellationToken);

            using var request = new HttpRequestMessage(
                HttpMethod.Delete,
                $"https://api.zoom.us/v2/meetings/{meetingId}?schedule_for_reminder=false&cancel_meeting_reminder=false");

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            using var response = await _httpClient.SendAsync(request, cancellationToken);
            var body = await response.Content.ReadAsStringAsync(cancellationToken);

            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                return;

            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException($"Zoom delete meeting failed. StatusCode: {(int)response.StatusCode}, Body: {body}");
        }

        private async Task<string> GetAccessTokenAsync(CancellationToken cancellationToken)
        {
            if (_memoryCache.TryGetValue<string>(AccessTokenCacheKey, out var cachedToken) &&
                !string.IsNullOrWhiteSpace(cachedToken))
            {
                return cachedToken;
            }

            var basicToken = Convert.ToBase64String(
                Encoding.UTF8.GetBytes($"{_options.ClientId}:{_options.ClientSecret}"));

            using var request = new HttpRequestMessage(
                HttpMethod.Post,
                $"https://zoom.us/oauth/token?grant_type=account_credentials&account_id={Uri.EscapeDataString(_options.AccountId)}");

            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", basicToken);

            using var response = await _httpClient.SendAsync(request, cancellationToken);
            var body = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
                throw new InvalidOperationException($"Zoom token request failed. StatusCode: {(int)response.StatusCode}, Body: {body}");

            using var json = JsonDocument.Parse(body);
            var accessToken = json.RootElement.GetProperty("access_token").GetString();
            var expiresIn = json.RootElement.TryGetProperty("expires_in", out var expiresInElement)
                ? expiresInElement.GetInt32()
                : 3600;

            if (string.IsNullOrWhiteSpace(accessToken))
                throw new InvalidOperationException("Zoom token response did not contain access_token.");

            _memoryCache.Set(
                AccessTokenCacheKey,
                accessToken,
                TimeSpan.FromSeconds(Math.Max(60, expiresIn - 120)));

            return accessToken;
        }

        private static ZoomMeetingResult MapMeetingResult(JsonElement root, bool requireStartUrl)
        {
            var id = root.TryGetProperty("id", out var idElement) && idElement.TryGetInt64(out var parsedId)
                ? parsedId
                : 0;

            var joinUrl = root.TryGetProperty("join_url", out var joinUrlElement)
                ? joinUrlElement.GetString()
                : null;

            var startUrl = root.TryGetProperty("start_url", out var startUrlElement)
                ? startUrlElement.GetString()
                : null;

            var password = root.TryGetProperty("password", out var passwordElement)
                ? passwordElement.GetString()
                : null;

            if (id <= 0)
                throw new InvalidOperationException("Zoom meeting response did not contain a valid id.");

            if (string.IsNullOrWhiteSpace(joinUrl))
                throw new InvalidOperationException("Zoom meeting response did not contain join_url.");

            if (requireStartUrl && string.IsNullOrWhiteSpace(startUrl))
                throw new InvalidOperationException("Zoom meeting response did not contain start_url.");

            return new ZoomMeetingResult
            {
                Id = id,
                JoinUrl = joinUrl!,
                StartUrl = startUrl ?? string.Empty,
                Password = password
            };
        }
    }
}
