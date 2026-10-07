// Reemplaza con la URL que obtuviste al desplegar tu Google Apps Script
const WEB_APP_URL = "TU_URL_DE_APPS_SCRIPT_AQUI"; 

const trigger = document.getElementById("scan-trigger");
const readerContainer = document.getElementById("reader-container");
const cancelBtn = document.getElementById("cancel-btn");
const resultDiv = document.getElementById("result");

let html5QrCode;

trigger.addEventListener("click", () => {
    trigger.style.display = "none";
    readerContainer.style.display = "block";
    resultDiv.innerText = "";
    
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
        { facingMode: "environment" }, // Usa la cámara trasera del celular
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        onScanFailure
    ).catch(err => {
        resultDiv.innerText = "Error al acceder a la cámara: " + err;
        resetUI();
    });
});

cancelBtn.addEventListener("click", () => {
    stopScanner();
});

function onScanSuccess(decodedText) {
    stopScanner();
    resultDiv.style.color = "#333";
    resultDiv.innerText = "Procesando a: " + decodedText + "...";
    
    // Envía el nombre detectado en el QR al Apps Script para buscarlo y marcarlo
    fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: decodedText })
    })
    .then(() => {
        resultDiv.style.color = "#2e7d32";
        resultDiv.innerText = `¡${decodedText} marcada como PRESENTE!`;
    })
    .catch(err => {
        resultDiv.style.color = "#d32f2f";
        resultDiv.innerText = "Error al conectar con la planilla.";
    });
}

function onScanFailure(error) {
    // Ignorar errores de fotogramas vacíos mientras busca el QR
}

function stopScanner() {
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
            resetUI();
        }).catch(() => {
            resetUI();
        });
    } else {
        resetUI();
    }
}

function resetUI() {
    readerContainer.style.display = "none";
    trigger.style.display = "flex";
}

// Registro de Service Worker para habilitar funciones de PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
