// URL de tu Web App de Google Apps Script (reemplaza con la tuya si es necesario)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxJKib8xBJPLPrFpt0D5-Ez3qT2kFYUSVisK-ECa-KQ4oKthpD_E7g7g9JcYXJ5Xh1R/exec";

function onScanSuccess(decodedText, decodedResult) {
  // Limpiamos cualquier carácter sobrante que pueda traer el QR
  let nombrePasajera = decodedText.replace(/["'{}]/g, "").trim();

  if (!nombrePasajera) return;

  console.log("Escaneado: " + nombrePasajera);

  // Enviamos los datos al backend de Google Sheets
  fetch(WEB_APP_URL, {
    method: "POST",
    mode: "no-cors", // Evita problemas de CORS con Google Apps Script
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nombre: nombrePasajera })
  })
  .then(() => {
    // Como usamos 'no-cors' no se puede leer la respuesta JSON directamente,
    // pero si el fetch pasa con éxito, actualizamos la interfaz visual de inmediato.
    agregarAListadoVisual(nombrePasajera);
  })
  .catch(error => {
    console.error("Error al registrar asistencia:", error);
    alert("Hubo un error al registrar la asistencia.");
  });
}

function agregarAListadoVisual(nombre) {
  const contenedorLista = document.getElementById("lista-asistencia-reciente");
  
  if (contenedorLista) {
    const nuevoElemento = document.createElement("li");
    
    // Formato exacto solicitado
    nuevoElemento.textContent = nombre + "....¡PRESENTE!";
    
    // Lo insertamos al tope de la lista para ver el último escaneo primero
    contenedorLista.prepend(nuevoElemento);
  }
}

// Inicialización del lector QR (ajusta según la librería que uses, ej. Html5QrcodeScanner)
document.addEventListener("DOMContentLoaded", () => {
  const html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: 250 }, false);
  html5QrcodeScanner.render(onScanSuccess, (error) => {
    // Manejo de errores de escaneo menores (opcional)
  });
});
