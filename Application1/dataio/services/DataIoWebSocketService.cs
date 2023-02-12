using System;
using System.ComponentModel;
using System.Threading.Tasks;
using SocketIOClient;

namespace Application1.dataio.services;

public class DataIoWebSocketService : IDataIoService
{
    private readonly SocketIO _socket;
    private bool _isConnectionInitialized;
    private string _clientId;

    public DataIoWebSocketService(string url)
    {
        _isConnectionInitialized = false;
        _clientId = "";
        _socket = new SocketIO(url);
        SetupSocketEventHandler();
    }

    private void SetupSocketEventHandler()
    {
        _socket.OnConnected += (_, _) =>
        {
            Console.WriteLine("[Socket IO] Connected");
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
            
        _socket.On("id", response =>
        {
            Console.WriteLine("[Socket IO] Id received");
            ClientId = $"Client Id: {response.GetValue<string>()}";
            IsConnectionInitialized = true;
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
}