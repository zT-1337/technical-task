using System.ComponentModel;
using Application1.dataio.services;

namespace Application1.dataio.viewmodels;

public class MainWindowViewModel : INotifyPropertyChanged
{
    public static MainWindowViewModel buildWithWebSocketService()
    {
        return new MainWindowViewModel(new DataIoWebSocketService("http://localhost:3000/"));
    }
    
    public MainWindowViewModel(IDataIoService dataIOService)
    {
        DataIoService = dataIOService;
    }

    public IDataIoService DataIoService { get; }

    public event PropertyChangedEventHandler? PropertyChanged;
}