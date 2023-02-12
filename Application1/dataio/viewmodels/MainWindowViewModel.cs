using System.ComponentModel;
using System.Threading.Tasks;
using Application1.dataio.services;

namespace Application1.dataio.viewmodels;

public class MainWindowViewModel : INotifyPropertyChanged
{
    public static MainWindowViewModel buildWithWebSocketService()
    {
        return new MainWindowViewModel(new DataIoWebSocketService("http://localhost:3000/"));
    }

    private string _inputField;
    
    public MainWindowViewModel(IDataIoService dataIOService)
    {
        DataIoService = dataIOService;
    }

    public IDataIoService DataIoService { get; }

    public string InputField
    {
        get => _inputField;
        set
        {
            _inputField = value;
            PropertyChanged.Invoke(this, new PropertyChangedEventArgs(nameof(InputField)));
        }
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    public async Task SendInputField()
    {
        await DataIoService.SendInput(InputField);
        InputField = "";
    }
}