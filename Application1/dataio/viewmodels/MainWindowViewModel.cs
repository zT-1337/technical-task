using System.ComponentModel;
using Application1.dataio.services;

namespace Application1.dataio.viewmodels;

public class MainWindowViewModel : INotifyPropertyChanged
{
    public static MainWindowViewModel BuildWithWebSocketService()
    {
        return new MainWindowViewModel(new DataIoWebSocketService("http://localhost:3000/"));
    }

    private string _inputField;

    private MainWindowViewModel(IDataIoService dataIoService)
    {
        DataIoService = dataIoService;
        _inputField = "";
    }

    public IDataIoService DataIoService { get; }

    public string InputField
    {
        get => _inputField;
        set
        {
            _inputField = value;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(InputField)));
        }
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    public async void SendInputField()
    {
        await DataIoService.SendInput(InputField);
        InputField = "";
    }
}