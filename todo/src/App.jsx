import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, Box, Typography, Snackbar, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch("/src/assets/data.json")
            .then((response) => response.json())
            .then((data) => setTodos(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const [todoAdded, setTodoAdded] = useState(false);

    useEffect(() => {
        if (todoAdded) {
            setOpen(true);
            setTodoAdded(false);
        }
    }, [todoAdded]);

    const [lastAddedTask, setLastAddedTask] = useState("");

    const [priority, setPriority] = useState("medium");
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };
    const handleAddTodo = () => {
        if (inputValue.trim()) {
            setTodos([
                ...todos,
                { task: inputValue, priority: priority, isDone: false },
            ]);
            setLastAddedTask(inputValue);
            setInputValue("");
            setTodoAdded(true);
        }
    };
    const handleToggleTodo = (index) => {
        setTodos(
            todos.map((todo, i) =>
                i === index ? { ...todo, isDone: !todo.isDone } : todo
            )
        );
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box
                sx={{
                    minHeight: "100vh",
                    width: "100vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Container
                    maxWidth="md"
                    sx={{
                        py: 4,
                        width: "60%",
                        minWidth: "800px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        margin: "0 auto",
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        align="center"
                        fontWeight="bold"
                    >
                        NEXT Todo App
                    </Typography>
                    <TodoForm
                        inputValue={inputValue}
                        handleInputChange={handleInputChange}
                        handleAddTodo={handleAddTodo}
                        handlePriorityChange={handlePriorityChange}
                        priority={priority}
                    />
                    <TodoList
                        todos={todos}
                        handleToggleTodo={handleToggleTodo}
                    />
                    <Snackbar
                        open={open}
                        anchorOrigin={{
                            horizontal: "center",
                            vertical: "bottom",
                        }}
                        autoHideDuration={3000}
                        onClose={handleClose}
                    >
                        <Alert
                            onClose={handleClose}
                            severity="success"
                            variant="filled"
                            sx={{ width: "100%" }}
                        >
                            "{lastAddedTask}" 할 일이 추가되었습니다.
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;
