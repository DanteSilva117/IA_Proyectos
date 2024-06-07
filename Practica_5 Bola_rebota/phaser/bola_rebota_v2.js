// Establece el ancho y alto del juego
var w = 500,
    h = 450;

// Variables para los elementos del juego
var player,
    fondo,
    pelota;

// Variables para controlar el movimiento vertical y horizontal
var verticalVol = false,
    verticalHor = false;

// Variables para el control del teclado y del menú
var cursor,
    menu;

// Variables para controlar el estado del player en diferentes direcciones
var estadoIzquierda,
    estadoDerecha,
    estadoArriba,
    estadoBOT,
    estadoMover;

// Variables para la red neuronal y su entrenamiento
var Network,
    Network_Entramiento,
    Network_Salida,
    datosEntrenamiento = [];

// Variables para el modo automático y el estado del juego
var modoAuto = false,
    entrenamiento_completo = false;

// Posición inicial del player
var playen_X = 200,
    player_Y = 200;

// Variable para el modo automático
var modo_automatico = false;

// Inicializa el juego con Phaser.Game, especificando el ancho, alto, tipo de renderizado y funciones de carga, creación, actualización y renderizado.
var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
  // Carga la imagen de fondo del juego
  juego.load.image('fondo', 'assets/game/fondo_v2.png');
  // Carga el spritesheet del player
  juego.load.spritesheet('mono', 'assets/sprites/altair.png', 32, 48);
  // Carga la imagen del menú
  juego.load.image('menu', 'assets/game/menu_v2.png');
  // Carga la imagen de la pelota
  juego.load.image('pelota', 'assets/sprites/purple_ball.png');
  // Carga el archivo de sonido para el sonido de Game Over
  juego.load.audio('gameOverSound', 'assets/audio/game_over.wav');
}

function create() {
  // Iniciar el sistema de física de Arcade de Phaser
  juego.physics.startSystem(Phaser.Physics.ARCADE);
  // Establecer la gravedad en el eje Y como cero
  juego.physics.arcade.gravity.y = 0;
  // Establecer el FPS deseado del juego
  juego.time.desiredFps = 60;
  // Añadir el fondo como un tileSprite que ocupa todo el tamaño del juego
  fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
  // Añadir el player en el centro del juego
  player = juego.add.sprite(w / 2, h / 2, 'mono');
  // Habilitar la física para el player
  juego.physics.enable(player);
  // Permitir que el player colisione con los bordes del mundo
  player.body.collideWorldBounds = true;
  // Crear la animación de correr para el player
  var corre = player.animations.add('corre', [8, 9, 10, 11]);
  player.animations.play('corre', 10, true);
  // Añadir la pelota en la esquina superior izquierda
  pelota = juego.add.sprite(0, 0, 'pelota');
  juego.physics.enable(pelota);
  pelota.body.collideWorldBounds = true;
  // Hacer que la pelota rebote cuando colisione con los bordes del mundo
  pelota.body.bounce.set(1);
  // Establecer una velocidad inicial aleatoria para la pelota
  setRandompelotaVelocity();
  // Crear un texto de pausa en la esquina superior derecha
  pause_lateral = juego.add.text(w - 100, 20, 'Pausa', {
    font: '20px Comic Sans MS',
    fill: '#fff',
  });
  // Habilitar la interacción con el texto de pausa
  pause_lateral.inputEnabled = true;
  // Configurar un evento de clic para el texto de pausa
  pause_lateral.events.onInputUp.add(pausa, self);
  // Configurar un evento de clic en cualquier parte de la pantalla para pausar el juego
  juego.input.onDown.add(mPausa, self);
  // Crear las teclas de dirección
  cursor = juego.input.keyboard.createCursorKeys();
  // Crear una red neuronal con 5 entradas, 6 neuronas en la capa oculta y 5 salidas
  Network = new synaptic.Architect.Perceptron(5, 6, 6, 6, 5);
  // Crear un entrenador para la red neuronal
  Network_Entramiento = new synaptic.Trainer(Network);
  // Añadir un texto para mostrar el puntaje en la esquina superior izquierda
  puntuacion = juego.add.text(20, 20, 'Tiempo: 0', { font: '20px Comic Sans MS', fill: '#ffffff' });
}

