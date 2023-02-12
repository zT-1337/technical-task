using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Threading.Tasks;

namespace Application1.dataio.services;

public interface IDataIoService : INotifyPropertyChanged
{
    bool IsConnectionInitialized { get; }
    string ClientId { get; }
    ObservableCollection<string> SuccessfullySentInputs { get; }
    Task Connect();
    Task Disconnect();
    Task SendInput(string input);
}