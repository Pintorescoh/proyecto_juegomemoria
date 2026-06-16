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

// 4. DELEGACIÓN DE EVENTOS: Un solo vigilante para todo el tablero
domTablero.addEventListener('click', (evento) => {
  // Verificamos que el clic haya sido exactamente en un elemento con la clase 'carta'
  const elementoClickeado = evento.target.closest('.carta');
  if (!elementoClickeado) return; // Si hizo clic en el espacio vacío del grid, ignoramos

  // Obtenemos qué número de carta fue clickeada leyendo el data-indice del HTML
  const indice = Number(elementoClickeado.dataset.indice);

  // REGLAS DE BLOQUEO CRÍTICAS (El "antivirus" contra clicks compulsivos)
  // Ignoramos el clic si:
  // 1. El tablero está procesando una jugada (bloqueado)
  // 2. La carta ya forma parte de un par encontrado
  // 3. La carta ya está volteada en este turno (evita el bug de doble clic en la misma carta)
  if (state.bloqueado || state.cartas[indice].encontrada || state.cartas[indice].volteada) {
    return;
  }

  // Si pasa las reglas, mutamos el ESTADO (nuestra fuente de verdad)
  state.cartas[indice].volteada = true;
  state.indicesVolteados.push(indice);
  
  // Como el estado cambió, mandamos a redibujar la pantalla
  actualizarUI();

  // Si ya volteamos 2 cartas, procesamos la jugada
  if (state.indicesVolteados.length === 2) {
    state.movimientos++;
    verificarPar();
  }
});

// 5. LÓGICA DE COMPARACIÓN Y ASINCRONÍA
function verificarPar() {
  // BLOQUEAMOS EL TABLERO: Nadie más puede hacer clic hasta que terminemos de procesar
  state.bloqueado = true; 

  // Extraemos los dos índices que el usuario volteó
  const [indice1, indice2] = state.indicesVolteados;
  const carta1 = state.cartas[indice1];
  const carta2 = state.cartas[indice2];

  // Comparamos usando el estado, NUNCA leyendo el texto del DOM
  if (carta1.emoji === carta2.emoji) {
    // ¡Es un par! Marcamos las cartas como encontradas
    carta1.encontrada = true;
    carta2.encontrada = true;
    state.paresEncontrados++;
    
    // Limpiamos el turno y liberamos el tablero
    state.indicesVolteados = [];
    state.bloqueado = false;
    
    actualizarUI(); // Redibujamos (ahora tendrán la clase .encontrada)

    // Condición de victoria
    if (state.paresEncontrados === emojis.length) {
      domMensajeVictoria.classList.remove('oculto');
    }
  } else {
    // No coinciden. Necesitamos asincronía (setTimeout) para que el usuario alcance a ver la segunda carta
    setTimeout(() => {
      // Revertimos el estado después de 1 segundo (1000 milisegundos)
      carta1.volteada = false;
      carta2.volteada = false;
      
      // Limpiamos el turno y liberamos el tablero
      state.indicesVolteados = [];
      state.bloqueado = false; 
      
      actualizarUI(); // Redibujamos ocultando las cartas
    }, 1000);
  }
  
  // Actualizamos la UI inmediatamente para reflejar el movimiento sumado
  actualizarUI();
}

// 6. EVENTO DEL BOTÓN REINICIAR
btnReiniciar.addEventListener('click', iniciarJuego);