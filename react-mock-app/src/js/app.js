// js/app.js
// =====================================================
// LÓGICA DE PRESENTACIÓN (VANILLA JS + DOM)
// =====================================================
//
// Este archivo contiene toda la lógica de la *interfaz de usuario*.
// Aquí solo manipulamos el DOM, gestionamos formularios, mostramos
// mensajes y coordinamos las peticiones con apiService.js.
//
// IMPORTANTE: Este archivo NO sabe cómo funciona internamente la API.
// Solo usa las funciones getUsers() y createUser().

// Importamos las funciones que gestionan la comunicación con la API real o mock.
import { getUsers, createUser } from "./apiService.js";


// =====================================================
// REFERENCIAS AL DOM
// =====================================================
//
// Guardamos en variables los elementos del DOM que vamos a usar.
// Así no hacemos document.getElement… repetidamente.

const userListEl = document.getElementById("user-list"); // UL donde pintamos usuarios
const messageEl = document.getElementById("message");     // Mensajes de estado
const formEl = document.getElementById("user-form");      // Formulario de alta
const nameEl = document.getElementById("name");           // Campo nombre
const emailInput = document.getElementById("email");      // Campo email


// =====================================================
// ESTADO LOCAL
// =====================================================
//
// Aquí guardamos los usuarios que vienen de la API o del mock.
// Este array es el “estado” en memoria de la aplicación.

let users = [];


// =====================================================
// FUNCIÓN showMessage()
// =====================================================
// Muestra mensajes al usuario cambiando el contenido y las clases del elemento.
// - text: mensaje a mostrar
// - type: "success" o "error"

function showMessage(text, type = "success") {

  // Insertamos el texto del mensaje
  messageEl.textContent = text;

  // Reset de clases para evitar acumulación
  messageEl.className = "message";

  // Aplicamos estilo según el tipo
  if (type === "error") {
    messageEl.classList.add("message--error");
  } else {
    messageEl.classList.add("message--success");
  }
}


// =====================================================
// FUNCIÓN renderUsers()
// =====================================================
// Su único propósito es reflejar en el DOM el contenido de users[].
// No hace peticiones a la API ni modifica datos.

function renderUsers() {

  // Limpiamos todo el listado para volverlo a pintar desde cero
  userListEl.innerHTML = "";

  // Caso sin usuarios
  if (!users.length) {
    userListEl.innerHTML = "<li>No hay usuarios</li>";
    return;
  }

  // Recorremos el array y generamos un <li> para cada usuario
  users.forEach((user) => {

    const li = document.createElement("li");

    // Nombre
    const nameSpan = document.createElement("span");
    nameSpan.textContent = user.name;

    // Email
    const emailSpan = document.createElement("span");
    emailSpan.textContent = user.email;
    emailSpan.className = "user-email";

    // Insertamos spans en el <li>
    li.appendChild(nameSpan);
    li.appendChild(emailSpan);

    // Insertamos el <li> en la lista
    userListEl.appendChild(li);
  });
}


// =====================================================
// FUNCIÓN loadUsers()
// =====================================================
// Se ejecuta al cargar la página.
// - Muestra mensaje de carga
// - Llama a getUsers()
// - Maneja posible __apiMessage (mock)
// - Actualiza el estado y renderiza

async function loadUsers() {

  showMessage("Cargando usuarios...");

  try {
    // Obtenemos usuarios desde la API o mock
    const data = await getUsers();

    // Si viene un mensaje de mock, lo mostramos
    if (data.__apiMessage) {
      showMessage(data.__apiMessage, "error");
    } else {
      showMessage("Usuarios cargados correctamente.", "success");
    }

    // Eliminamos posibles metadatos antes de meterlos en users[]
    users = data.filter((u) => !u.__apiMessage);

    // Renderizamos en pantalla
    renderUsers();

  } catch (error) {
    console.error(error);
    showMessage("No se han podido cargar los usuarios.", "error");
  }
}


// =====================================================
// FUNCIÓN handleSubmit()
// =====================================================
// Gestiona el envío del formulario:
// - Valida campos
// - Llama a createUser()
// - Muestra mensaje adecuado
// - Actualiza el estado y vuelve a renderizar

async function handleSubmit(event) {

  event.preventDefault(); // Evitamos recarga de página

  const name = nameEl.value.trim();
  const email = emailInput.value.trim();

  // Validación sencilla
  if (!name || !email) return;

  const newUser = { name, email };

  showMessage("Creando usuario ...");

  try {
    // Llamamos a la API o mock
    const created = await createUser(newUser);

    // Si viene marcado como MOCK, informamos
    if (created.__apiMessage) {
      showMessage(created.__apiMessage, "error");
    } else {
      showMessage("Usuario creado correctamente", "success");
    }

    // Añadimos el usuario recién creado al estado
    users.push(created);

    // Refrescamos la interfaz
    renderUsers();

    // Limpiamos formulario
    formEl.reset();

  } catch (error) {
    console.error(error);
    showMessage("No se ha podido crear el usuario", "error");
  }
}



// =====================================================
// EVENTO DOMContentLoaded
// =====================================================
// Ejecutamos loadUsers() cuando la página termina de cargar,
// y asociamos evento submit al formulario.

document.addEventListener("DOMContentLoaded", () => {

  // Cargar usuarios iniciales
  loadUsers();

  // Escuchar envío del formulario
  formEl.addEventListener("submit", handleSubmit);

});
