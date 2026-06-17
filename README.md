Desiciones de diseño de la app

 Uspe delegación de eventos porque al regenerar el DOM con actualizarUI(), si tuviéramos un listener por carta, tendríamos que destruirlos y volverlos a crear cada vez. Un solo listener en el tablero principal es inmutable y mucho más eficiente para la memoria del navegador.

 Evité los bugs usando la variable state.bloqueado. Cuando entra al setTimeout, el state.bloqueado se vuelve true, esto crea una espera de 1 segundo en la que no se puede voltear otra carta mientras se ocultan las ya volteadas. Si intentas hacer un tercer clic rápido, el código choca contra la línea if (state.bloqueado) { return; } y no hace absolutamente nada, protegiendo la integridad del ciclo del juego.