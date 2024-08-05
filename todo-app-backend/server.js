
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // To handle JSON payloads

app.get('/',async (req, res) => {
    res.send( await readFile('./my-todo-list2.html', 'utf8'))
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});