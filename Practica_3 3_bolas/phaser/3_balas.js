var w = 800;
var h = 400;
var jugador;
var fondo;

var bala, balaD = false, nave;
var bala2, balaD2 = false, nave2;
var bala3, balaD3 = false, nave3;

var salto;

var moverDerecha;
var moverAtras;

var menu;

var velocidadBala;
var despBala;

var velocidadBala2;
var despBala2;

var velocidadBala3x;
var despBala3x;

var velocidadBala3y;
var despBala3y;

var estatusAire;
var estatuSuelo;

var nnNetwork, nnEntrenamiento, nnSalida, datosEntrenamiento = [];
var modoAuto = false, eCompleto = false;

var despDerTiempo;
var despAtrTiempo;

var estatusDerecha;
var estatusIzquierda;
var estatusAtras;
var estatusInicio;

var balas;

var jugadorGolpeado;
var regresandoDer;
var regresandoAtras;

var tiempoB3;
var tiempoB2;


var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    juego.load.image('fondo', 'assets/game/fondo_v3.jpeg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png', 32, 48);
    juego.load.image('nave', 'assets/game/bola_muerte.png');
    juego.load.image('bala', 'assets/sprites/purple_ball.png');
    juego.load.image('menu', 'assets/game/menu_v2.png');
}

function create() {
    
    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.physics.arcade.gravity.y = 800;
    juego.time.desiredFps = 30;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    nave = juego.add.sprite(w - 90, h - 40, 'nave');
    bala = juego.add.sprite(w - 100, h, 'bala');
    jugador = juego.add.sprite(50, h, 'mono');

    nave2 = juego.add.sprite(20, 10, 'nave');
    bala2 = juego.add.sprite(60, 70, 'bala');
    nave3 = juego.add.sprite(w - 200, 40, 'nave');
    bala3 = juego.add.sprite(600, 100, 'bala');

    juego.physics.enable(jugador);
    jugador.body.collideWorldBounds = true;
    var corre = jugador.animations.add('corre', [8, 9, 10, 11]);
    jugador.animations.play('corre', 10, true);

    juego.physics.enable(bala);
    bala.body.collideWorldBounds = true;

    juego.physics.enable(bala2);
    bala2.body.collideWorldBounds = true;
    juego.physics.enable(bala3);
    bala3.body.collideWorldBounds = true;

    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausa, self);
    juego.input.onDown.add(mPausa, self);

    salto = juego.input.keyboard.addKeys({
        'space': Phaser.Keyboard.SPACEBAR,
        'up': Phaser.Keyboard.UP
    });
    moverDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    moverAtras = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);

    nnNetwork = new synaptic.Architect.Perceptron(5, 12, 6);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);

    estatusDerecha = 0;
    estatusIzquierda = 1;
    estatusInicio = 1;
    estatusAtras = 0;

    despDerTiempo = 0;
    despAtrTiempo = 0;

    balas = juego.add.group();
    balas.add(bala);
    balas.add(bala2);
    balas.add(bala3);

    jugadorGolpeado = false;
    regresandoDer = false;
    regresandoAtras = false;

    tiempoB3 = 0;
    tiempoB2 = 0;
    scoreText = juego.add.text(100, 20, 'Tiempo: 0', { font: '20px Comic Sans MS', fill: '#ffffff' });
}

function enRedNeural() {
    nnEntrenamiento.train(datosEntrenamiento, { rate: 0.0003, iterations: 10000, shuffle: true });
}

function datosDeEntrenamiento(param_entrada) {
    console.log("Entrada", param_entrada[0] + " " + param_entrada[1] + " " + param_entrada[2] + " " + param_entrada[3] + " " + param_entrada[4]);
    nnSalida = nnNetwork.activate(param_entrada);
    var aire = Math.round(nnSalida[0] * 100);
    var piso = Math.round(nnSalida[1] * 100);
    var der = Math.round(nnSalida[2] * 100);
    var izq = Math.round(nnSalida[3] * 100);
    var atras = Math.round(nnSalida[4] * 100);
    var ini = Math.round(nnSalida[5] * 100);
    console.log("Valor ", "Aire %: " + aire + " Suelo %: " + piso + " Der %: " + der + " Izquierda %: " + izq + " Atras %: " + atras + " Inicio %: " + ini);
    return nnSalida[0] >= nnSalida[1];
}

