using System.Text.Json.Serialization;

namespace Application1.dataio.dtos;

public class InputMessageDto
{
    public InputMessageDto(string input, string auth)
    {
        Input = input;
        Auth = auth;
    }

    [JsonPropertyName("input")]
    public string Input { get; }
    
    [JsonPropertyName("auth")]
    public string Auth { get; }
}