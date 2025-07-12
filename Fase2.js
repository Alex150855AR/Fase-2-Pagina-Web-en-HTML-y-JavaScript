/* Datos de usuarios válidos */
const users = [
    { username: "Alex Aparicio", password: "Romero1508" },
    { username: "Natalia Perez", password: "Natalia1409" }
];

let currentUser = null;
// Se inicializa con datos de ejemplo para pruebas y depuración
let tasks = [
    {
        code: "T001",
        title: "Desarrollar módulo de login",
        description: "Implementar autenticación de usuarios y sesión.",
        startDate: "01-07-2025",
        clientName: "Cliente A",
        projectId: "PROJ001",
        comments: "Reunión inicial con el cliente el 28-06-2025.",
        status: "En progreso"
    },
    {
        code: "T002",
        title: "Diseñar base de datos",
        description: "Definir esquemas para usuarios y tareas.",
        startDate: "02-07-2025",
        clientName: "Cliente B",
        projectId: "PROJ002",
        comments: "Esperando confirmación de requisitos.",
        status: "Por hacer"
    },
    {
        code: "T003",
        title: "Revisión de código",
        description: "Revisar la calidad del código del módulo de reportes.",
        startDate: "05-07-2025",
        clientName: "Cliente A",
        projectId: "PROJ001",
        comments: "[10-07-2025 10:30] Se encontraron algunos bugs menores.\n---\n[11-07-2025 09:00] Bugs corregidos, listo para pruebas.",
        status: "En pruebas de calidad"
    },
    {
        code: "T004",
        title: "Implementar pasarela de pago",
        description: "Integración con Stripe para pagos en línea.",
        startDate: "03-07-2025",
        clientName: "Cliente C",
        projectId: "PROJ003",
        comments: "Pendiente de credenciales de API.",
        status: "Cancelado"
    }
];

// Array de opciones de estatus para los selects
const statusOptions = [
    "Por hacer",
    "En progreso",
    "Rechazado",
    "Cancelado",
    "Cerrado",
    "En pruebas de calidad",
    "En validación por el usuario",
    "En proceso de liberación"
];

/**
 * Determina si el estatus de una tarea indica que debe ser tachada.
 * @param {string} status - El estatus de la tarea.
 * @returns {boolean} True si la tarea debe ser tachada, false en caso contrario.
 */
function shouldBeCrossedOut(status) {
    try {
        return ["Cancelado", "Rechazado", "Cerrado"].includes(status);
    } catch (error) {
        console.error("Error en shouldBeCrossedOut:", error);
        return false; // Fallback seguro
    }
}

/**
 * Maneja el proceso de inicio de sesión.
 */
function login() {
    try {
        const usernameInput = document.getElementById("username").value.trim();
        const passwordInput = document.getElementById("password").value.trim();
        const loginError = document.getElementById("login-error");
        const loginSection = document.getElementById("login-section");
        const mainContent = document.getElementById("main-content");
        const welcomeMessage = document.getElementById("welcome-message");

        const foundUser = users.find(user => user.username === usernameInput && user.password === passwordInput);

        if (foundUser) {
            currentUser = foundUser.username;
            loginSection.classList.add("hidden");
            
            // Restaura estilos del cuerpo
            document.body.style.display = "block"; // Cambiado de "flex" a "block" para el contenido principal
            document.body.style.justifyContent = "initial"; // Eliminado
            document.body.style.alignItems = "initial"; // Eliminado
            document.body.style.minHeight = "initial"; // Eliminado (de 90vh a initial)
            // Se elimina la manipulación de body.classList.add("logged-in")

            mainContent.classList.remove("hidden");
            welcomeMessage.textContent = `Bienvenido, ${currentUser}`;
            loginError.classList.add("hidden");
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            renderTasksTable(); // Renderiza la tabla al iniciar sesión
            filterTasksByStatus(); // Aplica el filtro inicial
        } else {
            loginError.textContent = "Error de autenticación. Verifica tus credenciales.";
            loginError.classList.remove("hidden");
            console.warn("Intento de inicio de sesión fallido para:", usernameInput);
        }
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        document.getElementById("login-error").textContent = "Ocurrió un error inesperado al iniciar sesión.";
        document.getElementById("login-error").classList.remove("hidden");
    }
}

/**
 * Cierra la sesión del usuario actual.
 */
