using System.Text.Json.Serialization;

namespace Application1.dataio.dtos;

public class JoinSuccessDto
{
    [JsonPropertyName("clientId")]
    public string? ClientId { get; set; }
    
    [JsonPropertyName("auth")]
    public string? Auth { get; set; }
}