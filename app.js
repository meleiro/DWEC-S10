// URL base de la API donde se encuentran los usuarios
const URL = "http://localhost:3000/users";

// Elemento del DOM donde se mostrarán los mensajes para el usuario
const messageErr = document.getElementById("message");

/**
 * Muestra un mensaje en pantalla, pudiendo ser de éxito o error.
 * @param {string} text - El texto del mensaje a mostrar.
 * @param {string} type - El tipo de mensaje: "success" o "error".
 */
function showMessage(text, type = "success") {

    // Insertamos el texto del mensaje en el elemento HTML
    messageErr.textContent = text;

    // Si el mensaje es de error, agregamos la clase correspondiente
    if (type === "error") {
        messageErr.classList.add("message--error");

    // Si es de éxito, agregamos la clase de éxito
    } else if (type === "success") {
        messageErr.classList.add("message--success");
    }

}

/**
 * Función que obtiene la lista de usuarios desde el servidor.
 * Es asíncrona porque usa fetch.
 */
async function getUsers() {

    try {
        // Realizamos la petición GET a la API
        const response = await fetch(URL);

        // Convertimos la respuesta a JSON y lo devolvemos
        return await response.json();

    } catch (error) {
        // Si ocurre un error en la petición, lo mostramos en consola
        console.error("Error al obtener los usuarios:", error);

        // Devolvemos un objeto especial para que loadUsers detecte el error
        return { __apiMessage: "Error al conectar con el servidor" };
    }

}

/**
 * Función principal que carga los usuarios y actualiza la interfaz.
 */
async function loadUsers() {

    // Mensaje inicial informando al usuario
    showMessage("Cargando usuarios ...");

    try {
        // Llamamos a getUsers para obtener los datos
        const data = await getUsers();

        // Si la API devolvió un mensaje de error especial, lo mostramos
        if (data.__apiMessage) {
            showMessage(data.__apiMessage, "error");

        } else {
            // Si no hubo errores:
            showMessage("Usuarios cargados correctamente", "success");

            // Aquí iría el código para renderizar los usuarios en pantalla
            // Ejemplo:
            // renderUsers(data);
        }

    } catch (error) {
        // Captura de errores inesperados en el bloque try
        console.error(error);
        showMessage("No se han podido cargar los usuarios", "error");
    }

}
