class TodoApp {
            constructor() {
                // Store DOM elements
                this.todoInput = document.getElementById('todo-input');
                this.addButton = document.getElementById('add-button');
                this.todoList = document.getElementById('todo-list');
                this.emptyMessage = document.getElementById('empty-message');
                
                // Array to store todo items
                this.todos = [];
                
                // Setup event listeners
                this.addEventListeners();
                
                // Load saved todos and render them
                this.loadTodos();
                this.renderTodos();
            }
            
            // Set up event listeners
            addEventListeners() {
                // Add button click event
                this.addButton.addEventListener('click', () => {
                    this.addTodo();
                });
                
                // Enter key press in input field
                this.todoInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.addTodo();
                    }
                });
            }
            
            // Add a new todo
            addTodo() {
                const text = this.todoInput.value.trim();
                
                if (text !== '') {
                    // Create new todo object
                    const todo = {
                        id: Date.now(), // Use timestamp as unique ID
                        text: text,
                        completed: false
                    };
                    
                    // Add to array
                    this.todos.push(todo);
                    
                    // Clear input
                    this.todoInput.value = '';
                    
                    // Save and render
                    this.saveTodos();
                    this.renderTodos();
                }
            }
            
            // Delete a todo
            deleteTodo(id) {
                // Filter out the todo with matching id
                this.todos = this.todos.filter(todo => todo.id !== id);
                this.saveTodos();
                this.renderTodos();
            }
            
            // Toggle completion status
            toggleComplete(id) {
                // Find and update the todo with matching id
                this.todos = this.todos.map(todo => {
                    if (todo.id === id) {
                        // Create a new object with toggled completed property
                        return {
                            ...todo,
                            completed: !todo.completed
                        };
                    }
                    return todo;
                });
                
                this.saveTodos();
                this.renderTodos();
            }
            
            // Edit a todo
            editTodo(id) {
                // Find the todo item to edit
                const todoItem = document.querySelector(`[data-id="${id}"]`);
                const todoText = todoItem.querySelector('.todo-text');
                
                // Get current text
                const currentText = todoText.textContent;
                
                // Clear the todo item content
                todoItem.innerHTML = '';
                
                // Create input field and buttons
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentText;
                input.style.flex = '1';
                input.style.padding = '5px';
                input.style.marginRight = '5px';
                
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                saveButton.className = 'save-btn';
                
                // Add elements to todo item
                todoItem.appendChild(input);
                todoItem.appendChild(saveButton);
                
                // Focus on input
                input.focus();
                
                // Save button event
                saveButton.addEventListener('click', () => {
                    this.saveTodoEdit(id, input.value.trim());
                });
                
                // Enter key event
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.saveTodoEdit(id, input.value.trim());
                    }
                });
            }
            
            // Save edited todo
            saveTodoEdit(id, newText) {
                if (newText !== '') {
                    // Find and update the todo with new text
                    this.todos = this.todos.map(todo => {
                        if (todo.id === id) {
                            return {
                                ...todo,
                                text: newText
                            };
                        }
                        return todo;
                    });
                    
                    this.saveTodos();
                }
                this.renderTodos();
            }
            
            // Save todos to localStorage
            saveTodos() {
                localStorage.setItem('todos', JSON.stringify(this.todos));
            }
            
            // Load todos from localStorage
            loadTodos() {
                const savedTodos = localStorage.getItem('todos');
                if (savedTodos) {
                    this.todos = JSON.parse(savedTodos);
                }
            }
            
            // Render todos in the list
            renderTodos() {
                // Clear list
                this.todoList.innerHTML = '';
                
                // Show empty message if no todos
                if (this.todos.length === 0) {
                    this.emptyMessage.style.display = 'block';
                } else {
                    this.emptyMessage.style.display = 'none';
                    
                    // Loop through todos and create elements
                    for (const todo of this.todos) {
                        // Create todo item
                        const todoItem = document.createElement('li');
                        todoItem.className = 'todo-item';
                        todoItem.dataset.id = todo.id;
                        
                        // Create text element
                        const todoText = document.createElement('span');
                        todoText.className = 'todo-text';
                        todoText.textContent = todo.text;
                        
                        // Add completed class if needed
                        if (todo.completed) {
                            todoText.classList.add('completed');
                        }
                        
                        // Create checkbox
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.checked = todo.completed;
                        checkbox.addEventListener('change', () => {
                            this.toggleComplete(todo.id);
                        });
                        
                        // Create buttons
                        const editButton = document.createElement('button');
                        editButton.textContent = 'Edit';
                        editButton.className = 'edit-btn';
                        editButton.addEventListener('click', () => {
                            this.editTodo(todo.id);
                        });
                        
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.className = 'delete-btn';
                        deleteButton.addEventListener('click', () => {
                            this.deleteTodo(todo.id);
                        });
                        
                        // Add elements to todo item
                        todoItem.appendChild(checkbox);
                        todoItem.appendChild(todoText);
                        todoItem.appendChild(editButton);
                        todoItem.appendChild(deleteButton);
                        
                        // Add todo item to list
                        this.todoList.appendChild(todoItem);
                    }
                }
            }
        }
        
        // Initialize app when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            const app = new TodoApp();
        });