function redNeuronal() {
  // Entrena la red neuronal con los datos proporcionados en datosEntrenamiento
  Network_Entramiento.train(datosEntrenamiento, {
    rate: 0.0003,      // Tasa de aprendizaje
    iterations: 10000, // Número de iteraciones de entrenamiento
    shuffle: true,     // Mezcla los datos de entrenamiento antes de cada iteración
  });
}

function vertical(param_entrada) {
  // Imprimir información de depuración sobre los datos de entrada
  //console.log('DATOS VERTICALES-------------------');
  console.log(
    'DATOS VERTICALES-------------------' +
    'Datos Entrada Vertical:' +
      '\n Izquierdo:' +
      param_entrada[0] +
      '\n Derecha:' +
      param_entrada[1] +
      '\n Arriba:' +
      param_entrada[2] +
      '\n Abajo:' +
      param_entrada[3]
  );
  // Activar la red neuronal con los datos de entrada
  Network_Salida = Network.activate(param_entrada);
  //###################################################3
  // Redondear las salidas de la red neuronal para facilitar la interpretación
  // var Izquierda = Math.round(Network_Salida[0] * 100),
  //   Derecha = Math.round(Network_Salida[1] * 100);
  var Topv = Math.round(Network_Salida[2] * 100)
      Bottom = Math.round(Network_Salida[3] * 100);
  // var distX = Math.round(Network_Salida[4] * 100);
  // Comprobar si la entrada vertical está por debajo de cierto umbral y si la salida indica un movimiento hacia arriba no determinante
  if (param_entrada[2] < 80) {
    if (Topv > 35 && Topv < 65) {
      return false; // Si la salida de la red está dentro de cierto rango, retorna false
    }
  }
  // Determinar si el movimiento hacia arriba es más probable que el movimiento hacia abajo basado en las salidas de la red
  return Network_Salida[2] >= Network_Salida[3];
}

function horizontal(param_entrada) {
  // Imprimir información de depuración sobre los datos de entrada
  //console.log('DATOS HORIZONTAL-------------------');
  console.log(
    'DATOS HORIZONTAL-------------------' +
    'Datos Entrada Vertical:' +
    '\n Izquierdo:' +
    param_entrada[0] +
    '\n Derecha:' +
    param_entrada[1] +
    '\n Arriba:' +
    param_entrada[2] +
    '\n Abajo:' +
    param_entrada[3]
  );
  // Activar la red neuronal con los datos de entrada
  Network_Salida = Network.activate(param_entrada);
  // Redondear las salidas de la red neuronal para facilitar la interpretación
  var Izquierda = Math.round(Network_Salida[0] * 100),
    Derecha = Math.round(Network_Salida[1] * 100);
  var Topv = Math.round(Network_Salida[2] * 100),
    Bottom = Math.round(Network_Salida[3] * 100);
  var distX = Math.round(Network_Salida[4] * 100);
  // Comprobar si la entrada vertical está por debajo de cierto umbral y si la salida indica un movimiento hacia la derecha no determinante
  if (param_entrada[2] < 80) {
    if (Derecha > 40 && Derecha < 55) {
      return false; // Si la salida de la red está dentro de cierto rango, retorna false
    }
  }
  // Determinar si el movimiento hacia la izquierda es más probable que el movimiento hacia la derecha basado en las salidas de la red
  return Network_Salida[0] >= Network_Salida[1];
}

