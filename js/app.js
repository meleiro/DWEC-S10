// Importamos la función getUsers desde el módulo apiService.
// Esta función es la encargada de llamar a la API (o al mock en caso de error)
// y devolver la lista de usuarios.
import { getUsers } from "./apiService";


// Elemento del DOM donde se mostrarán los mensajes para el usuario.
// Se asume que en el HTML existe un elemento con id="message".
const messageErr = document.getElementById("message");

// Elemento del DOM donde se pintará la lista de usuarios.
// Se asume que en el HTML existe un elemento (por ejemplo <ul>) con id="user-list".
const userList = document.getElementById("user-list");

// Array en memoria donde guardaremos la lista de usuarios cargados desde la API o el mock.
let users = [];

/**
 * Muestra un mensaje en pantalla, pudiendo ser de éxito o error.
 * @param {string} text - El texto del mensaje a mostrar.
 * @param {string} type - El tipo de mensaje: "success" o "error".
 */
function showMessage(text, type = "success") {

    // Insertamos el texto del mensaje en el elemento HTML.
    // Esto cambia el contenido visible del elemento con id="message".
    messageErr.textContent = text;

    // NOTA: aquí solo se añaden clases, no se eliminan las anteriores.
    // Si antes se marcó como error y ahora ponemos success, la clase de error seguiría puesta.

    // Si el mensaje es de error, agregamos la clase correspondiente.
    if (type === "error") {
        messageErr.classList.add("message--error");

    // Si es de éxito, agregamos la clase de éxito.
    } else if (type === "success") {
        messageErr.classList.add("message--success");
    }
}



/**
 * Función principal que carga los usuarios y actualiza la interfaz.
 * - Muestra un mensaje de "Cargando..." al inicio.
 * - Llama a getUsers() para obtener los datos (desde API real o mock).
 * - Muestra mensajes en función de si hubo error o no.
 */
async function loadUsers() {

    // Mensaje inicial informando al usuario de que se está cargando la información.
    showMessage("Cargando usuarios ...");

    try {
        // Llamamos a getUsers para obtener los datos desde la API o el mock.
        // Esta llamada es asíncrona, por eso usamos await.
        const data = await getUsers();

        // Si la API (o el mock) devolvió una propiedad especial __apiMessage,
        // significa que hubo algún problema y queremos mostrar ese mensaje al usuario.
        if (data.__apiMessage) {
            showMessage(data.__apiMessage, "error");

        } else {
            // Si no hubo errores, informamos de que los usuarios se han cargado correctamente.
            showMessage("Usuarios cargados correctamente", "success");
        }

        // AQUÍ FALTARÍA guardar los datos en el array 'users' y renderizarlos.
        // Por ejemplo:
        // users = data;
        // renderUsers();

    } catch (error) {
        // Captura de errores inesperados que puedan ocurrir dentro del try
        // (por ejemplo, un fallo de red muy grave que no se haya gestionado en getUsers).
        console.error(error);

        // Mostramos un mensaje genérico de error al usuario.
        showMessage("No se han podido cargar los usuarios", "error");
    }

}



/**
 * Función que se encarga de pintar en el DOM la lista de usuarios
 * que tenemos almacenada en el array global 'users'.
 */
function renderUsers() {
  
    // Limpiamos el contenido actual de la lista de usuarios.
    // Así, cada vez que llamemos a renderUsers, se vuelve a dibujar desde cero.
    userList.innerHTML = "";

    // Si no hay usuarios en el array, mostramos un mensaje dentro de la lista.
    if (!users.length) {
        userList.innerHTML = "<li>No hay ausuarios</li>"; // (Tiene un typo: "ausuarios")
        return;
    }

    // Recorremos el array de usuarios y creamos un <li> para cada uno.
    users.forEach((user) => {

        // Creamos el elemento <li> que contendrá los datos del usuario.
        const li = document.createElement("li");

        // Creamos un <span> para el nombre.
        const nameSpan = document.createElement("span");
        nameSpan.textContent = user.name;

        // Creamos un <span> para el email.
        const emailSpan = document.createElement("span");
        emailSpan.textContent = user.email;

        // Metemos los dos <span> dentro del <li>.
        li.appendChild(nameSpan);
        li.appendChild(emailSpan);

        // Añadimos el <li> ya relleno a la lista de usuarios del DOM.
        userList.appendChild(li);   
        
    });
}
