
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/my-todo-list2.html');
})

app.use(express.json()); // To handle JSON payloads

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server Error'});
})

const tasks = [
]; //in memory array to store tasks

try {
    const data = fs.readFileSync('tasks.json', 'utf8');
    tasks = JSON.parse(data);
} catch (error) {
    console.log('Error reading tasks from file:', error);
}
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

const validateTask = (req, res, next) => {
    const newTask = req.body;

    if (!newTask.title || !newTask.description) {
        return res.status(400).json({ error: 'Title and descritpion are required'});
    }

    next();
};

app.post('/tasks', validateTask,(req, res) => {
    const newTask = {id: Date.now(), ...req.body, checked: false };
    newTask.id = tasks.length + 1;
    tasks.push(newTask);
    saveTasks();
    res.status(201).json(newTask);
})

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const updateTask = req.body;

    //find the task by id
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        //undate the task
        tasks[taskIndex] = { ...tasks[taskIndex], ...updateTask };
        saveTasks();//Save updated tasks
        res.json(tasks[taskIndex]);

    } else {
        res.status(404).json({message: 'Task not found'});
    }
});

//gets the request to delete all
app.delete('/tasks', (req, res) => {
    tasks.length = 0;
    saveTasks();
    res.sendStatus(204);
})

//Get req to delete by id only
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);

    //find the task by id
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if(taskIndex !== -1) {
        //remove the task from the array
        tasks.splice(taskIndex, 1);
        saveTasks(); //save the updated tasks
        res.sendStatus(204);
    } else {
        res.status(404).json({ error: 'Task not found'});
    }
});

function saveTasks() {
    fs.writeFile('tasks.json', JSON.stringify(tasks), (err) => {
        if (err) {
            console.log('Error writing tasks to file', err);
        }
    });
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});