function movimiento(param_entrada) {
  // Imprimir información de depuración sobre los datos de entrada
  //console.log('DATOS MOVIMIENTOS-------------------');
  console.log(
    'DATOS MOVIMIENTOS-------------------' +
    'Datos Movimientos:' +
    '\n Izquierdo:' +
    param_entrada[0] +
    '\n Derecha:' +
    param_entrada[1] +
    '\n Arriba:' +
    param_entrada[2] +
    '\n Abajo:' +
    param_entrada[3]
  );
  // Activar la red neuronal con los datos de entrada
  Network_Salida = Network.activate(param_entrada);
  // Redondear las salidas de la red neuronal para facilitar la interpretación
  var Izquierda = Math.round(Network_Salida[0] * 100),
    Derecha = Math.round(Network_Salida[1] * 100);
  var Topv = Math.round(Network_Salida[2] * 100),
    Bottom = Math.round(Network_Salida[3] * 100);
  var distX = Math.round(Network_Salida[4] * 100);
  // Comprobar si la entrada vertical está por debajo de cierto umbral y si la salida indica un movimiento hacia la derecha no determinante
  if (param_entrada[2] < 80) {
    if (Derecha > 40 && Derecha < 55) {
      return false; // Si la salida de la red está dentro de cierto rango, retorna false
    }
  }
  // Determinar si la distancia horizontal es mayor o igual a un cierto umbral basado en las salidas de la red
  return Network_Salida[4] * 100 >= 20;
}

function pausa() {
  juego.paused = true; // Pausar el juego
  // Añadir un sprite para representar el menú de pausa en el centro de la pantalla
  menu = juego.add.sprite(w / 2, h / 2, 'menu');
  // Establecer el punto de anclaje del sprite en su centro
  menu.anchor.setTo(0.5, 0.5);
}

function mPausa(event) {
  // Verifica si el juego está pausado
  if (juego.paused) {
    // Define las coordenadas del área del menú de pausa
    var menu_x1 = w / 2 - 270 / 2,
      menu_x2 = w / 2 + 270 / 2,
      menu_y1 = h / 2 - 180 / 2,
      menu_y2 = h / 2 + 180 / 2;

    // Obtiene las coordenadas del clic del mouse
    var mouse_x = event.x,
      mouse_y = event.y;

    // Comprueba si el clic está dentro del área del menú de pausa
    if (
      mouse_x > menu_x1 &&
      mouse_x < menu_x2 &&
      mouse_y > menu_y1 &&
      mouse_y < menu_y2
    ) {
      // Si el clic está en la mitad superior del menú (modo manual)
      if (
        mouse_x >= menu_x1 &&
        mouse_x <= menu_x2 &&
        mouse_y >= menu_y1 &&
        mouse_y <= menu_y1 + 90
      ) {
        // Resetea las variables relacionadas con el modo manual
        entrenamiento_completo = false; // Marca que el entrenamiento no está completo
        datosEntrenamiento = []; // Reinicia los datos de entrenamiento
        modoAuto = false; // Activa el modo manual
        modo_automatico = false; // Desactiva el modo automático
        juego.time.reset(); // Reinicia el temporizador del juego
      }
      // Si el clic está en la mitad inferior del menú (modo automático)
      else if (
        mouse_x >= menu_x1 &&
        mouse_x <= menu_x2 &&
        mouse_y >= menu_y1 + 90 &&
        mouse_y <= menu_y2
      ) {
        // Si el entrenamiento no está completo, entrena la red neuronal
        if (!entrenamiento_completo) {
          console.log(
            'Entrenamiento ' + datosEntrenamiento.length + ' valores'
          );
          redNeuronal(); // Llama a la función para entrenar la red neuronal
          entrenamiento_completo = true; // Marca que el entrenamiento está completo
        }
        modoAuto = true; // Activa el modo automático
        modo_automatico = true; // Activa el modo automático
        juego.time.reset(); // Reinicia el temporizador del juego
      }

      menu.destroy(); // Destruye el menú de pausa
      resetGame(); // Resetea el juego
      juego.time.reset(); // Reinicia el temporizador del juego
      juego.paused = false; // Reanuda el juego
    }
  }
}

