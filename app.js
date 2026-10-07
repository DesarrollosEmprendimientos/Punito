// URL de tu Web App de Google Apps Script
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxJKib8xBJPLPrFpt0D5-Ez3qT2kFYUSVisK-ECa-KQ4oKthpD_E7g7g9JcYXJ5Xh1R/exec";

function onScanSuccess(decodedText, decodedResult) {
  // Limpiamos cualquier carácter sobrante que pueda traer el QR
  let nombrePasajera = decodedText.replace(/["'{}]/g, "").trim();

  if (!nombrePasajera) return;

  console.log("Escaneado: " + nombrePasajera);

  // Enviamos los datos al backend de Google Sheets
  fetch(WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nombre: nombrePasajera })
  })
  .then(() => {
    // Alerta visual rápida de confirmación
    console.log("Registrado con éxito: " + nombrePasajera);
  })
  .catch(error => {
    console.error("Error al registrar asistencia:", error);
  });
}

// Inicialización del lector QR
document.addEventListener("DOMContentLoaded", () => {
  const html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: 250 }, false);
  html5QrcodeScanner.render(onScanSuccess, (error) => {
    // Errores menores de escaneo se omiten
  });
});