function datosDeEntrenamiento2(param_entrada) {
    console.log("Entrada", param_entrada[0] + " " + param_entrada[1] + " " + param_entrada[2] + " " + param_entrada[3] + " " + param_entrada[4]);
    nnSalida = nnNetwork.activate(param_entrada);
    var aire = Math.round(nnSalida[0] * 100);
    var piso = Math.round(nnSalida[1] * 100);
    var der = Math.round(nnSalida[2] * 100);
    var izq = Math.round(nnSalida[3] * 100);
    var atras = Math.round(nnSalida[4] * 100);
    var ini = Math.round(nnSalida[5] * 100);
    console.log("Valor ", "Aire %: " + aire + " Suelo %: " + piso + " Der %: " + der + " Izquierda %: " + izq + " Atras %: " + atras + " Inicio %: " + ini);
    return nnSalida[2] >= nnSalida[3];
}

function datosDeEntrenamiento3(param_entrada) {
    console.log("Entrada", param_entrada[0] + " " + param_entrada[1] + " " + param_entrada[2] + " " + param_entrada[3] + " " + param_entrada[4]);
    nnSalida = nnNetwork.activate(param_entrada);
    var aire = Math.round(nnSalida[0] * 100);
    var piso = Math.round(nnSalida[1] * 100);
    var der = Math.round(nnSalida[2] * 100);
    var izq = Math.round(nnSalida[3] * 100);
    var atras = Math.round(nnSalida[4] * 100);
    var ini = Math.round(nnSalida[5] * 100);
    console.log("Valor ", "Aire %: " + aire + " Suelo %: " + piso + " Der %: " + der + " Izquierda %: " + izq + " Atras %: " + atras + " Inicio %: " + ini);
    return nnSalida[4] >= nnSalida[5];
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
                modoAuto = false;
                juego.time.reset(); // Reinicia el temporizador del juego
            } else if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 + 90 && mouse_y <= menu_y2) {
                if (!eCompleto) {
                    console.log("", "Entrenamiento " + datosEntrenamiento.length + " valores");
                    enRedNeural();
                    eCompleto = true;
                    juego.time.reset(); // Reinicia el temporizador del juego
                }
                modoAuto = true;
            }
            menu.destroy();
            resetVariables();
            balas.forEach(function (bala) {
                bala.body.checkCollision.none = false;
            });
            juego.paused = false;
            jugadorGolpeado = false;
            balaD2 = false;
            balaD3 = false;
        }
    }
}

function resetVariables() {
    jugador.body.velocity.x = 0;
    jugador.body.velocity.y = 0;
    bala.body.velocity.x = 0;
    bala.position.x = w - 100;
    jugador.position.x = 50;
    balaD = false;

    bala2.body.velocity.y = 0;
    bala2.position.y = 70;
    balaD2 = false;
    bala3.body.velocity.y = 0;
    bala3.body.velocity.x = 0;
    bala3.position.x = 600;
    bala3.position.y = 100;
    balaD3 = false;
    estatusDerecha = 0;
    estatusIzquierda = 1;
    despDerTiempo = 0;
    jugadorGolpeado = false;
    regresandoDer = false;

    estatusInicio = 1;
    estatusAtras = 0;
    despAtrTiempo = 0;
    regresandoAtras = false;

    tiempoB3 = 0;
    tiempoB2 = 0;
}

function saltar() {
    jugador.body.velocity.y = -270;
}

function moverseDer() {
    estatusIzquierda = 0;
    estatusDerecha = 1;
    jugador.position.x = 90;
    //jugador.position.x = Phaser.Math.linear(50, 90, 0.7);
    estatusAtras = 0;
    estatusInicio = 1;

    despAtrTiempo = 0;
    despDerTiempo = 0;

    regresandoAtras = false;
    regresandoDer = false;
}

function moverseAtr() {
    estatusIzquierda = 1;
    estatusDerecha = 0;
    jugador.position.x = 0;

    estatusAtras = 1;
    estatusInicio = 0;

    despAtrTiempo = 0;
    despDerTiempo = 0;

    regresandoAtras = false;
    regresandoDer = false;
}


