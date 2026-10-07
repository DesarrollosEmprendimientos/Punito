const WEB_APP_URL = "TU_URL_DE_APPS_SCRIPT_AQUI/exec";
let html5QrCode = null;

function iniciarEscanner() {
  // Evita iniciar la cámara dos veces si ya está abierta
  if (html5QrCode && html5QrCode.isScanning) return;

  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("reader");
  }

  html5QrCode.start(
    { facingMode: "environment" }, // Cámara trasera del celular
    {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    },
    (decodedText, decodedResult) => {
      // Limpieza de caracteres del QR
      let nombrePasajera = decodedText.replace(/["'{}]/g, "").trim();
      if (!nombrePasajera) return;

      console.log("Escaneado: " + nombrePasajera);

      // Enviar a Google Sheets
      fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombrePasajera })
      })
      .then(() => {
        agregarAListadoVisual(nombrePasajera);
      })
      .catch(error => {
        console.error("Error al registrar:", error);
      });
    },
    (errorMessage) => {
      // Errores de cuadro por cuadro se ignoran silenciosamente
    }
  ).catch(err => {
    console.error("No se pudo iniciar la cámara:", err);
    alert("Permiso de cámara denegado o no disponible.");
  });
}

function agregarAListadoVisual(nombre) {
  const contenedorLista = document.getElementById("lista-asistencia-reciente");
  
  if (contenedorLista) {
    const nuevoElemento = document.createElement("li");
    
    // Formato exacto solicitado
    nuevoElemento.textContent = nombre + "....¡PRESENTE!";
    
    // Lo agregamos arriba de todo
    contenedorLista.prepend(nuevoElemento);
  }
}
