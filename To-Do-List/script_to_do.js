document.addEventListener("DOMContentLoaded", loadTodoLists);

// Load to-do list from localStorage
function loadTodoLists() {
    const storedLists = JSON.parse(localStorage.getItem("todoLists")) || [];
    storedLists.forEach((list) => {
        const todoListContainer = createTodoList(list.title, false);
        list.items.forEach((item) => {
            addTodo(todoListContainer, item.text, item.completed);
        });
    });
}

// Create and (optionally) save a new to-do list
function createTodoList(title = "", save = true) {
    const titleInput = document.getElementById("list-title-input");
    const titleText = title || titleInput.value.trim();

    if (titleText === "") {
        alert("Please enter a list title!");
        return;
    }

    const todoListsContainer = document.getElementById("todo-lists-container");

    const todoListContainer = document.createElement("div");
    todoListContainer.classList.add("todo-list-container");

    const todoListTitle = document.createElement("h2");
    todoListTitle.classList.add("todo-list-title");
    todoListTitle.textContent = titleText;

    // Button to delete the entire to-do list
    const deleteListBtn = document.createElement("button");
    deleteListBtn.classList.add("delete-list-btn");
    deleteListBtn.innerHTML = "&times;";
    deleteListBtn.onclick = function () {
        deleteTodoList(todoListContainer);
    };

    todoListTitle.appendChild(deleteListBtn);

    const inputContainer = document.createElement("div");
    inputContainer.classList.add("input-container");

    const todoInput = document.createElement("input");
    todoInput.type = "text";
    todoInput.placeholder = "Add new task...";
    todoInput.classList.add("todo-input");

    const addTodoButton = document.createElement("button");
    addTodoButton.textContent = "Add";
    addTodoButton.onclick = function () {
        addTodo(todoListContainer);
    };

    inputContainer.appendChild(todoInput);
    inputContainer.appendChild(addTodoButton);

    const todoList = document.createElement("ul");
    todoList.classList.add("todo-list");

    todoListContainer.appendChild(todoListTitle);
    todoListContainer.appendChild(inputContainer);
    todoListContainer.appendChild(todoList);
    todoListsContainer.appendChild(todoListContainer);

    if (save) saveTodoLists();

    titleInput.value = "";
    return todoListContainer;
}

// Add task and optionally save
function addTodo(todoListContainer, text = "", completed = false) {
    const todoInput = todoListContainer.querySelector(".todo-input");
    const todoText = text || todoInput.value.trim();

    if (todoText === "") {
        alert("Please enter a text for the task!");
        return;
    }

    const todoList = todoListContainer.querySelector("ul");
    const todoItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = completed;
    checkbox.onchange = toggleComplete;

    const todoTextSpan = document.createElement("span");
    todoTextSpan.classList.add("todo-text");
    todoTextSpan.textContent = todoText;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = "&times;";
    deleteBtn.onclick = deleteTodo;

    todoItem.appendChild(checkbox);
    todoItem.appendChild(todoTextSpan);
    todoItem.appendChild(deleteBtn);
    todoList.appendChild(todoItem);

    if (completed) {
        todoItem.classList.add("completed");
    }

    if (!text) saveTodoLists();

    todoInput.value = "";
}

// Mark task as completed and save
function toggleComplete(event) {
    const todoItem = event.target.parentElement;
    todoItem.classList.toggle("completed", event.target.checked);
    saveTodoLists();
}

// Delete and save task
function deleteTodo(event) {
    const todoItem = event.target.parentElement;
    todoItem.remove();
    saveTodoLists();
}

// Delete and save to-do list
function deleteTodoList(todoListContainer) {
    todoListContainer.remove();
    saveTodoLists();
}

// Save to-do lists and tasks in localStorage
function saveTodoLists() {
    const todoListsContainer = document.getElementById("todo-lists-container");
    const lists = [];

    todoListsContainer.querySelectorAll(".todo-list-container").forEach((listContainer) => {
        const title = listContainer.querySelector(".todo-list-title").firstChild.textContent.trim();
        const items = [];
        listContainer.querySelectorAll("li").forEach((item) => {
            const text = item.querySelector(".todo-text").textContent;
            const completed = item.querySelector(".todo-checkbox").checked;
            items.push({ text, completed });
        });
        lists.push({ title, items });
    });

    localStorage.setItem("todoLists", JSON.stringify(lists));
}
