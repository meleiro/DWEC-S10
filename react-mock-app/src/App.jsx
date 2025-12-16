// App.jsx
// =====================================================
// EJEMPLO DE INTEGRACIÓN CON REACT (WEB)
// -----------------------------------------------------
// Este componente representa la aplicación principal.
// Se encarga de:
//  - Cargar usuarios desde un servicio externo
//  - Mostrar estados de carga y mensajes
//  - Crear nuevos usuarios mediante un formulario
//
// IMPORTANTE:
// - La lógica de acceso a datos NO está aquí
// - Se delega en apiService.js (buena arquitectura)
// =====================================================


// Importamos hooks de React
// useState  -> manejar estado interno del componente
// useEffect -> ejecutar código en momentos concretos del ciclo de vida
import { useEffect, useState } from "react";


// Importamos funciones del servicio de API
// Estas funciones encapsulan las llamadas HTTP
// React NO sabe cómo se accede a la API, solo las usa
import { getUsers, createUser } from "./js/apiService";


function App() {

  // ===================================================
  // ESTADOS DEL COMPONENTE
  // ===================================================

  // Lista de usuarios obtenida desde la API
  // Al cambiar este estado, React vuelve a renderizar la UI
  const [users, setUsers] = useState([]);

  // Indica si se está realizando una operación asíncrona
  // (carga inicial, creación de usuario, etc.)
  const [loading, setLoading] = useState(false);

  // Mensajes informativos o de error para el usuario
  // type puede ser "success" o "error"
  const [message, setMessage] = useState({ text: "", type: "" });

  // Estados controlados para el formulario
  // Representan el contenido actual de los inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");


  // ===================================================
  // FUNCIÓN AUXILIAR PARA MOSTRAR MENSAJES
  // ===================================================

  // Centraliza la gestión de mensajes
  // Evita repetir setMessage por todo el código
  function showMessage(text, type = "success") {
    setMessage({ text, type });
  }


  // ===================================================
  // EFECTO DE CARGA INICIAL
  // ===================================================
  // useEffect con array de dependencias vacío []
  // => se ejecuta UNA SOLA VEZ cuando el componente se monta
  // => equivalente a componentDidMount en clases

  useEffect(() => {

    // Definimos una función async dentro del efecto
    // (useEffect no puede ser async directamente)
    async function load() {
      setLoading(true); // activamos indicador de carga

      try {
        // Llamada al servicio para obtener usuarios
        const data = await getUsers();

        // Si la API devuelve un mensaje de error personalizado
        if (data.__apiMessage) {
          showMessage(data.__apiMessage, "error");
        } else {
          showMessage("Usuarios cargados desde React.", "success");
        }

        // Guardamos solo los usuarios válidos en el estado
        // (filtramos posibles mensajes de error)
        setUsers(data.filter((u) => !u.__apiMessage));

      } catch (error) {
        // Error de red, servidor caído, etc.
        console.error(error);
        showMessage("Error cargando usuarios en React.", "error");
      } finally {
        // Pase lo que pase, desactivamos la carga
        setLoading(false);
      }
    }

    // Ejecutamos la carga inicial
    load();

  }, []); // [] => solo al montar el componente

async function handleSubmit(e){

      e.preventDefault();

      if (!name.trim() || !email.trim()) return;
      
      
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
}
