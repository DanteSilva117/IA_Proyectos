var w = 450,
    h = 400 
var jugador, 
    fondo, 
    bala
var cursores, 
    menu
var Network, 
    Network_Entramiento, 
    Network_Salida, 
    entrenamiento = []
var modo_automatico = false
var entrenamiento_completo = false
var entrenameinto_juego = 3
var juego_actual = 0
var PX = 200, PY = 200;
var REVERTIRV = false, REVERTIRH = false;

var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', {
    preload: preload,
    create: create,
    update: update,
    render: render,
})
function preload() {
    juego.load.image('fondo', 'assets/game/fondo_v3.jpeg')
    juego.load.spritesheet('mono', 'assets/sprites/altair.png', 32, 48)
    juego.load.image('menu', 'assets/game/menu_v2.png')
    juego.load.image('bala', 'assets/game/black_ball.png')
}
function create() {
    juego.physics.startSystem(Phaser.Physics.ARCADE)
    juego.physics.arcade.gravity.y = 0
    juego.time.desiredFps = 30

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo')
    jugador = juego.add.sprite(w / 2, h / 2, 'mono')
    juego.physics.enable(jugador)
    jugador.body.collideWorldBounds = true
    jugador.animations.add('corre', [8, 9, 10, 11])
    jugador.animations.play('corre', 10, true)

    bala = juego.add.sprite(0, 0, 'bala')
    juego.physics.enable(bala)
    bala.body.collideWorldBounds = true
    bala.body.bounce.set(1)
    setRandomBalaVelocity()

    pausa_lateral = juego.add.text(w - 100, 20, 'Pausa', {
        font: '20px Arial',
        fill: '#fff',
    })
    pausa_lateral.inputEnabled = true
    pausa_lateral.events.onInputUp.add(pausar, self)
    juego.input.onDown.add(manejarPausa, self)

    cursores = juego.input.keyboard.createCursorKeys()

    Network = new synaptic.Architect.Perceptron(5, 10, 4)
    Network_Entramiento = new synaptic.Trainer(Network)

}
function update() {
    fondo.tilePosition.x -= 1

    if (!modo_automatico) {
        manejarMovimientoManual()
    } else {
        if (entrenamiento.length > 0) {
            manejarMovimientoAutomatico()
        } else {
            jugador.body.velocity.x = 0
            jugador.body.velocity.y = 0
        }
    }

    juego.physics.arcade.collide(bala, jugador, colisionar, null, this)
}
function resetGame() {
    jugador.x = w / 2
    jugador.y = h / 2
    jugador.body.velocity.x = 0
    jugador.body.velocity.y = 0
    bala.x = 0
    bala.y = 0
    setRandomBalaVelocity()
}
function colisionar() {
    modo_automatico = true
    pausar()
}
function setRandomBalaVelocity() {
    var baseSpeed = 200
    var angle = juego.rnd.angle()
    bala.body.velocity.set(
        Math.cos(angle) * baseSpeed,
        Math.sin(angle) * baseSpeed,
    )
}
function registrarDatosEntrenamiento() {
    if (!modo_automatico && bala.position.x > 0) {
        var dx = bala.x - jugador.x
        var dy = bala.y - jugador.y
        var distancia = Math.sqrt(dx * dx + dy * dy)
        var datosIzquierda = cursores.left.isDown ? 1 : 0
        var datosDerecha = cursores.right.isDown ? 1 : 0
        var datosArriba = cursores.up.isDown ? 1 : 0
        var datosAbajo = cursores.down.isDown ? 1 : 0
        var movimiento = datosIzquierda || datosDerecha || datosArriba || datosAbajo

        if (movimiento) {
            PX = jugador.x
            PY = jugador.y

            entrenamiento.push({
                'input': [dx, dy, distancia, PX, PY],
                'output': [datosIzquierda, datosDerecha, datosArriba, datosAbajo, movimiento]
            })

            console.log('Datos de Entrenamiento Registrados')
        }
    }
}
function pausar() {
    juego.paused = true
    menu = juego.add.sprite(w / 2, h / 2, 'menu')
    menu.anchor.setTo(0.5, 0.5)
}
function manejarPausa(event) {
    if (juego.paused) {
        var menu_x1 = w / 2 - 270 / 2, menu_x2 = w / 2 + 270 / 2,
            menu_y1 = h / 2 - 180 / 2, menu_y2 = h / 2 + 180 / 2
        var mouse_x = event.x, mouse_y = event.y

        if (mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2) {
            if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 && mouse_y <= menu_y1 + 90) {
                entrenamientoCompleto = false
                entrenamiento = []
                modo_automatico = false
            } else if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 + 90 && mouse_y <= menu_y2) {
                if (!entrenamiento_completo && entrenamiento.length > 0) {
                    Network_Entramiento.train(entrenamiento, { rate: 0.0003, iterations: 10000, shuffle: true })
                    entrenamiento_completo = true
                }
                modo_automatico = true
            }
            menu.destroy()
            resetGame()
            juego.paused = false
        }
    }
}
function manejarMovimientoManual() {
    var prevX = jugador.body.velocity.x
    var prevY = jugador.body.velocity.y

    jugador.body.velocity.x = 0
    jugador.body.velocity.y = 0

    var moveLeft = cursores.left.isDown ? 1 : 0
    var moveRight = cursores.right.isDown ? 1 : 0
    var moveUp = cursores.up.isDown ? 1 : 0
    var moveDown = cursores.down.isDown ? 1 : 0

    if (moveLeft) {
        jugador.body.velocity.x = -300
    } else if (moveRight) {
        jugador.body.velocity.x = 300
    }

    if (moveUp) {
        jugador.body.velocity.y = -300
    } else if (moveDown) {
        jugador.body.velocity.y = 300
    }

    // Solo registrar si hubo un cambio en el movimiento
    if (jugador.body.velocity.x !== prevX || jugador.body.velocity.y !== prevY) {
        registrarDatosEntrenamiento()
    }

    // Mostrar los datos en la consola
    console.log('-------------------------------------------')
    console.log('Manual - Movimiento:')
    console.log(`Izquierda: ${moveLeft}`)
    console.log(`Derecha: ${moveRight}`)
    console.log(`Arriba: ${moveUp}`)
    console.log(`Abajo: ${moveDown}`)
}
function manejarMovimientoAutomatico() {
    var dx = bala.x - jugador.x
    var dy = bala.y - jugador.y
    var distancia = Math.sqrt(dx * dx + dy * dy)
    var input = [dx, dy, distancia, jugador.x, jugador.y]

    Network_Salida = Network.activate(input)

    var moveLeft = Network_Salida[0] > 0.5 ? 1 : 0
    var moveRight = Network_Salida[1] > 0.5 ? 1 : 0
    var moveUp = Network_Salida[2] > 0.5 ? 1 : 0
    var moveDown = Network_Salida[3] > 0.5 ? 1 : 0

    jugador.body.velocity.x = (moveRight - moveLeft) * 300
    jugador.body.velocity.y = (moveDown - moveUp) * 300

    console.log('-------------------------------------------')
    console.log('Auto - Movimiento:')
    console.log('Izquierda:', moveLeft)
    console.log('Derecha:', moveRight)
    console.log('Arriba:', moveUp)
    console.log('Abajo:', moveDown)
}
