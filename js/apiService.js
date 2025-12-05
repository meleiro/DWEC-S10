// URL base de la API donde se encuentran los usuarios.
// En este caso apunta al servidor local (localhost) en el puerto 3000,
// y al recurso /users, que normalmente expone un listado de usuarios.
const URL = "http://localhost:3000/users";


/**
 * Función asíncrona que obtiene la lista de usuarios desde el servidor real.
 * - Hace una petición HTTP GET con fetch.
 * - Valida la respuesta usando handleResponse.
 * - Si hay algún error (de red, de parseo, HTTP 4xx/5xx...), captura la excepción,
 *   muestra una advertencia y devuelve datos de prueba (mock).
 */
export async function getUsers() {

    try {
        // Realizamos la petición GET a la API usando la URL base.
        // fetch devuelve una Promesa que se resuelve con un objeto Response.
        const response = await fetch(URL);

        // Delegamos en handleResponse la lógica de:
        // - Comprobar si la respuesta es OK (códigos 2xx).
        // - Lanzar un error con información adicional si la respuesta no es correcta.
        // - Convertir el cuerpo a JSON si todo va bien.
        const data = await handleResponse(response);

        // Comprobamos que lo que ha devuelto la API es realmente un array.
        // Si no es un array, consideramos que el formato de la respuesta no es válido.
        if (!Array.isArray(data)) {
            throw new Error("La Api no devolvión una lista de usuarios");
        }
        
        // Si todo ha ido bien, devolvemos la lista de usuarios tal cual.
        return data;

    } catch (error) {
        // Si se produce cualquier error en el try (fetch, handleResponse, etc.),
        // entramos aquí. Primero obtenemos un mensaje de error amigable.
        const mensaje = handleError(error);

        // Mostramos una advertencia en consola indicando que no hemos podido
        // obtener los datos de la API real y que pasamos a usar datos mock.
        console.warn(
            "No se han podido recibir usuarios de la API Real. Procedemos a enviar usuarios del MOCK"
        );

        // Llamamos a la función que devuelve usuarios de prueba (mock) simulando la API.
        
        const mock = await getUserMock();

        // Añadimos una propiedad especial al objeto devuelto para indicar, a nivel de datos,
        // que estos usuarios no vienen de la API real sino del mock, junto con el mensaje de error.
        mock.__apiMessage = mensaje + " Mostrando usuairos de prueba (mock)";

        // Devolvemos los datos mock al código que haya llamado a getUsers().
        return mock;
    }

}


/**
 * Función que recibe un error (generalmente lanzado por handleResponse o fetch)
 * y devuelve un mensaje de error legible para mostrar al usuario o en consola.
 * Además, escribe el error completo en la consola para depuración.
 */
function handleError(error) {

    // Mostramos el error completo en la consola con una etiqueta específica.
    console.error("[ERROR DE LA API]", error);

    // En función del código de estado HTTP (status) devolvemos un mensaje distinto:
    // - 404: recurso no encontrado.
    // - 5xx: error de servidor.
    // - Otro: error genérico.
    // IMPORTANTE: para que esto funcione, el objeto 'error' debe tener la propiedad 'status',
    // que se la añadimos en handleResponse cuando detectamos un HTTP no OK.
    const mensaje = 
        error.status === 404
        ? "Recurso no encontrado"
        : error.status >= 500
        ? "Error en el servidor"
        : "Se ha porducido un error";

    // Devolvemos el mensaje que luego se usará en el catch de las funciones públicas.
    return mensaje;

}


/**
 * Función auxiliar asíncrona que procesa el objeto Response de fetch.
 * - Si la respuesta no es OK (response.ok === false), construye y lanza un Error
 *   con información adicional (status y body).
 * - Si es OK, intenta parsear la respuesta como JSON.
 *   Si el parseo falla, lanza otro Error indicando que no se ha podido parsear.
 */
