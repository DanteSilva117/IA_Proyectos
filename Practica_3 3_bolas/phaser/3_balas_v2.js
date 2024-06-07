var w = 800;
var h = 400;
var player;
var fondo;

var ball, ballD = false, nave;
var ball2, ballD2 = false, nave2;
var ball3, ballD3 = false, nave3;

var salto;

var moverDerecha;
var moverAtras;

var menu;

var velocidadBall;
var desplazamientoBall;

var velocidadBall2;
var desplazamientoBall2;

var velocidadBall3x;
var desplazamientoBall3x;

var velocidadBall3y;
var desplazamientoBall3y;

var estatusAire;
var estatuSuelo;

var Network, Network_Entramiento, Network_Salida, datosEntrenamiento = [];
var modo_automatico = false, eCompleto = false;

var desplazamiento_derecha_tiempo;
var desplazamiento_atras_tiempo;

var estado_derecha;
var destado_izquierda;
var estado_atras;
var estado_inicial;

var balls;
var puedeDisparar = true;

var playerGolpeado;
//var regresandoDer;
//var regresandoAtras;

var tiempoB3;
var tiempoB2;


var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    juego.load.image('fondo', 'assets/game/fondo_v3.jpeg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png', 32, 48);
    juego.load.image('nave', 'assets/game/bola_muerte.png');
    juego.load.image('ball', 'assets/game/black_ball.png');
    juego.load.image('menu', 'assets/game/menu_v2.png');
}

function create() {
    
    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.physics.arcade.gravity.y = 800;
    juego.time.desiredFps = 30;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    nave = juego.add.sprite(w - 90, h - 40, 'nave');
    ball = juego.add.sprite(w - 100, h, 'ball');
    player = juego.add.sprite(50, h, 'mono');

    nave2 = juego.add.sprite(20, 10, 'nave');
    ball2 = juego.add.sprite(60, 70, 'ball');
    nave3 = juego.add.sprite(w - 200, 40, 'nave');
    ball3 = juego.add.sprite(600, 100, 'ball');

    juego.physics.enable(player);
    player.body.collideWorldBounds = true;
    var corre = player.animations.add('corre', [8, 9, 10, 11]);
    player.animations.play('corre', 10, true);

    juego.physics.enable(ball);
    ball.body.collideWorldBounds = true;

    juego.physics.enable(ball2);
    ball2.body.collideWorldBounds = true;
    juego.physics.enable(ball3);
    ball3.body.collideWorldBounds = true;

    pausa_lateral = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausa_lateral.inputEnabled = true;
    pausa_lateral.events.onInputUp.add(pausa, self);
    juego.input.onDown.add(mPausa, self);

    salto = juego.input.keyboard.addKeys({
        'space': Phaser.Keyboard.SPACEBAR,
        'up': Phaser.Keyboard.UP
    });
    moverDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    moverAtras = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);

    Network = new synaptic.Architect.Perceptron(5, 12, 6);
    Network_Entramiento = new synaptic.Trainer(Network);

    estado_derecha = 0;
    destado_izquierda = 1;
    estado_inicial = 1;
    estado_atras = 0;

    desplazamiento_derecha_tiempo = 0;
    desplazamiento_atras_tiempo = 0;

    balls = juego.add.group();
    balls.add(ball);
    balls.add(ball2);
    balls.add(ball3);

    playerGolpeado = false;
    regresandoDer = false;
    regresandoAtras = false;

    tiempoB3 = 0;
    tiempoB2 = 0;
    scoreText = juego.add.text(100, 20, 'Tiempo: 0', { font: '20px Comic Sans MS', fill: '#ffffff' });
}

function enRedNeural() {
    Network_Entramiento.train(datosEntrenamiento, { rate: 0.0003, iterations: 10000, shuffle: true });
}

