# Proyecto: Juego de Memoria en JavaScript Vanilla
## 1. Ayuda de la IA
 * La IA me ayudó a construir toda la estructura del juego, el index.html, app.js, styles.css y auditar el código defectuoso, además de corregir. También me apoyé con otra IA para optimizar aún más el código entregado.

## 1.1. Calidad del código entregado por la IA 

 * Duplicación de actualizarUI() en verificarPar() en el archivo app.js

     Hay un llamado a actualizarUI() dentro del if de coincidencia, dentro del setTimeout y otra vez al final de la función, Lo que provoca renderizados redundantes. Se eliminó éste último optimizando el renderizado del DOM.

 * Cálculo de cantidadParesObjetivo

     La IA usó slice de poolEmojis, es más simple y limpio reutilizar la misma lógica que se usa en iniciarJuego:

     const cantidadParesObjetivo = state.dificultad === 'facil' ? 4 :
                              state.dificultad === 'medio' ? 6 : 8;
     
     Así evitar recalcular con slice.

 *  En la función actualizarUI()

    Creó el elemento de las cartas con "div" lo cuál no está mal, pero es mejor usar "button", ya  que es un elemento enfocable y el navegador lo reconoce al querer acceder con el teclado y no solo con el mouse, lo que mejora la accesibilidad hacia los usuarios. 


## 2. Desiciones de diseño de la app

 * Usé delegación de eventos porque al regenerar el DOM con actualizarUI(), si tuviéramos un listener por carta, tendríamos que destruirlos y volverlos a crear cada vez. Un solo listener en el tablero principal es inmutable y mucho más eficiente para la memoria del navegador.

 * Evité los bugs usando la variable state.bloqueado. Cuando entra al setTimeout, el state.bloqueado se vuelve true, esto crea una espera de 1 segundo en la que no se puede voltear otra carta mientras se ocultan las ya volteadas. Si intentas hacer un tercer clic rápido, el código choca contra la línea if (state.bloqueado) { return; } y no hace absolutamente nada, protegiendo la integridad del ciclo del juego.

* Para evitar XSS en lugar de usar `innerHTML`, usé `textContent` y creé las etiquetas con `createElement`. Esto significa que si un jugador intenta hacer trampa escribiendo código raro en su nombre, el juego lo leerá como simple texto inofensivo y no será hackeado.

## 3. Mejoras a futuro

* Lo arreglaría estéticamente para que sea atractivo hacia el usuario, agregaría animaciones, música, sonidos.
* Un modo contrareloj para que sea más desafiante.
* Un sistema de vidas.
* Perfiles de jugadores y ranking global para que compitan los jugadores por el record.
* Guardado en la nube para que los jugadores conserven sus puntajes.
