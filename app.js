fetch("https://script.google.com/macros/s/AKfycbxJKib8xBJPLPrFpt0D5-Ez3qT2kFYUSVisK-ECa-KQ4oKthpD_E7g7g9JcYXJ5Xh1R/exec", {
  method: "POST",
  mode: "no-cors", // o cors según prefieras
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ nombre: nombreDetectadoQR })
})
.then(response => {
  console.log("¡Marcada PRESENTE!");
})
.catch(error => console.error("Error:", error));