function pausa() {
    juego.paused = true;
    menu = juego.add.sprite(w / 2, h / 2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
}

function mPausa(event) {
    if (juego.paused) {
        var menu_x1 = w / 2 - 270 / 2, menu_x2 = w / 2 + 270 / 2,
            menu_y1 = h / 2 - 180 / 2, menu_y2 = h / 2 + 180 / 2;
        var mouse_x = event.x,
            mouse_y = event.y;
        if (mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2) {
            if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 && mouse_y <= menu_y1 + 90) {
                eCompleto = false;
                datosEntrenamiento = [];
                modo_automatico = false;
                juego.time.reset(); // Reinicia el temporizador del juego
            } else if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 + 90 && mouse_y <= menu_y2) {
                if (!eCompleto) {
                    console.log("", "Entrenamiento " + datosEntrenamiento.length + " valores");
                    enRedNeural();
                    eCompleto = true;
                    juego.time.reset(); // Reinicia el temporizador del juego
                }
                modo_automatico = true;
            }
            menu.destroy();
            resetVariables();
            balls.forEach(function (ball) {
                ball.body.checkCollision.none = false;
            });
            juego.paused = false;
            playerGolpeado = false;
            ballD2 = false;
            ballD3 = false;
        }
    }
}

function update() {
    fondo.tilePosition.x -= 1;
    juego.physics.arcade.collide(balls, player, colisionH, null, this);

    estatuSuelo = 1;
    estatusAire = 0;

    if (!player.body.onFloor()) {
        estatuSuelo = 0;
        estatusAire = 1;
    }

    desplazamientoBall = Math.floor(player.position.x - ball.position.x);

    desplazamientoBall2 = Math.floor(player.position.y - ball2.position.y);

    desplazamientoBall3x = Math.floor(player.position.x - ball3.position.x);
    desplazamientoBall3y = Math.floor(player.position.y - ball3.position.y);

    if (modo_automatico == false && moverDerecha.isDown && estado_derecha == 0) {
        moverseDer();
    }
    if (modo_automatico == false && moverAtras.isDown && estado_atras == 0) {
        moverseAtr();
    }
    if (modo_automatico == true && ball2.position.y > 250 && (estado_derecha == 0)) {
        if (datosDeEntrenamiento2([desplazamientoBall, velocidadBall, desplazamientoBall2, desplazamientoBall3x, desplazamientoBall3y])) {
            moverseDer();
        }
    }
    if (modo_automatico == true && (ball3.position.y > 200 || ball3.position.x < 400) && (estado_atras == 0)) {
        if (datosDeEntrenamiento3([desplazamientoBall, velocidadBall, desplazamientoBall2, desplazamientoBall3x, desplazamientoBall3y])) {
            moverseAtr();
        }
    }
    if (modo_automatico == false && (salto.space.isDown || salto.up.isDown) && player.body.onFloor()) {
        saltar();
    }
    if (modo_automatico == true && ball.position.x > 0 && player.body.onFloor()) {
        if (datosDeEntrenamiento([desplazamientoBall, velocidadBall, desplazamientoBall2, desplazamientoBall3x, desplazamientoBall3y])) {
            saltar();
        }
    }
    if (ballD == false) {
        disparo();
    }
    if (ballD2 == false && tiempoB2 >= 20) {
        disparo2();
    }
    if (ballD3 == false && tiempoB3 >= 45) {
        disparo3();
    }
    //visible false
    if (ballD3 == false) {
        ball3.position.x = 780;
        ball3.position.y = 380;
        ball3.body.velocity.y = 0;
        ball3.body.velocity.x = 0;
        ball3.visible = true;
        tiempoB3++;
    }
    if (ballD2 == false) {
        ball2.body.velocity.y = 0;
        ball2.body.velocity.x = 0;
        ball2.position.x = 780;
        ball2.position.y = 380;
        ball2.visible = true;
        tiempoB2++;
    }
    if (ball.position.x <= 0) {
        ball.body.velocity.x = 0;
        ball.position.x = w - 100;
        ballD = false;
    }
    if (ball2.position.y >= 310 && ball2.position.x <= 70 && ballD2 == true) {
        ball2.position.x = 750;
        ball2.position.y = 350;
        ball2.body.velocity.y = 0;
        ball2.body.velocity.x = 0;
        ballD2 = false;
        tiempoB2 = 0;
        ball2.visible = true;
    }
    if (ball3.position.y >= 380 && ball3.position.x <= 70 && ballD3 == true) {
        ball3.body.velocity.y = 0;
        ball3.body.velocity.x = 0;
        ball3.position.x = 600;
        ball3.position.y = 100;
        ballD3 = false;
        tiempoB3 = 0;
        ball3.visible = true;
    }
    if (modo_automatico == false && ball.position.x > 0) {
        datosEntrenamiento.push({
            'input': [desplazamientoBall, velocidadBall, desplazamientoBall2, desplazamientoBall3x, desplazamientoBall3y],
            'output': [estatusAire, estatuSuelo, estado_derecha, destado_izquierda, estado_atras, estado_inicial]
        });
        console.log("B1 vx, B2 vy, B3 vx, B3 vy: ",
            velocidadBall + " " + velocidadBall2 + " " + velocidadBall3x + " " + velocidadBall3y);

        console.log("B1 x, B2 y, B3 x, B3 y, B1 vx, B2 vy, B3 vx, B3 vy: ",
            desplazamientoBall + " " + desplazamientoBall2 + " " + desplazamientoBall3x + " " + desplazamientoBall3y);

        console.log("Estatus Aire, Estatus Derecha, Estatus Atras: ",
            estatusAire + " " + estado_derecha + " " + estado_atras + " ");
    }
    scoreText.text = 'Tiempo: ' + juego.time.totalElapsedSeconds().toFixed(2);
}

