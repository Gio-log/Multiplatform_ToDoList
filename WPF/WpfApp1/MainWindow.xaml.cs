using System.Net.Http;
using System.Net.Http.Json;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Xml.Linq;
using Newtonsoft.Json;
using WpfApp1.Models;

namespace WpfApp1
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            readAllTasks();
            InitializeComponent();
        }
        
        
        private async void readAllTasks()
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = await client.GetAsync("http://localhost:8080/tasks");
                    string json;
                    response.EnsureSuccessStatusCode();
                    json = await response.Content.ReadAsStringAsync();

                    var wrapper = JsonConvert.DeserializeObject<JsonWrapper>(json);
                    var tasks = wrapper.Tasks;

                    TasksList.ItemsSource = tasks;
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            readAllTasks();
        }
        public class JsonWrapper
        {
            [JsonProperty("tasks")]
            public List<TaskItem> Tasks { get; set; }
        }
        public class TaskItem
        {
            [JsonProperty("name")]
            public string Name { get; set; }

            [JsonProperty("completed")]
            public bool Completed { get; set; }

            [JsonProperty("id")]
            public int Id { get; set; }
        }

        private async void Button_Click_1(object sender, RoutedEventArgs e)
        {
            if (String.IsNullOrEmpty(Task_add.Text))
            {
                MessageBox.Show(this, "Please enter data.", "Message", MessageBoxButton.OK);
                return;
            }
            else
            {
                using (HttpClient client = new HttpClient())
                {
                    var task = new TaskCreateDTO()
                    {
                        name = Task_add.Text,
                        completed = false
                    };
                    string message = string.Empty;

                    try
                    {
                        HttpResponseMessage response = await client.PostAsJsonAsync("http://localhost:8080/tasks", task);
                        response.EnsureSuccessStatusCode();
                        message = await response.Content.ReadAsStringAsync();
                    }
                    catch (Exception ex)
                    {
                        message = ex.Message;
                    }
                }
                readAllTasks();
            }
        }
        public TaskDTO ConvertToTaskDTO(TaskItem taskItem)
        {
            return new TaskDTO
            {
                Id = taskItem.Id,
                name = taskItem.Name,
                completed = taskItem.Completed
            };
        }

        private void TasksList_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            if (TasksList.SelectedItem != null)
            {
                TaskItem selectedTaskItem = (TaskItem)TasksList.SelectedItem;

                TaskDTO taskDTO = ConvertToTaskDTO(selectedTaskItem);

                var detailsWindow = new DlgTask(taskDTO);
                detailsWindow.ShowDialog();
            }
        }
    }
}