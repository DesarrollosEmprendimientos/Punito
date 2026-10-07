const WEB_APP_URL = "TU_URL_DE_APPS_SCRIPT_AQUI"; // Pega aquí la URL obtenida en el Paso 1

const trigger = document.getElementById("scan-trigger");
const readerContainer = document.getElementById("reader-container");
const cancelBtn = document.getElementById("cancel-btn");
const resultDiv = document.getElementById("result");

let html5QrCode;

trigger.addEventListener("click", () => {
    trigger.style.display = "none";
    readerContainer.style.display = "block";
    
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        onScanFailure
    ).catch(err => {
        resultDiv.innerText = "Error al iniciar la cámara: " + err;
        resetUI();
    });
});

cancelBtn.addEventListener("click", () => {
    stopScanner();
});

function onScanSuccess(decodedText, decodedResult) {
    stopScanner();
    resultDiv.innerText = "Procesando: " + decodedText + "...";
    
    // Enviar a Google Sheets
    fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // Necesario para Apps Script web apps simples
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: decodedText })
    })
    .then(() => {
        resultDiv.style.color = "green";
        resultDiv.innerText = `¡${decodedText} marcada como PRESENTE!`;
    })
    .catch(err => {
        resultDiv.style.color = "red";
        resultDiv.innerText = "Error al conectar con la planilla.";
    });
}

function onScanFailure(error) {
    // Se ejecuta continuamente mientras busca código QR, se puede ignorar
}

function stopScanner() {
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
            resetUI();
        }).catch(err => {
            resetUI();
        });
    } else {
        resetUI();
    }
}

function resetUI() {
    readerContainer.style.display = "none";
    trigger.style.display = "block";
}

// Registro de Service Worker básico para soporte PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}