function colisionH() {
    if (!playerGolpeado) {
        balls.forEach(function (ball) {
            ball.body.checkCollision.none = true;
        });
        pausa();
        playerGolpeado = true;
    }
}

function velocidadRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function render() {
}

function moverseDer() {
    destado_izquierda = 0;
    estado_derecha = 1;
    player.position.x = 90;
    //player.position.x = Phaser.Math.linear(50, 90, 0.7);
    estado_atras = 0;
    estado_inicial = 1;

    desplazamiento_atras_tiempo = 0;
    desplazamiento_derecha_tiempo = 0;

    regresandoAtras = false;
    regresandoDer = false;
}

function moverseAtr() {
    destado_izquierda = 1;
    estado_derecha = 0;
    player.position.x = 0;

    estado_atras = 1;
    estado_inicial = 0;

    desplazamiento_atras_tiempo = 0;
    desplazamiento_derecha_tiempo = 0;

    regresandoAtras = false;
    regresandoDer = false;
}

function disparo() {
    velocidadBall = -1 * velocidadRandom(200, 300);
    ball.body.velocity.y = 0;
    ball.body.velocity.x = velocidadBall;
    ballD = true;
}

function disparo2() {
    velocidadBall2 = 1 * velocidadRandom(0.2, 1);
    ball2.position.x = 60;
    ball2.position.y = 70;
    ball2.body.velocity.x = 0;
    ball2.body.velocity.y = velocidadBall2;
    ballD2 = true;
    ball2.visible = true;
}

function disparo3() {
    if (!puedeDisparar) return;

    puedeDisparar = false;
    setTimeout(function() {
        puedeDisparar = true;
    }, 8000); // 1000 milisegundos de retraso, ajusta este valor según sea necesario

    var targetX = 60;
    var targetY = h;
    var dx = targetX - ball3.x;
    var dy = targetY - ball3.y;
    var angle = Math.atan2(dy, dx);
    ball3.visible = true;
    velocidadBall3y = 1 * velocidadRandom(1, 2);
    velocidadBall3x = -640;
    ball3.position.x = 600;
    ball3.position.y = 100;
    ball3.body.velocity.x = velocidadBall3x;
    ball3.body.velocity.y = Math.sin(angle) * velocidadBall3y;
    ballD3 = true;
}

