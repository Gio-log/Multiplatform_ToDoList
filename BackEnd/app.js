const express = require('express');
const bodyParser = require('body-parser');

const { getStoredTasks, storeTasks } = require('./data/tasks');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    // Attach CORS headers
    // Required when using a detached backend (that runs on a different domain)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE,GET,PATCH,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//--------------------------------------------------------------------------------------------
// For Tasks
//--------------------------------------------------------------------------------------------
// Delete Task by ID
app.delete('/tasks/:id', async (req, res) => {
    const { storedIndex, storedTasks } = await getStoredTasks();

    // Ensure storedTasks is an array
    if (!Array.isArray(storedTasks)) {
        return res.status(500).json({ error: 'Stored tasks data is not an array' });
    }

    // Convert req.params.id to a number before comparing
    const taskId = parseInt(req.params.id, 10);
    const taskIndex = storedTasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Remove the task from the array
    storedTasks.splice(taskIndex, 1);

    // Save the updated tasks array back to storage
    await storeTasks(storedIndex, storedTasks);

    res.status(200).json({ message: 'Task deleted successfully' });
});

// Get All Tasks
app.get('/tasks', async (req, res) => {
    const {storedIndex , storedTasks} = await getStoredTasks();
    // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500)); //If you want waiting time during sending posts
    res.json({ tasks: storedTasks });
});

// Get Task by ID
app.get('/tasks/:id', async (req, res) => {
    const {storedIndex, storedTasks} = await getStoredTasks();

    // Ensure storedTasks is an array
    if (!Array.isArray(storedTasks)) {
        return res.status(500).json({ error: 'Stored tasks data is not an array' });
    }

    const taskId = parseInt(req.params.id, 10);
    const task = storedTasks.find((task) => task.id === taskId);
    
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ task });
});

// Update Task by ID
app.patch('/tasks/:id', async (req, res) => {
    const { storedIndex, storedTasks } = await getStoredTasks();

    // Ensure storedTasks is an array
    if (!Array.isArray(storedTasks)) {
        return res.status(500).json({ error: 'Stored tasks data is not an array' });
    }

    const taskId = parseInt(req.params.id, 10);
    const taskIndex = storedTasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = {
        ...storedTasks[taskIndex],
        ...req.body,
        id: taskId,
    };

    storedTasks[taskIndex] = updatedTask;

    // Save the updated tasks array back to storage
    await storeTasks(storedIndex, storedTasks);

    res.json({ message: 'Task updated successfully', task: updatedTask });
});

// Create a new Task
app.post('/tasks', async (req, res) => {
    const {storedIndex, storedTasks} = await getStoredTasks();
    const newIndex = storedIndex + 1;
    const taskData = req.body;

    // Validate the incoming data
    if (typeof taskData.name !== 'string' || taskData.name.trim() === '') {
        return res.status(400).json({ error: 'Task name is required and must be a non-empty string' });
    }

    if (typeof taskData.completed !== 'boolean') {
        return res.status(400).json({ error: 'Task completed status must be a boolean' });
    }

    const newTask = {
    name: taskData.name.trim(),
    completed: taskData.completed,
    id: newIndex,
    };
    const updatedTasks = [newTask, ...storedTasks];
    await storeTasks(newIndex, updatedTasks);
    res.status(201).json({ message: 'Stored new task', task: newTask });
});
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//  For Posts
//--------------------------------------------------------------------------------------------
// Delete Post by ID
app.delete('/posts/:id', async (req, res) => {
    const { storedIndex, storedPosts } = await getStoredPosts();

    // Ensure storedPosts is an array
    if (!Array.isArray(storedPosts)) {
        return res.status(500).json({ error: 'Stored posts data is not an array' });
    }

    // Convert req.params.id to a number before comparing
    const postId = parseInt(req.params.id, 10);
    const postIndex = storedPosts.findIndex((post) => post.id === postId);

    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    // Remove the post from the array
    storedPosts.splice(postIndex, 1);

    // Save the updated posts array back to storage
    // await saveStoredPosts({ storedIndex, storedPosts });
    await storePosts(storedIndex, storedPosts);

    res.status(200).json({ message: 'Post deleted successfully' });
});

// Get All Posts
app.get('/posts', async (req, res) => {
    const {storedIndex , storedPosts} = await getStoredPosts();
    // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500)); //If you want waiting time during sending posts
    res.json({ posts: storedPosts });
});

// Get Post by ID
app.get('/posts/:id', async (req, res) => {
    const {storedIndex, storedPosts} = await getStoredPosts();

    // Ensure storedPosts is an array
    if (!Array.isArray(storedPosts)) {
        return res.status(500).json({ error: 'Stored posts data is not an array' });
    }

    const postId = parseInt(req.params.id, 10);
    const post = storedPosts.find((post) => post.id === postId);
    
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ post });
});

// Create a new Post
app.post('/posts', async (req, res) => {
    const {storedIndex, storedPosts} = await getStoredPosts();
    const newIndex = storedIndex + 1;
    const postData = req.body;
    const newPost = {
    ...postData,
    id: newIndex,
    };
    const updatedPosts = [newPost, ...storedPosts];
    await storePosts(newIndex, updatedPosts);
    res.status(201).json({ message: 'Stored new post.', post: newPost });
});

//Update Post by ID
app.put('/posts/:id', async (req, res) => {
    const { storedIndex, storedPosts } = await getStoredPosts();

    // Ensure storedPosts is an array
    if (!Array.isArray(storedPosts)) {
        return res.status(500).json({ error: 'Stored posts data is not an array' });
    }

    const postId = parseInt(req.params.id, 10);
    const postIndex = storedPosts.findIndex((post) => post.id === postId);

    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const updatedPost = {
        ...storedPosts[postIndex],
        ...req.body,
        id: postId,
    };

    storedPosts[postIndex] = updatedPost;

    // Save the updated posts array back to storage
    await storePosts(storedIndex, storedPosts);

    res.json({ message: 'Post updated successfully', post: updatedPost });
}); 

//--------------------------------------------------------------------------------------------

// Start the server on chosen port
app.listen(8080);
