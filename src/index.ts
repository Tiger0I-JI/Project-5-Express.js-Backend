import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// In-memory data store 
type Todo = {
    id: number;
    title: string;
    completed: boolean;
};

let todos: Todo[] = [];
let nextId = 1;

// 1. CREATE (POST)
app.post('/todos', (req: Request, res: Response) => {
    const { title, completed } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: "Validation failed: 'title' is required and must be a string." });
    }

    const newTodo: Todo = {
        id: nextId++,
        title: title.trim(),
        completed: completed ?? false 
    };

    todos.push(newTodo); 
    res.status(201).json(newTodo); 
});

// 2. READ (GET)
app.get('/todos', (req: Request, res: Response) => {
    let result = todos;
    const { completed } = req.query; 

    if (completed !== undefined) {
        const isCompleted = completed === 'true';
        result = result.filter(todo => todo.completed === isCompleted); 
    }

    res.status(200).json(result); 
});

// 3. UPDATE (PATCH)
app.patch('/todos/:id', (req: Request, res: Response) => {
    const { id } = req.params; 
    const { title, completed } = req.body;

    if (title === undefined && completed === undefined) {
        return res.status(400).json({ error: "Validation failed: Please provide 'title' or 'completed' to update." });
    }

    const todoIndex = todos.findIndex(t => t.id === parseInt(id)); 

    if (todoIndex === -1) {
        return res.status(404).json({ error: "Todo not found." }); 
    }

    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: "Validation failed: 'title' must be a valid string." });
        }
        todos[todoIndex].title = title.trim();
    }

    if (completed !== undefined) {
        if (typeof completed !== 'boolean') {
            return res.status(400).json({ error: "Validation failed: 'completed' must be a boolean." });
        }
        todos[todoIndex].completed = completed;
    }

    res.status(200).json(todos[todoIndex]);
});

// 4. DELETE (DELETE)
app.delete('/todos/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex(t => t.id === parseInt(id));

    if (todoIndex === -1) {
        return res.status(404).json({ error: "Todo not found." });
    }

    const deletedTodo = todos.splice(todoIndex, 1); 
    res.status(200).json(deletedTodo[0]); 
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});