function datosDeEntrenamiento(param_entrada) {
    console.log("Entrada", param_entrada[0] + " " + param_entrada[1] + " " + param_entrada[2] + " " + param_entrada[3] + " " + param_entrada[4]);
    Network_Salida = Network.activate(param_entrada);
    var aire = Math.round(Network_Salida[0] * 100);
    var piso = Math.round(Network_Salida[1] * 100);
    var der = Math.round(Network_Salida[2] * 100);
    var izq = Math.round(Network_Salida[3] * 100);
    var atras = Math.round(Network_Salida[4] * 100);
    var ini = Math.round(Network_Salida[5] * 100);
    console.log("Valor ", "Aire %: " + aire + " Suelo %: " + piso + " Der %: " + der + " Izquierda %: " + izq + " Atras %: " + atras + " Inicio %: " + ini);
    return Network_Salida[0] >= Network_Salida[1];
}

function datosDeEntrenamiento2(param_entrada) {
    console.log("Entrada", param_entrada[0] + " " + param_entrada[1] + " " + param_entrada[2] + " " + param_entrada[3] + " " + param_entrada[4]);
    Network_Salida = Network.activate(param_entrada);
    var aire = Math.round(Network_Salida[0] * 100);
    var piso = Math.round(Network_Salida[1] * 100);
    var der = Math.round(Network_Salida[2] * 100);
    var izq = Math.round(Network_Salida[3] * 100);
    var atras = Math.round(Network_Salida[4] * 100);
    var ini = Math.round(Network_Salida[5] * 100);
    console.log("Valor ", "Aire %: " + aire + " Suelo %: " + piso + " Der %: " + der + " Izquierda %: " + izq + " Atras %: " + atras + " Inicio %: " + ini);
    return Network_Salida[2] >= Network_Salida[3];
}

function datosDeEntrenamiento3(param_entrada) {
    console.log("Entrada", param_entrada[0] + " " + param_entrada[1] + " " + param_entrada[2] + " " + param_entrada[3] + " " + param_entrada[4]);
    Network_Salida = Network.activate(param_entrada);
    var aire = Math.round(Network_Salida[0] * 100);
    var piso = Math.round(Network_Salida[1] * 100);
    var der = Math.round(Network_Salida[2] * 100);
    var izq = Math.round(Network_Salida[3] * 100);
    var atras = Math.round(Network_Salida[4] * 100);
    var ini = Math.round(Network_Salida[5] * 100);
    console.log("Valor ", "Aire %: " + aire + " Suelo %: " + piso + " Der %: " + der + " Izquierda %: " + izq + " Atras %: " + atras + " Inicio %: " + ini);
    return Network_Salida[4] >= Network_Salida[5];
}

function saltar() {
    player.body.velocity.y = -270;
}

function resetVariables() {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    ball.body.velocity.x = 0;
    ball.position.x = w - 100;
    player.position.x = 50;
    ballD = false;

    ball2.body.velocity.y = 0;
    ball2.position.y = 70;
    ballD2 = false;
    ball3.body.velocity.y = 0;
    ball3.body.velocity.x = 0;
    ball3.position.x = 600;
    ball3.position.y = 100;
    ballD3 = false;
    estado_derecha = 0;
    destado_izquierda = 1;
    desplazamiento_derecha_tiempo = 0;
    playerGolpeado = false;
    regresandoDer = false;

    estado_inicial = 1;
    estado_atras = 0;
    desplazamiento_atras_tiempo = 0;
    regresandoAtras = false;

    tiempoB3 = 0;
    tiempoB2 = 0;
}

