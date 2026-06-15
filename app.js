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

// app.js (Continuación)

// Algoritmo de Fisher-Yates para barajar el arreglo de forma aleatoria
function barajar(array) {
  const nuevoArray = [...array];
  for (let i = nuevoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
  }
  return nuevoArray;
}

// Inicializa o reinicia las variables del estado
function iniciarJuego() {
  // 1. Duplicamos los emojis para tener los pares y los barajamos
  const pares = [...emojis, ...emojis];
  const cartasBarajadas = barajar(pares);

  // 2. Llenamos nuestro estado central con objetos por cada carta
  state.cartas = cartasBarajadas.map(emoji => ({
    emoji: emoji,
    volteada: false,     // Si está temporalmente bocarriba
    encontrada: false    // Si ya formó un par definitivo
  }));
  
  state.indicesVolteados = [];
  state.paresEncontrados = 0;
  state.movimientos = 0;
  state.bloqueado = false;

  // Ocultamos el mensaje de victoria si estaba visible
  domMensajeVictoria.classList.add('oculto');

  // 3. Mandamos a dibujar la interfaz basándonos en este nuevo estado
  actualizarUI();
}

// Función CRÍTICA: La UI se dibuja desde el estado, nunca al revés
function actualizarUI() {
  // Actualizamos el contador de movimientos
  domMovimientos.textContent = state.movimientos;
  
  // Limpiamos el contenedor del tablero antes de redibujar
  domTablero.innerHTML = ''; 

  state.cartas.forEach((carta, indice) => {
    // Usamos createElement en lugar de strings con innerHTML (Prevención XSS)
    const divCarta = document.createElement('div');
    divCarta.classList.add('carta');
    
    // Guardamos el índice en el HTML para saber a qué elemento del state corresponde
    divCarta.dataset.indice = indice;

    // Lógica de renderizado: ¿Qué mostramos según el state?
    if (carta.volteada || carta.encontrada) {
      divCarta.textContent = carta.emoji; // Usamos textContent seguro
      divCarta.classList.add(carta.encontrada ? 'encontrada' : 'revelada');
    }

    // Inyectamos el nodo en el DOM
    domTablero.appendChild(divCarta);
  });
}

// Arrancamos el juego apenas cargue el script
iniciarJuego();