async function handleResponse(response) {

    // response.ok es true para códigos 2xx. Si no lo es, consideramos que ha habido error HTTP.
    if (!response.ok) {

        // Intentamos leer el cuerpo de la respuesta como texto para adjuntarlo al error,
        // por si nos da pistas de qué ha pasado (por ejemplo, un mensaje del backend).
        // Si falla (por ejemplo, no hay cuerpo), capturamos el error y usamos cadena vacía.
        const text = await response.text().catch(() => "");

        // Creamos un objeto Error con un mensaje que incluye el código HTTP.
        const error = new Error(`Error HTTP: ${response.status}`);

        // Añadimos información extra al error:
        // - status: el código HTTP (404, 500, etc.)
        // - body: el contenido del cuerpo de la respuesta (texto plano).
        error.status = response.status;
        error.body = text;

        // Lanzamos el error para que lo capture el catch de la función que llamó a handleResponse.
        throw error;
    }

    // Si la respuesta es OK, intentamos parsear el cuerpo como JSON.
    try {
        const data = await response.json();
        // Si el parseo tiene éxito, devolvemos los datos.
        return data;

    } catch (err) {
        // Si se produce un error al hacer response.json() (por ejemplo,
        // la respuesta no es JSON válido), creamos un nuevo Error más descriptivo.
        const error = new Error("No se ha podido parsear");
        // Guardamos el error original en la propiedad 'cause' por si queremos depurarlo.
        error.cause = err;
        // Lanzamos este nuevo error para que lo gestione el código que llamó a handleResponse.
        throw error;
    }
}


/**
 * Función que simula la creación de un usuario en un servidor de pruebas (mock).
 * En lugar de llamar a una API real, devuelve una Promesa que se resuelve
 * con un nuevo objeto usuario tras un pequeño retardo.
 */
function createUserMock(user) {

    // Devolvemos una nueva Promesa que se resolverá más tarde.
    return new Promise((resolve) => {

        // Simulamos el tiempo de respuesta de un servidor con setTimeout (300 ms).
        setTimeout(() => {
            // Resolvemos la promesa con un nuevo objeto usuario,
            // al que le añadimos una propiedad 'id' generada con Date.now()
            // (marca temporal actual en milisegundos) y copiamos el resto de campos de 'user'.
            resolve({ id: Date.now(), ...user });
        }, 300);
    });
}


/**
 * Función que simula obtener un listado de usuarios desde un servidor de pruebas (mock).
 * Devuelve una Promesa que, tras 500 ms, se resuelve con un array de usuarios estáticos.
 */
function getUserMock() {

    return new Promise((resolve) => {
        // Simulamos el retardo del servidor (latencia) con 500 ms.
        setTimeout(() => {
            // Resolvemos la promesa con un array de dos usuarios de ejemplo.
            resolve([
                { id: 1, name: "pepe",  email: "pepe@pepe.com"  },
                { id: 2, name: "maria", email: "maria@maria.com" },
            ]);

        }, 500);

    });
}


/**
 * Función asíncrona que intenta crear un usuario en la API real.
 * - En primer lugar hace un POST con fetch enviando el usuario en formato JSON.
 * - Si la API responde correctamente, devuelve los datos de la respuesta.
 * - Si hay cualquier error (red, HTTP, parseo...), usa un mock para simular la creación.
 */
async function createUser(user) {

    try {
        // Realizamos la petición POST a la API con fetch.
        const response = await fetch(URL, {

            // Método HTTP POST para crear un recurso nuevo.
            method: "POST",

            // Cabeceras HTTP: indicamos que el cuerpo va en formato JSON.
            headers: {
                "Content-Type": "application/json",
            },

            // Convertimos el objeto 'user' a un string JSON para enviarlo en el cuerpo del POST.
            body: JSON.stringify(user),
        });

        // Procesamos la respuesta llamando a handleResponse (comprobación de estado + parseo JSON).
        const data = await handleResponse(response);

        // Si todo va bien, devolvemos los datos recibidos de la API real (por ejemplo, el usuario creado).
        return data;

    } catch (error) {

        // Si ocurre cualquier error (HTTP, red, parseo …), lo manejamos y generamos un mensaje descriptivo.
        const mensaje = handleError(error);

        // Avisamos en consola de que no se ha podido crear el usuario en la API real
        // y que vamos a simular la creación usando el mock.
        console.warn(
            "No se hapodido crear el usuario en la API Real. Procedemos a crear en el MOCK"
        );

        // Creamos el usuario en el mock (solo en memoria, no en servidor real).
        const mock = await createUserMock(user);

        // Añadimos una propiedad especial para indicar que el usuario se ha creado
        // únicamente en memoria/mock, junto con el mensaje de error original.
        mock.__apiMessage = mensaje + " usuario creado solo en memoria (mock)";

        // Devolvemos este usuario simulado.
        return mock;

    }
}
