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
    // ReSharper disable once MemberCanBePrivate.Global
    public string Input { get; }
    
    [JsonPropertyName("auth")]
    // ReSharper disable once UnusedAutoPropertyAccessor.Global
    public string Auth { get; }
}