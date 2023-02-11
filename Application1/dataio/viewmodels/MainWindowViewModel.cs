using System.ComponentModel;

namespace Application1.dataio.viewmodels;

public class MainWindowViewModel : INotifyPropertyChanged
{
    public MainWindowViewModel()
    {
        ClientId = "NOT CONNECTED";
    }

    public string ClientId { get; }

    public event PropertyChangedEventHandler? PropertyChanged;
}