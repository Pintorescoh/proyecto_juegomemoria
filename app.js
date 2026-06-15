// Lista de elementos (pares). Usamos emojis para simplificar.
const emojis = ['🚀', '💻', '🔒', '📊', '⚡', '🛡️', '🐍', '☁️'];

// 1. FUENTE ÚNICA DE VERDAD: El Estado
const state = {
  cartas: [],             // Almacenará el arreglo de objetos de cartas barajadas
  indicesVolteados: [],   // Guarda los índices (0-15) de las hasta 2 cartas volteadas en el turno actual
  paresEncontrados: 0,    // Para saber cuándo ganamos
  movimientos: 0,         // Contador de turnos
  bloqueado: false        // CRÍTICO: Evita clicks mientras se procesa una validación asíncrona
};

// Referencias clave al DOM
const domTablero = document.getElementById('tablero');
const domMovimientos = document.getElementById('contador-movimientos');
const domMensajeVictoria = document.getElementById('mensaje-victoria');
const btnReiniciar = document.getElementById('btn-reiniciar');