function resetGame() {
  // Resetear la posición y velocidad del player al centro del juego
  player.x = w / 2;
  player.y = h / 2;
  player.body.velocity.x = 0; // Detener la velocidad horizontal del player
  player.body.velocity.y = 0; // Detener la velocidad vertical del player
  // Resetear la posición de la pelota y establecer una velocidad inicial aleatoria
  pelota.x = 0;
  pelota.y = 0;
  setRandompelotaVelocity(); // Establecer una velocidad inicial aleatoria para la pelota
  // Reiniciar el tiempo del juego
  juego.time.reset();
}

function setRandompelotaVelocity() {
  // Define la velocidad máxima de la pelota
  var speed = 550;
  // // Genera un ángulo aleatorio para la dirección de la pelota
  var angle = juego.rnd.angle();
  // // Calcula las componentes x e y de la velocidad basadas en el ángulo y la velocidad máxima
  pelota.body.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed);
  //  // Define un ángulo específico en grados
  // var angleInDegrees = 18;
  // // Convierte el ángulo a radianes
  // var angle = angleInDegrees * (Math.PI / 180);
  // // Calcula las componentes x e y de la velocidad basadas en el ángulo y la velocidad máxima
  // pelota.body.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed);
}


function update() {
  fondo.tilePosition.x -= 1 // Mover el fondo para crear efecto de desplazamiento

  if (!modo_automatico) {
    // Resetear velocidad del player
    player.body.velocity.x = 0
    player.body.velocity.y = 0

    // Movimiento del player con teclas de dirección
    if (cursor.left.isDown) {
      player.body.velocity.x = -300 // Mover a la izquierda
    } else if (cursor.right.isDown) {
      player.body.velocity.x = 300 // Mover a la derecha
    }

    if (cursor.up.isDown) {
      player.body.velocity.y = -300 // Mover hacia arriba
    } else if (cursor.down.isDown) {
      player.body.velocity.y = 300 // Mover hacia abajo
    }
  }

  // Colisionar la pelota con el player
  juego.physics.arcade.collide(pelota, player,  colision, null, this)

  // Calcular la distancia entre la pelota y el player
  var dx = pelota.x - player.x
  var dy = pelota.y - player.y
  var distancia = Math.sqrt(dx * dx + dy * dy) // Fórmula de distancia euclidiana, verifica las coordenadas x,y

    ; (estadoIzquierda = 0),
      (estadoDerecha = 0),
      (estadoArriba = 0),
      (estadoBOT = 0),
      (estadoMover = 0)

  if (!modo_automatico) {
    // Si la pelota está a la derecha, moverse a la izquierda, y viceversa
    if (dx > 0) {
      estadoIzquierda = 1
      estadoMover = 1
    } else {
      estadoDerecha = 1 // Mover a la derecha
    }

    // Si la pelota está abajo, moverse hacia arriba, y viceversa
    if (dy > 0) {
      estadoArriba = 1 // Mover hacia arriba
    } else {
      estadoBOT = 1 // Mover hacia abajo
    }

    if (player.body.velocity.x != 0 || player.body.velocity.y != 0) {
      estadoMover = 1
    } else {
      estadoMover = 0
    }
  }

  if (modo_automatico && movimiento([dx, dy, distancia, playen_X, player_Y])) {
    if (distancia <= 150) {
      console.log(
        'REGRESO DEL METODO VERTICAL: ' +
        vertical([dx, dy, distancia, playen_X, player_Y]) +
        '\nREGRESO DEL METODO HORIZONTAL: ' +
        horizontal([dx, dy, distancia, playen_X, player_Y]),
      )

      if (
        vertical([dx, dy, distancia, playen_X, player_Y]) &&
        !verticalVol
      ) {
        // Mover hacia arriba si vertical es true
        player.body.velocity.y -= 35
      } else if (
        !vertical([dx, dy, distancia, playen_X, player_Y]) &&
        !verticalVol &&
        distancia <= 95
      ) {
        // Mover hacia abajo si vertical es false
        player.body.velocity.y += 35
      }

      if (
        horizontal([dx, dy, distancia, playen_X, player_Y]) &&
        !verticalHor
      ) {
        // Mover hacia arriba si horizontal es true
        player.body.velocity.x -= 35
      } else if (
        !horizontal([dx, dy, distancia, playen_X, player_Y]) &&
        !verticalHor &&
        distancia <= 95
      ) {
        // Mover hacia abajo si horizontal es false
        player.body.velocity.x += 35
      }

      // Ajustar la velocidad para que vuelva lentamente al centro si no está en movimiento
      if (player.x > 300) {
        player.body.velocity.x = -350 // Mover lentamente hacia arriba
        verticalHor = true
      } else if (player.x < 100) {
        player.body.velocity.x = 350 // Mover lentamente hacia abajo
        verticalHor = true
      } else if (verticalHor && player.x > 150 && player.x < 250) {
        player.body.velocity.x = 0
        verticalHor = false
      } else if (
        horizontal([dx, dy, distancia, playen_X, player_Y]) &&
        player.body.velocity.x != 0
      ) {
        verticalHor = false
        verticalVol = false
      }

      // Ajustar la velocidad para que vuelva lentamente al centro si no está en movimiento
      if (player.y > 300) {
        player.body.velocity.y = -350 // Mover lentamente hacia arriba
        verticalVol = true
      } else if (player.y < 100) {
        player.body.velocity.y = 350 // Mover lentamente hacia abajo
        verticalVol = true
      } else if (verticalVol && player.y > 150 && player.y < 250) {
        player.body.velocity.y = 0
        verticalVol = false
      } else if (
        vertical([dx, dy, distancia, playen_X, player_Y]) &&
        player.body.velocity.y != 0
      ) {
        verticalHor = false
        verticalVol = false
        verticalHor = false
        verticalVol = false
      }
    } else if (distancia >= 200) {
      player.body.velocity.y = 0
      player.body.velocity.x = 0
    }
  }

  if (modoAuto == false && pelota.position.x > 0) {
    playen_X = player.x
    player_Y = player.y

    datosEntrenamiento.push({
      input: [dx, dy, distancia, playen_X, player_Y],
      output: [estadoIzquierda, estadoDerecha, estadoArriba, estadoBOT, estadoMover],
    })

    console.log(
      'DATOS RECIBIDOS --------------\n' +
      'Distancia en el eje X: ',
      dx + '\n' + 'Distancia en el eje Y: ',
      dy + '\n' + 'Distancia: ',
      distancia + '\n' + 'Distancia del player en X: ',
      player.x + '\n' + 'Distancia del player en Y: ',
      player.y + '\n' + 'pelota en el eje X: ',
      pelota.x + '\n' + 'pelota en el eje Y: ',
      pelota.y + '\n\n',
    )

    console.log(
      'DATOS DE MOVIMIENTO --------------\n' +
      'Movimiento en Izquierda: ',
      estadoIzquierda + '\n' + 'Movimiento en Derecha: ',
      estadoDerecha + '\n' + 'Movimiento hacia Arriba: ',
      estadoArriba + '\n' + 'Movimiento hacia Abajo: ',
      estadoBOT + '\n',
    )
  }
  puntuacion.text = 'Tiempo: ' + juego.time.totalElapsedSeconds().toFixed(2);
}

// Función que se ejecuta cuando hay una colisión
function  colision() {
  modo_automatico = true; // Activa el modo automático tras la colisión
  pausa(); // Pausa el juego en caso de colisión
}

// Función de renderizado opcional para mostrar información adicional sobre el juego
function render() {
  
}

// Evento de pulsación de tecla
window.addEventListener('keydown', function (event) {
  // Verifica si la tecla pulsada es la barra espaciadora (código de tecla 32)
  if (event.code === 'Space') {
    pausa(); // Muestra el menú de pausa
    mPausa(); // Pausa el juego
  }
});
