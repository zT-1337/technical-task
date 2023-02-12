using Application1.dataio.viewmodels;
using Avalonia.Controls;

namespace Application1.dataio.views;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
        DataContext = MainWindowViewModel.BuildWithWebSocketService();
    }
}