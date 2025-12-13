// URL base de la API donde se encuentran los usuarios.
// Apunta al servidor local (localhost) en el puerto 3000,
// y al recurso /users, normalmente usado para obtener o crear usuarios.
const URL = "http://localhost:3000/users";


/**
 * Función asíncrona que obtiene la lista de usuarios desde la API real.
 * Si algo falla (error HTTP, red, JSON incorrecto…), captura el error,
 * muestra un aviso y devuelve usuarios de prueba (mock).
 */
export async function getUsers() {

    try {
        // Hacemos una petición GET a la API.
        const response = await fetch(URL);

        // Validamos la respuesta y extraemos los datos JSON.
        const data = await handleResponse(response);

        // Verificamos que realmente sea un array.
        if (!Array.isArray(data)) {
            throw new Error("La API no devolvió una lista de usuarios");
        }
        
        // Si todo está bien, devolvemos los datos originales.
        return data;

    } catch (error) {
        // Transformamos el error en un mensaje legible.
        const mensaje = handleError(error);

        // Informamos de que usaremos datos de prueba.
        console.warn(
            "No se han podido recibir usuarios de la API Real. Procedemos a enviar usuarios del MOCK"
        );

        // Obtenemos usuarios simulados.
        const mock = await getUserMock();

        // Marcamos que los datos provienen del mock.
        mock.__apiMessage = mensaje + " Mostrando usuarios de prueba (mock)";

        return mock;
    }

}



/**
 * Función que convierte cualquier error recibido en un mensaje más fácil
 * de entender. También lo muestra en consola para depuración.
 */
function handleError(error) {

    // Mostramos el error original.
    console.error("[ERROR DE LA API]", error);

    // Generamos un mensaje según el código HTTP.
    const mensaje = 
        error.status === 404
        ? "Recurso no encontrado"
        : error.status >= 500
        ? "Error en el servidor"
        : "Se ha producido un error";

    return mensaje;
}



/**
 * Procesa el objeto Response devuelto por fetch.
 * - Si la respuesta NO es OK, lanza un error con información del estado.
 * - Si es OK, intenta convertir el body en JSON.
 */
async function handleResponse(response) {

    // Si fetch recibe estado HTTP distinto a 2xx, response.ok será false.
    if (!response.ok) {

        // Intentamos leer el body como texto para incluirlo en el error.
        const text = await response.text().catch(() => "");

        // Creamos un error indicando el código HTTP.
        const error = new Error(`Error HTTP: ${response.status}`);

        // Añadimos información adicional al error.
        error.status = response.status;
        error.body = text;

        // Lanzamos el error para que sea capturado por el catch del llamador.
        throw error;
    }

    // Si response.ok === true, intentamos parsear como JSON.
    try {
        const data = await response.json();
        return data;

    } catch (err) {
        // Si falla la conversión JSON, generamos un error más descriptivo.
        const error = new Error("No se ha podido parsear");
        error.cause = err;
        throw error;
    }
}



/**
 * Función mock que simula crear un usuario en una API.
 * Devuelve una promesa que se resuelve después de 300ms
 * generando un usuario nuevo con un id automático.
 */
function createUserMock(user) {

    return new Promise((resolve) => {

        setTimeout(() => {
            // Creamos el usuario, generando un id único con Date.now().
            resolve({ id: Date.now(), ...user });
        }, 300);
    });
}



/**
 * Función mock que simula obtener usuarios desde una API.
 * Devuelve un array estático después de 500ms.
 */
function getUserMock() {

    return new Promise((resolve) => {

        setTimeout(() => {
            resolve([
                { id: 1, name: "pepe",  email: "pepe@pepe.com" },
                { id: 2, name: "maria", email: "maria@maria.com" },
            ]);
        }, 500);

    });
}



/**
 * Crea un usuario en la API real mediante POST.
 * Si falla, crea el usuario usando el mock.
 */
export async function createUser(user) {

    try {
        // Enviamos un POST para crear el usuario.
        const response = await fetch(URL, {

            method: "POST",

            // Indicamos que el body es JSON.
            headers: {
                "Content-Type": "application/json",
            },

            // Convertimos el objeto JS en cadena JSON.
            body: JSON.stringify(user),
        });

        // Validamos respuesta y extraemos datos.
        const data = await handleResponse(response);

        return data;

    } catch (error) {

        // Transformamos el error a un mensaje legible.
        const mensaje = handleError(error);

        console.warn(
            "No se ha podido crear el usuario en la API Real. Procedemos a crear en el MOCK"
        );

        // Creamos usuario de prueba.
        const mock = await createUserMock(user);

        // Marcamos que es mock.
        mock.__apiMessage = mensaje + " usuario creado solo en memoria (mock)";

        return mock;
    }
}