function logout() {
    try {
        currentUser = null;
        document.getElementById("main-content").classList.add("hidden");
        document.getElementById("login-section").classList.remove("hidden");

        // Restaura estilos del cuerpo a como estaban antes de login, como en image_7a05e1.png
        document.body.style.display = "flex";
        document.body.style.justifyContent = "center";
        document.body.style.alignItems = "center";
        document.body.style.minHeight = "90vh";
        // Se elimina la manipulación de body.classList.remove("logged-in")

        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        document.getElementById("login-error").classList.add("hidden");
        document.getElementById("edit-task-section").classList.add("hidden"); // Oculta la sección de edición
        console.log("Sesión cerrada.");
    } catch (error) {
        console.error("Error durante el cierre de sesión:", error);
    }
}

/**
 * Inicia sesión si se presiona Enter en el campo de contraseña.
 * @param {KeyboardEvent} event - El evento del teclado.
 */
function checkEnter(event) {
    try {
        if (event.key === "Enter") {
            login();
        }
    } catch (error) {
        console.error("Error en checkEnter:", error);
    }
}

/**
 * Obtiene la fecha y hora actual formateada como "DD-MM-AAAA HH:MM".
 * @returns {string} La fecha y hora formateada.
 */
function getFormattedDateTime() {
    try {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error("Error en getFormattedDateTime:", error);
        return "Fecha inválida";
    }
}

/**
 * Formatea una cadena de fecha de 'AAAA-MM-DD' a 'DD-MM-AAAA'.
 * @param {string} dateString - La fecha en formato 'AAAA-MM-DD'.
 * @returns {string} La fecha formateada en 'DD-MM-AAAA'.
 */
function formatDate(dateString) {
    try {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    } catch (error) {
        console.error("Error en formatDate:", error);
        return "Fecha inválida";
    }
}

/**
 * Desformatea una cadena de fecha de 'DD-MM-AAAA' a 'AAAA-MM-DD' para input type="date".
 * @param {string} dateString - La fecha en formato 'DD-MM-AAAA'.
 * @returns {string} La fecha desformateada en 'AAAA-MM-DD'.
 */
function unformatDate(dateString) {
    try {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error("Error en unformatDate:", error);
        return ""; // Devuelve cadena vacía para evitar errores en input date
    }
}

/**
 * Renderiza todas las tareas en la tabla.
 */
function renderTasksTable() {
    try {
        const tableBody = document.querySelector("#tasks-table tbody");
        tableBody.innerHTML = ""; // Limpia la tabla antes de renderizar
        tasks.forEach(task => addTaskToTable(task));
    } catch (error) {
        console.error("Error al renderizar la tabla de tareas:", error);
    }
}

/**
 * Agrega una nueva fila a la tabla de tareas.
 * @param {object} task - El objeto de la tarea a agregar.
 */
function addTaskToTable(task) {
    try {
        const tableBody = document.querySelector("#tasks-table tbody");
        const newRow = tableBody.insertRow();
        newRow.dataset.taskCode = task.code; // Almacena el código de la tarea en la fila

        if (shouldBeCrossedOut(task.status)) {
            newRow.classList.add("task-crossed-out");
        }

        newRow.insertCell().textContent = task.code;
        newRow.insertCell().textContent = task.title;
        newRow.insertCell().textContent = task.description;
        newRow.insertCell().textContent = task.startDate;
        newRow.insertCell().textContent = task.clientName;
        newRow.insertCell().textContent = task.projectId;
        newRow.insertCell().textContent = task.comments;
        
        const statusCell = newRow.insertCell();
        const statusSelect = document.createElement("select");
        statusSelect.className = "status-select";
        statusSelect.dataset.taskCode = task.code;
        statusSelect.onchange = (event) => updateStatusDirectly(event.target.dataset.taskCode, event.target.value, newRow);

        statusOptions.forEach(optionText => {
            const option = document.createElement("option");
            option.value = optionText;
            option.textContent = optionText;
            if (optionText === task.status) {
                option.selected = true;
            }
            statusSelect.appendChild(option);
        });
        statusCell.appendChild(statusSelect);
    } catch (error) {
        console.error("Error al agregar tarea a la tabla:", error, "Tarea:", task);
    }
}

/**
 * Actualiza el estatus de una tarea directamente desde el select de la tabla.
 * @param {string} taskCode - El código de la tarea.
 * @param {string} newStatus - El nuevo estatus.
 * @param {HTMLTableRowElement} rowElement - El elemento de la fila de la tabla.
 */
function updateStatusDirectly(taskCode, newStatus, rowElement) {
    try {
        const taskIndex = tasks.findIndex(task => task.code === taskCode);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = newStatus;
            console.log(`Task ${taskCode} status updated to: ${newStatus}`);
            
            if (shouldBeCrossedOut(newStatus)) {
                rowElement.classList.add("task-crossed-out");
            } else {
                rowElement.classList.remove("task-crossed-out");
            }
            filterTasksByStatus(); // Re-aplica el filtro después del cambio de estatus
        } else {
            console.warn(`No se encontró la tarea con código ${taskCode} para actualizar el estatus.`);
        }
    } catch (error) {
        console.error("Error en updateStatusDirectly:", error, "TaskCode:", taskCode, "New Status:", newStatus);
    }
}

