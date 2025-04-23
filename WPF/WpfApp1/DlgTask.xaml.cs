using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using WpfApp1.Models;

namespace WpfApp1
{
    /// <summary>
    /// Logika interakcji dla klasy DlgTask.xaml
    /// </summary>
    public partial class DlgTask : Window
    {
        public DlgTask(TaskDTO task)
        {
            InitializeComponent();
            Task_Id.Text = (task.Id).ToString();
            Task_name.Text = task.name;
            Task_completion.IsChecked = task.completed;
        }
        public TaskCreateDTO Task { get; set; }
        private bool Check()
        {
            var checkBox = Task_completion;  // Assuming this is the CheckBox in your form
            if (checkBox != null)
            {
                bool? isChecked = checkBox.IsChecked;
                if (isChecked.HasValue)
                {
                    return isChecked.Value;  // Return the current state of the checkbox
                }
            }
            return false;  // Default to false if the checkbox is not checked
        }

        private async void btnUpdateTask_Click(object sender, RoutedEventArgs e)
        {
            String message = "Success";

            bool isCompleted = Check();

            var task = new TaskDTO()
            {
                Id = int.Parse(Task_Id.Text),
                name = Task_name.Text,
                completed = isCompleted
            };

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var content = new StringContent(
                        Newtonsoft.Json.JsonConvert.SerializeObject(task),
                        Encoding.UTF8,
                        "application/json"
                    );

                    HttpResponseMessage response = await client.PatchAsync(
                        $"http://localhost:8080/tasks/{int.Parse(Task_Id.Text)}", content
                    );

                    // Handle response and check for success
                    if (response.IsSuccessStatusCode)
                    {
                        message = "Task updated successfully!";
                    }
                    else
                    {
                        string responseMessage = await response.Content.ReadAsStringAsync();
                        message = $"Failed to update task: {responseMessage}";
                    }
                }
                catch (Exception ex)
                {
                    message = ex.Message;
                }
            }

            // Show the result message
            MessageBox.Show(this, message, "Message", MessageBoxButton.OK);

            DialogResult = true;
        }
        private async void btnDeletaTask_Click(object sender, RoutedEventArgs e)
        {
            string message = string.Empty;
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = await client.DeleteAsync($"http://localhost:8080/tasks/{int.Parse(Task_Id.Text)}");
                    response.EnsureSuccessStatusCode();

                    message = await response.Content.ReadAsStringAsync();
                }
                catch (Exception ex)
                {
                    message = ex.Message;
                }
            }

        }
    }
}
