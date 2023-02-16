using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Threading.Tasks;
using Application1.dataio.dtos;

namespace Application1.dataio.services;

public interface IDataIoService : INotifyPropertyChanged
{
    bool IsConnectionInitialized { get; }
    string ClientId { get; }
    ObservableCollection<string> SentInputs { get; }
    ObservableCollection<OutputMessageDto> ReceivedOutputs { get; }
    Task Connect();
    Task Disconnect();
    Task SendInput(string input);
}