/* Event listener para el envío del formulario de tareas */
document.getElementById("task-form").addEventListener("submit", function(event) {
    try {
        event.preventDefault();

        const formError = document.getElementById("form-error");
        const taskCode = document.getElementById("task-code").value.trim();
        const taskTitle = document.getElementById("task-title").value.trim();
        const taskDescription = document.getElementById("task-description").value.trim();
        const startDate = document.getElementById("start-date").value;
        const clientName = document.getElementById("client-name").value.trim();
        const projectId = document.getElementById("project-id").value.trim();
        const comments = document.getElementById("comments").value.trim();
        const status = document.getElementById("status").value; // Siempre "Por hacer" al crear

        /* Validación de campos vacíos */
        if (!taskCode || !taskTitle || !taskDescription || !startDate || !clientName || !projectId) {
            formError.textContent = "Por favor, completa todos los campos obligatorios.";
            formError.classList.remove("hidden");
            return;
        }

        // Verifica si el código de tarea ya existe
        if (tasks.some(task => task.code === taskCode)) {
            formError.textContent = "El código de tarea ya existe. Por favor, usa un código diferente.";
            formError.classList.remove("hidden");
            return;
        }

        formError.classList.add("hidden");

        const formattedStartDate = formatDate(startDate);

        const newTask = {
            code: taskCode,
            title: taskTitle,
            description: taskDescription,
            startDate: formattedStartDate,
            clientName: clientName,
            projectId: projectId,
            comments: comments,
            status: status
        };

        tasks.push(newTask);
        addTaskToTable(newTask);
        filterTasksByStatus(); // Aplica el filtro después de agregar nueva tarea

        document.getElementById("task-form").reset();
        document.getElementById("status").value = "Por hacer"; // Asegura que el estatus por defecto se mantenga
        console.log("Nueva tarea registrada:", newTask);
    } catch (error) {
        console.error("Error al registrar nueva tarea:", error);
        document.getElementById("form-error").textContent = "Ocurrió un error al registrar la tarea.";
        document.getElementById("form-error").classList.remove("hidden");
    }
});

/* Event listener para doble clic en la tabla de tareas (delegación de eventos) */
document.querySelector("#tasks-table tbody").addEventListener("dblclick", function(event) {
    try {
        const clickedRow = event.target.closest("tr");
        if (clickedRow) {
            editTask(clickedRow);
        }
    } catch (error) {
        console.error("Error en el evento dblclick de la tabla:", error);
    }
});

/**
 * Carga los datos de una tarea en el formulario de edición.
 * @param {HTMLTableRowElement} row - La fila de la tabla que contiene los datos de la tarea.
 */
function editTask(row) {
    try {
        const cells = row.children;
        const task = {
            code: cells[0].textContent,
            title: cells[1].textContent,
            description: cells[2].textContent,
            startDate: cells[3].textContent,
            clientName: cells[4].textContent,
            projectId: cells[5].textContent,
            comments: cells[6].textContent,
            status: cells[7].querySelector('select') ? cells[7].querySelector('select').value : cells[7].textContent
        };

        document.getElementById("edit-task-code").value = task.code;
        document.getElementById("edit-task-title").value = task.title;
        document.getElementById("edit-task-description").value = task.description;
        document.getElementById("edit-start-date").value = unformatDate(task.startDate);
        document.getElementById("edit-client-name").value = task.clientName;
        document.getElementById("edit-project-id").value = task.projectId;
        document.getElementById("edit-comments-display").value = task.comments;
        document.getElementById("add-new-comment").value = "";
        document.getElementById("edit-status").value = task.status;

        document.getElementById("edit-task-section").classList.remove("hidden");
        document.getElementById("query-section").classList.add("hidden");
        document.getElementById("form-error").classList.add("hidden");
        document.getElementById("edit-form-error").classList.add("hidden");
        console.log("Editando tarea:", task.code);
    } catch (error) {
        console.error("Error al editar la tarea:", error, "Fila:", row);
        document.getElementById("edit-form-error").textContent = "Error al cargar los datos de la tarea para edición.";
        document.getElementById("edit-form-error").classList.remove("hidden");
    }
}

/**
 * Actualiza los campos de la tarea y cierra el formulario de edición.
 */
