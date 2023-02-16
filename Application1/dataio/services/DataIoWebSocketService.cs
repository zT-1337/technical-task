using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Threading.Tasks;
using Application1.dataio.dtos;
using SocketIOClient;

namespace Application1.dataio.services;

public class DataIoWebSocketService : IDataIoService
{
    private const string JoinMessage = "application1-join";
    private const string JoinSuccessMessage = "client-join-success";
    private const string SendInputMessage = "application1-input";
    private const string ReceivedOutputMessage = "application1-output";

    private readonly SocketIO _socket;
    private bool _isConnectionInitialized;
    private string _clientId;
    private string _authToken;

    public DataIoWebSocketService(string url)
    {
        _isConnectionInitialized = false;
        _clientId = "";
        _authToken = "";
        SentInputs = new ObservableCollection<string>();
        ReceivedOutputs = new ObservableCollection<OutputMessageDto>();
        _socket = new SocketIO(url);
        SetupSocketEventHandler();
    }

    private void SetupSocketEventHandler()
    {
        _socket.OnConnected += async (_, _) =>
        {
            Console.WriteLine("[Socket IO] Connected");
            await _socket.EmitAsync(JoinMessage);
        };

        _socket.OnDisconnected += (_, _) =>
        {
            Console.WriteLine("[Socket IO] Disconnected");
            IsConnectionInitialized = false;
            ClientId = "";
        };

        _socket.OnError += (_, eventArgs) =>
        {
            Console.WriteLine(eventArgs);
        };
            
        _socket.On(JoinSuccessMessage, async response =>
        {
            Console.WriteLine("[Socket IO] Id received");
            var joinData = response.GetValue<JoinSuccessDto>();
            if (joinData.ClientId == null || joinData.Auth == null)
            {
                Console.WriteLine("[Application1] missing client id or auth");
                await _socket.DisconnectAsync();
                return;
            }
            
            ClientId = $"Client Id: {joinData.ClientId}";
            _authToken = joinData.Auth;
            IsConnectionInitialized = true;
        });
        
        _socket.On(ReceivedOutputMessage, response =>
        {
            Console.WriteLine("[Socket.IO] Output received");
            ReceivedOutputs.Add(response.GetValue<OutputMessageDto>());
        });
    }

    public bool IsConnectionInitialized
    {
        get => _isConnectionInitialized;
        set
        {
            _isConnectionInitialized = value;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(IsConnectionInitialized)));
        }
    }

    public string ClientId
    {
        get => _clientId.Length == 0 ? "NOT CONNECTED" : _clientId;
        set
        {
            _clientId = value;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(ClientId)));
        }
    }
    
    public ObservableCollection<string> SentInputs { get; }
    public ObservableCollection<OutputMessageDto> ReceivedOutputs { get; }

    public event PropertyChangedEventHandler? PropertyChanged;
    
    public async Task Connect()
    {
        if (IsConnectionInitialized)
        {
            return;
        }
        
        await _socket.ConnectAsync();
    }

    public async Task Disconnect()
    {
        if (!IsConnectionInitialized)
        {
            return;
        }

        await _socket.DisconnectAsync();
    }

    public async Task SendInput(string input)
    {
        if (input.Length == 0)
        {
            return;
        }
        
        await _socket.EmitAsync(SendInputMessage, new InputMessageDto(input, _authToken));
        SentInputs.Add(input);
    }
}