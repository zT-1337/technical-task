using System.Text.Json.Serialization;

namespace Application1.dataio.dtos;

public class OutputMessageDto
{
    [JsonPropertyName("output")]
    public string? Output { get; set; }
    
    [JsonPropertyName("senderId")]
    public string? SenderId { get; set; }

    public override string ToString()
    {
        return $"From: {SenderId} Output: {Output}";
    }
}