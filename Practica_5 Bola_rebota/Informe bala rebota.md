# Reporte 5, Bola que rebota
[Regreso al indice](/Indice.md)
## Descripción General
Este proyecto consiste en un juego donde un personaje (jugador) debe evitar colisiones con una bala moviéndose en las direcciones derecha, izquierda, arriba y abajo. Para dotar al personaje de inteligencia, he integrado una red neuronal artificial (ANN) que aprende de los datos de entrenamiento y toma decisiones automáticamente.

## Modificaciones Realizadas al Código

El codigo es una modificion y combinacion de unos codigos de pharze, hacerca de uno que es el jugador se pueda mover de manera libro y otro donde hay 2 pelotas rebotando en todas las paredes, se inueron en uno solo, ademas de agregarle las redes neuronales, asi como cuales son las **salidas** y **entradas** y detalle que tenemos en el juego de 3 balas como el menu de pausa.


### Inicialización y Configuración

#### Inicialización de Variables y Constantes
- He inicializado variables para el estado del personaje, la bala, y otras variables de control del juego y de la red neuronal.
- He establecido las dimensiones del juego en 450x400 píxeles.

#### Configuración de Controles
- He añadido controles para mover el personaje a la derecha, a la izquierda, hacia arriba y hacia abajo (cursores).

#### Configuración de la Red Neuronal
- He configurado una red neuronal utilizando la librería Synaptic. La red tiene 5 entradas, 10 neuronas en la capa oculta y 4 salidas.
- He inicializado variables para el entrenamiento de la red neuronal (Network, Network_Entramiento, Network_Salida).

#### Interfaz de Usuario
- He añadido un botón de pausa y un menú de pausa (pausa_lateral, menu).

### Función `preload`
- He cargado los recursos gráficos del juego, incluyendo el fondo, el sprite del personaje y la imagen de la bala.

### Función `create`
- He inicializado los sistemas de física y gravedad del juego.
- He creado los objetos de juego: fondo, jugador y bala, y he habilitado sus físicas.
- He configurado las animaciones del jugador y he establecido una velocidad inicial aleatoria para la bala.
- He configurado el texto de pausa y habilitado la detección de entrada del usuario para pausar el juego.
- He inicializado la red neuronal y el conjunto de entrenamiento.

### Función `update`
La función `update` se llama en cada frame del juego y realiza las siguientes tareas:

#### Actualización del Fondo
- Desplazo el fondo horizontalmente para dar una sensación de movimiento continuo.

#### Modo de Movimiento Manual
- Cuando el juego no está en modo automático, el jugador se mueve según las teclas presionadas (`manejarMovimientoManual`).

#### Modo de Movimiento Automático
- Si el juego está en modo automático y hay datos de entrenamiento, la red neuronal toma decisiones basadas en los datos de entrada actuales (`manejarMovimientoAutomatico`).
- Si no hay datos de entrenamiento, el jugador se detiene.

#### Colisiones
- Detecto colisiones entre la bala y el jugador, y manejo la colisión llamando a la función `colisionar`.

### Función `resetGame`
- Reinicio las posiciones y velocidades del jugador y la bala para comenzar un nuevo juego.

### Función `colisionar`
- Activo el modo automático y pauso el juego.

### Función `setRandomBalaVelocity`
- Establezco una velocidad aleatoria para la bala utilizando un ángulo aleatorio y una velocidad base de 200.

### Función `registrarDatosEntrenamiento`
- Registro los datos de entrenamiento cuando el juego no está en modo automático y la bala está en movimiento.
- Los datos registrados incluyen las distancias y posiciones relativas entre el jugador y la bala, así como el estado de las teclas de movimiento.

### Función `pausar`
- Pauso el juego y muestro el menú de pausa.

### Función `manejarPausa`
- Manejo la reanudación del juego y la selección de opciones en el menú de pausa.
- Permito reiniciar el entrenamiento o activar el modo automático después de entrenar la red neuronal.

### Función `manejarMovimientoManual`
- Controlo el movimiento del jugador según las teclas presionadas.
- Registro los datos de entrenamiento si hubo un cambio en el movimiento.

### Función `manejarMovimientoAutomatico`
- Utilizo la red neuronal para tomar decisiones basadas en las entradas actuales (posiciones y distancias relativas de la bala y el jugador).
- Controlo el movimiento del jugador según las salidas de la red neuronal.

## Datos de Entrenamiento y Lógica

### Dataset
El dataset de entrenamiento consta de las siguientes entradas:
- Desplazamiento horizontal de la bala respecto al jugador (`dx`).
- Desplazamiento vertical de la bala respecto al jugador (`dy`).
- Distancia entre la bala y el jugador (`distancia`).
- Posición horizontal del jugador (`PX`).
- Posición vertical del jugador (`PY`).

Las salidas esperadas de la red neuronal son:
- Movimiento hacia la izquierda (`datosIzquierda`).
- Movimiento hacia la derecha (`datosDerecha`).
- Movimiento hacia arriba (`datosArriba`).
- Movimiento hacia abajo (`datosAbajo`).

### Lógica de Entrenamiento
- Entreno la red neuronal utilizando los datos recolectados durante el juego. Cuando el juego no está en modo automático, recopilo los datos de entrada y las decisiones tomadas por el jugador.
- En modo automático, la red neuronal utiliza los datos de entrada actuales para predecir las acciones a tomar (moverse a la derecha, a la izquierda, hacia arriba o hacia abajo).

### Lógica de Movimiento

#### Movimiento en Direcciones
- El personaje se mueve según las teclas presionadas (izquierda, derecha, arriba, abajo). En modo automático, la red neuronal decide el movimiento basado en las distancias y posiciones relativas de la bala y el jugador.

#### Evitación de Colisiones
- La lógica del juego incluye detección de colisiones entre el personaje y la bala. Cuando ocurre una colisión, el juego se pausa.