function updateTaskAndClose() {
    try {
        const editFormError = document.getElementById("edit-form-error");
        const taskCode = document.getElementById("edit-task-code").value.trim();
        const taskTitle = document.getElementById("edit-task-title").value.trim();
        const taskDescription = document.getElementById("edit-task-description").value.trim();
        const startDate = document.getElementById("edit-start-date").value;
        const clientName = document.getElementById("edit-client-name").value.trim();
        const projectId = document.getElementById("edit-project-id").value.trim();
        let comments = document.getElementById("edit-comments-display").value.trim();
        const newComment = document.getElementById("add-new-comment").value.trim();
        const status = document.getElementById("edit-status").value;

        if (!taskTitle || !taskDescription || !startDate || !clientName || !projectId) {
            editFormError.textContent = "Por favor, completa todos los campos obligatorios.";
            editFormError.classList.remove("hidden");
            return;
        }

        editFormError.classList.add("hidden");

        const formattedStartDate = formatDate(startDate);

        if (newComment) {
            const formattedDateTime = getFormattedDateTime();
            if (comments) {
                comments += "\n---\n";
            }
            comments += `[${formattedDateTime}] ${newComment}`;
        }

        const taskIndex = tasks.findIndex(task => task.code === taskCode);
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                code: taskCode,
                title: taskTitle,
                description: taskDescription,
                startDate: formattedStartDate,
                clientName: clientName,
                projectId: projectId,
                comments: comments,
                status: status
            };

            // Actualizar la fila de la tabla
            const tableBody = document.querySelector("#tasks-table tbody");
            const rows = tableBody.rows;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].dataset.taskCode === taskCode) {
                    const currentRow = rows[i];
                    currentRow.cells[1].textContent = taskTitle;
                    currentRow.cells[2].textContent = taskDescription;
                    currentRow.cells[3].textContent = formattedStartDate;
                    currentRow.cells[4].textContent = clientName;
                    currentRow.cells[5].textContent = projectId;
                    currentRow.cells[6].textContent = comments;
                    
                    const statusSelect = currentRow.cells[7].querySelector('select');
                    if (statusSelect) {
                        statusSelect.value = status;
                    }

                    if (shouldBeCrossedOut(status)) {
                        currentRow.classList.add("task-crossed-out");
                    } else {
                        currentRow.classList.remove("task-crossed-out");
                    }
                    break;
                }
            }

            document.getElementById("edit-task-section").classList.add("hidden");
            document.getElementById("query-section").classList.remove("hidden");
            filterTasksByStatus(); // Re-aplica el filtro después de actualizar
            alert("Cambios guardados y formulario cerrado.");
            console.log("Tarea actualizada y formulario cerrado para:", taskCode);
        } else {
            editFormError.textContent = "Error: La tarea no se encontró para actualizar.";
            editFormError.classList.remove("hidden");
            console.error("Tarea no encontrada para actualizar:", taskCode);
        }
    } catch (error) {
        console.error("Error al actualizar la tarea y cerrar:", error);
        document.getElementById("edit-form-error").textContent = "Ocurrió un error inesperado al guardar los cambios.";
        document.getElementById("edit-form-error").classList.remove("hidden");
    }
}

/**
 * Cancela la edición de una tarea y vuelve a la vista de la tabla.
 */
function cancelEdit() {
    try {
        document.getElementById("edit-task-section").classList.add("hidden");
        document.getElementById("query-section").classList.remove("hidden");
        document.getElementById("edit-form-error").classList.add("hidden"); // Limpia errores del formulario de edición
        console.log("Edición de tarea cancelada.");
    } catch (error) {
        console.error("Error al cancelar la edición:", error);
    }
}

/**
 * Filtra las tareas mostradas en la tabla según el estatus seleccionado.
 */
function filterTasksByStatus() {
    try {
        const selectedStatus = document.getElementById("status-filter").value;
        const tableBody = document.querySelector("#tasks-table tbody");
        const rows = tableBody.rows;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            // Asegúrate de que la celda del estatus exista y contenga un select
            if (row.cells.length > 7 && row.cells[7].querySelector('select')) {
                const currentStatus = row.cells[7].querySelector('select').value;
                if (selectedStatus === "Todos" || currentStatus === selectedStatus) {
                    row.style.display = ''; // Mostrar la fila
                } else {
                    row.style.display = 'none'; // Ocultar la fila
                }
            } else {
                console.warn(`Fila ${i} no tiene la estructura esperada para el estatus.`);
                // Decide si ocultar la fila por defecto si no se puede determinar el estatus
                row.style.display = 'none';
            }
        }
        console.log("Filtro aplicado:", selectedStatus);
    } catch (error) {
        console.error("Error al filtrar tareas por estatus:", error);
    }
}

// Inicializa la tabla al cargar la página (si hay tareas precargadas)
document.addEventListener('DOMContentLoaded', () => {
    renderTasksTable();
    filterTasksByStatus(); // Aplica el filtro inicial "Todos"
});