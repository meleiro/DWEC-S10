import { useEffect, useState } from "react";

import { getUsers, createUser } from "./js/apiService"

function App() {


  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);


  const [message, setMessage] = useState({ text: "", type: "" });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");



  function showMessage(text, type = "sucess") {
    setMessage({ text, type });
  }

  useEffect(

    async function load() {

      setLoading(true);

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
        setUsers(data.filter((u) => !u.__apiMessage));


      } catch (error) {
        console.error(error);
        showMessage("No se han podido cargar los usuarios.", "error");
      } finally {
        setLoading(false);
      }
    }

    , []);


}

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