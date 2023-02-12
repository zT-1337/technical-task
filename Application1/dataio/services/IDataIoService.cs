using System.ComponentModel;
using System.Threading.Tasks;

namespace Application1.dataio.services;

public interface IDataIoService : INotifyPropertyChanged
{
    bool IsConnectionInitialized { get; }
    string ClientId { get; }
    Task Connect();
    Task Disconnect();
    Task SendInput(string input);
}