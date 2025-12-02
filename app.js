const URL = "http://localhost:3000/users";

const messageErr = document.getElementById("message");

function showMessage(text, type = "success") {

    messageErr.textContent = text;

    if (type === "error") {
        messageErr.classList.add("message--error");
    } else if (type === "success") {
        messageErr.classList.add("message--success");
    }

}

async function getUsers() {


    try {


        const response = await fetch(URL);


    } catch (error) {

    }


}



async function loadUsers() {

    showMessage("Cargando usuarios ...");

    try {
        const data = await getUsers();

        if (data.__apiMessage) {
            showMessage(data.__apiMessage, "error");
        } else {
            showMessage("Usuarios cargados correctamente", "success");
        }

        //renderizar usuarios





    } catch (error) {
        console.error(error);
        showMessage("No se han podido cargar los usuarios", "error");
    }


}

