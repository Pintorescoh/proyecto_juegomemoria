// Arreglo maestro con el total de opciones (8 parejas = 16 cartas máximo)
const poolEmojis = ['🚀', '💻', '🔒', '📊', '⚡', '🛡️', '🐍', '☁️'];

// 1. FUENTE ÚNICA DE VERDAD: Estado ampliado con dificultad
const state = {
  cartas: [],             
  indicesVolteados: [],   
  paresEncontrados: 0,    
  movimientos: 0,         
  bloqueado: false,
  dificultad: 'dificil'   // 'facil', 'medio' o 'dificil'
};

// Referencias del DOM
const domTablero = document.getElementById('tablero');
const domMovimientos = document.getElementById('contador-movimientos');
const domRecord = document.getElementById('record-movimientos');
const domMensajeVictoria = document.getElementById('mensaje-victoria');
const btnReiniciar = document.getElementById('btn-reiniciar');
const selectDificultad = document.getElementById('select-dificultad');

// Algoritmo de Fisher-Yates para barajar
function barajar(array) {
  const nuevoArray = [...array];
  for (let i = nuevoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nuevoArray[i], nuevoArray[j]] = [nuevoArray[j], nuevoArray[i]];
  }
  return nuevoArray;
}

// Inicializa el juego basándose en la configuración del estado
function iniciarJuego() {
  // Sincronizamos el estado con la opción seleccionada en la UI
  state.dificultad = selectDificultad.value;

  // Determinamos cuántas parejas usaremos según la dificultad
  let cantidadPares = 8; // Por defecto: difícil
  if (state.dificultad === 'facil') cantidadPares = 4;
  if (state.dificultad === 'medio') cantidadPares = 6;

  // Recortamos el pool original y duplicamos para formar parejas
  const emojisSeleccionados = poolEmojis.slice(0, cantidadPares);
  const mazoCompleto = [...emojisSeleccionados, ...emojisSeleccionados];
  const mazoBarajado = barajar(mazoCompleto);

  // Mapeamos al estado de las cartas
  state.cartas = mazoBarajado.map(emoji => ({
    emoji: emoji,
    volteada: false,
    encontrada: false
  }));
  
  state.indicesVolteados = [];
  state.paresEncontrados = 0;
  state.movimientos = 0;
  state.bloqueado = false;

  domMensajeVictoria.classList.add('oculto');

  // Cargamos el récord histórico de este nivel específico
  actualizarRecordVisual();
  
  // Dibujamos la interfaz
  actualizarUI();
}

// Dibuja los componentes visuales leyendo exclusivamente el estado
function actualizarUI() {
  domMovimientos.textContent = state.movimientos;
  domTablero.innerHTML = ''; 

  state.cartas.forEach((carta, indice) => {
    const divCarta = document.createElement('div');
    divCarta.classList.add('carta');
    divCarta.dataset.indice = indice;

    if (carta.volteada || carta.encontrada) {
      divCarta.textContent = carta.emoji; // textContent seguro contra XSS
      divCarta.classList.add(carta.encontrada ? 'encontrada' : 'revelada');
    }

    domTablero.appendChild(divCarta);
  });
}

// Lee de localStorage el récord de la dificultad actual y lo renderiza
function actualizarRecordVisual() {
  const claveRecord = `record_memoria_${state.dificultad}`;
  const recordGuardado = localStorage.getItem(claveRecord);
  
  // Si existe registro lo muestra, de lo contrario pone un guion corto
  domRecord.textContent = recordGuardado ? recordGuardado : '-';
}

// Lógica de evaluación del turno
function verificarPar() {
  state.bloqueado = true; 

  const [indice1, indice2] = state.indicesVolteados;
  const carta1 = state.cartas[indice1];
  const carta2 = state.cartas[indice2];

  if (carta1.emoji === carta2.emoji) {
    carta1.encontrada = true;
    carta2.encontrada = true;
    state.paresEncontrados++;
    
    state.indicesVolteados = [];
    state.bloqueado = false;
    
    actualizarUI();

    // Condición de victoria basada en la cantidad de parejas del nivel actual
    let cantidadParesObjetivo = poolEmojis.slice(0, state.dificultad === 'facil' ? 4 : state.dificultad === 'medio' ? 6 : 8).length;
    
    if (state.paresEncontrados === cantidadParesObjetivo) {
      domMensajeVictoria.classList.remove('oculto');
      procesarRecordVictoria();
    }
  } else {
    setTimeout(() => {
      carta1.volteada = false;
      carta2.volteada = false;
      state.indicesVolteados = [];
      state.bloqueado = false; 
      actualizarUI();
    }, 1000);
  }
  
  actualizarUI();
}

// Gestiona el almacenamiento persistente del mejor puntaje
function procesarRecordVictoria() {
  const claveRecord = `record_memoria_${state.dificultad}`;
  const recordActual = localStorage.getItem(claveRecord);

  // Si no hay récord previo, o el puntaje actual tomó MENOS movimientos (es mejor)
  if (!recordActual || state.movimientos < Number(recordActual)) {
    localStorage.setItem(claveRecord, state.movimientos);
    actualizarRecordVisual();
  }
}

// --- DELEGACIÓN Y ESCUCHADORES DE EVENTOS ---

// Evento Click (Delegado en el contenedor padre)
domTablero.addEventListener('click', (evento) => {
  const elementoClickeado = evento.target.closest('.carta');
  if (!elementoClickeado) return; 

  const indice = Number(elementoClickeado.dataset.indice);

  if (state.bloqueado || state.cartas[indice].encontrada || state.cartas[indice].volteada) {
    return;
  }

  state.cartas[indice].volteada = true;
  state.indicesVolteados.push(indice);
  
  actualizarUI();

  if (state.indicesVolteados.length === 2) {
    state.movimientos++;
    verificarPar();
  }
});

// NUEVO TIPO DE EVENTO: Control 'change' para conmutar niveles de dificultad dinámicamente
selectDificultad.addEventListener('change', iniciarJuego);

// Evento Click para el botón de reinicio
btnReiniciar.addEventListener('click', iniciarJuego);

// Inicialización de la primera partida en la carga inicial
iniciarJuego();