function update() {
    fondo.tilePosition.x -= 1;
    juego.physics.arcade.collide(balas, jugador, colisionH, null, this);

    estatuSuelo = 1;
    estatusAire = 0;

    if (!jugador.body.onFloor()) {
        estatuSuelo = 0;
        estatusAire = 1;
    }

    despBala = Math.floor(jugador.position.x - bala.position.x);

    despBala2 = Math.floor(jugador.position.y - bala2.position.y);

    despBala3x = Math.floor(jugador.position.x - bala3.position.x);
    despBala3y = Math.floor(jugador.position.y - bala3.position.y);

    if (modoAuto == false && moverDerecha.isDown && estatusDerecha == 0) {
        moverseDer();
    }
    if (modoAuto == false && moverAtras.isDown && estatusAtras == 0) {
        moverseAtr();
    }
    if (modoAuto == true && bala2.position.y > 250 && (estatusDerecha == 0)) {
        if (datosDeEntrenamiento2([despBala, velocidadBala, despBala2, despBala3x, despBala3y])) {
            moverseDer();
        }
    }
    if (modoAuto == true && (bala3.position.y > 200 || bala3.position.x < 400) && (estatusAtras == 0)) {
        if (datosDeEntrenamiento3([despBala, velocidadBala, despBala2, despBala3x, despBala3y])) {
            moverseAtr();
        }
    }
    if (modoAuto == false && (salto.space.isDown || salto.up.isDown) && jugador.body.onFloor()) {
        saltar();
    }
    if (modoAuto == true && bala.position.x > 0 && jugador.body.onFloor()) {
        if (datosDeEntrenamiento([despBala, velocidadBala, despBala2, despBala3x, despBala3y])) {
            saltar();
        }
    }
    if (balaD == false) {
        disparo();
    }
    if (balaD2 == false && tiempoB2 >= 20) {
        disparo2();
    }
    if (balaD3 == false && tiempoB3 >= 45) {
        disparo3();
    }
    //visible false
    if (balaD3 == false) {
        bala3.position.x = 780;
        bala3.position.y = 380;
        bala3.body.velocity.y = 0;
        bala3.body.velocity.x = 0;
        bala3.visible = true;
        tiempoB3++;
    }
    if (balaD2 == false) {
        bala2.body.velocity.y = 0;
        bala2.body.velocity.x = 0;
        bala2.position.x = 780;
        bala2.position.y = 380;
        bala2.visible = true;
        tiempoB2++;
    }
    if (bala.position.x <= 0) {
        bala.body.velocity.x = 0;
        bala.position.x = w - 100;
        balaD = false;
    }
    if (bala2.position.y >= 310 && bala2.position.x <= 70 && balaD2 == true) {
        bala2.position.x = 750;
        bala2.position.y = 350;
        bala2.body.velocity.y = 0;
        bala2.body.velocity.x = 0;
        balaD2 = false;
        tiempoB2 = 0;
        bala2.visible = true;
    }
    if (bala3.position.y >= 380 && bala3.position.x <= 70 && balaD3 == true) {
        bala3.body.velocity.y = 0;
        bala3.body.velocity.x = 0;
        bala3.position.x = 600;
        bala3.position.y = 100;
        balaD3 = false;
        tiempoB3 = 0;
        bala3.visible = true;
    }
    if (modoAuto == false && bala.position.x > 0) {
        datosEntrenamiento.push({
            'input': [despBala, velocidadBala, despBala2, despBala3x, despBala3y],
            'output': [estatusAire, estatuSuelo, estatusDerecha, estatusIzquierda, estatusAtras, estatusInicio]
        });
        console.log("B1 vx, B2 vy, B3 vx, B3 vy: ",
            velocidadBala + " " + velocidadBala2 + " " + velocidadBala3x + " " + velocidadBala3y);

        console.log("B1 x, B2 y, B3 x, B3 y, B1 vx, B2 vy, B3 vx, B3 vy: ",
            despBala + " " + despBala2 + " " + despBala3x + " " + despBala3y);

        console.log("Estatus Aire, Estatus Derecha, Estatus Atras: ",
            estatusAire + " " + estatusDerecha + " " + estatusAtras + " ");
    }
    scoreText.text = 'Tiempo: ' + juego.time.totalElapsedSeconds().toFixed(2);
}

function disparo() {
    velocidadBala = -1 * velocidadRandom(200, 300);
    bala.body.velocity.y = 0;
    bala.body.velocity.x = velocidadBala;
    balaD = true;
}

function disparo2() {
    velocidadBala2 = 1 * velocidadRandom(0.2, 1);
    bala2.position.x = 60;
    bala2.position.y = 70;
    bala2.body.velocity.x = 0;
    bala2.body.velocity.y = velocidadBala2;
    balaD2 = true;
    bala2.visible = true;
}


var puedeDisparar = true;

function disparo3() {
    if (!puedeDisparar) return;

    puedeDisparar = false;
    setTimeout(function() {
        puedeDisparar = true;
    }, 8000); // 1000 milisegundos de retraso, ajusta este valor según sea necesario

    var targetX = 60;
    var targetY = h;
    var dx = targetX - bala3.x;
    var dy = targetY - bala3.y;
    var angle = Math.atan2(dy, dx);
    bala3.visible = true;
    velocidadBala3y = 1 * velocidadRandom(1, 2);
    velocidadBala3x = -640;
    bala3.position.x = 600;
    bala3.position.y = 100;
    bala3.body.velocity.x = velocidadBala3x;
    bala3.body.velocity.y = Math.sin(angle) * velocidadBala3y;
    balaD3 = true;
}

function colisionH() {
    if (!jugadorGolpeado) {
        balas.forEach(function (bala) {
            bala.body.checkCollision.none = true;
        });
        pausa();
        jugadorGolpeado = true;
    }
}

function velocidadRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function render() {
}

