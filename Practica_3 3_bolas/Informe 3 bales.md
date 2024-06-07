# Reporte practica 3, 3 pelotas
[Regreso al indice](/Indice.md)
## Descripción General
Este proyecto consiste en un juego donde mi personaje debe evitar colisiones con bolas y otros obstáculos moviéndose a la derecha, a la izquierda y saltando. Para mejorar la experiencia del juego y dotar al personaje de cierta inteligencia, he integrado una red neuronal artificial (ANN) que aprende de los datos de entrenamiento y toma decisiones automáticamente.

## Modificaciones Realizadas al Código

El codigo fue modificado de un codigo que el profe nos compartio que estaba en la carpeta **PHAZER**, es un Archivo java llamado `demo.js`, el cual le agregamos mas elementos como:
- **Mas naves**, una en la parte superios izquierda y la otra en la parte superior derecha.
- **Mas balas**, balas que selen desde las nuevas balas agregadas, que disparen en intervalos, dirigiendose hacia el jugador.
- **Mas salidas y entradas**, Agragar mas entradas, capas ocultas y salida de redes neuronales para el entremiento del personaje para que se pueda esquivar las balas.
- **Mas movimiento**, Agregar mas moviento al personaje, ademas del salto, agregar para que se mueva de izquierda a derecha.

#### Inicialización y Configuración
**Inicialización de Variables y Constantes:**
He inicializado variables para el estado del personaje, desplazamientos de las bolas y tiempos de espera (estado_derecha, estado_atras, desplazamiento_derecha_tiempo, desplazamiento_atras_tiempo, tiempoB2, tiempoB3, etc.).

**Configuración de Controles:**
He añadido controles para mover el personaje a la derecha, a la izquierda y para saltar (setupControls).

**Configuración de la Red Neuronal:**
He configurado una red neuronal utilizando la librería Synaptic (setupNeuralNetwork). La red tiene 5 entradas, 12 neuronas en la capa oculta y 6 salidas.

**Interfaz de Usuario:**
He añadido elementos de interfaz como el texto de pausa y el marcador de tiempo (setupUI).

#### Función update
La función `update` se llama en cada frame del juego y realiza las siguientes tareas:

- **Actualización del Fondo y Colisiones:**
  Actualizo la posición del fondo (`fondo.tilePosition.x`) y gestiono las colisiones entre las bolas y el jugador (`colisionH`).

- **Actualización de Desplazamientos y Estados:**
  Calculo los desplazamientos de las bolas respecto al jugador (`updateDisplacement`).
  Actualizo los estados de movimiento del jugador (`handlePlayerMovement`).

- **Modo Automático:**
  En modo automático, la red neuronal toma decisiones basadas en los datos de entrada actuales (`handleAutomaticMode`).

- **Disparos de Bolas:**
  Gestiono los disparos de las bolas y su visibilidad (`handleBallShooting`, `updateBallsVisibility`).

- **Recolección de Datos de Entrenamiento:**
  Recolecto datos de entrenamiento cuando el juego no está en modo automático (`collectTrainingData`).

#### Funciones de Movimiento
- `moverseDer` y `moverseAtr`: Estas funciones mueven al jugador a la derecha y a la izquierda respectivamente, actualizando sus estados y posiciones.

#### Funciones de Disparo
- `disparo`, `disparo2` y `disparo3`: Estas funciones controlan el disparo de las bolas, asignándoles velocidades aleatorias y actualizando sus posiciones.

#### Funciones de Entrenamiento de la Red Neuronal
- `datosDeEntrenamiento`, `datosDeEntrenamiento2` y `datosDeEntrenamiento3`: Estas funciones activan la red neuronal con los datos de entrada y devuelven la decisión de la red.

#### Función de Salto
- `saltar`: Esta función hace que el jugador salte estableciendo una velocidad vertical negativa.

#### Función de Pausa
- `pausa` y `mPausa`: Estas funciones controlan la pausa del juego, deteniendo todos los movimientos y animaciones.

## Datos de Entrenamiento y Lógica

### Dataset
El dataset de entrenamiento consta de las siguientes entradas:

- Desplazamiento horizontal del jugador respecto a la bola (`desplazamientoBall`).
- Velocidad de la bola (`velocidadBall`).
- Desplazamiento vertical de la segunda bola (`desplazamientoBall2`).
- Desplazamiento horizontal de la tercera bola (`desplazamientoBall3x`).
- Desplazamiento vertical de la tercera bola (`desplazamientoBall3y`).

Las salidas de la red neuronal son:

- Estado en el aire (`estatusAire`).
- Estado en el suelo (`estatuSuelo`).
- Estado moviéndose a la derecha (`estado_derecha`).
- Estado moviéndose a la izquierda (`destado_izquierda`).
- Estado inicial (`estado_inicial`).
- Estado moviéndose hacia atrás (`estado_atras`).

### Lógica de Entrenamiento
Entreno la red neuronal utilizando los datos recolectados durante el juego. Cuando el juego no está en modo automático, recopilo los datos de entrada y las decisiones tomadas por el jugador. En modo automático, la red neuronal utiliza los datos de entrada actuales para predecir las acciones a tomar (moverse a la derecha, moverse hacia atrás, o saltar).

## Análisis de los Juegos para el Movimiento del Personaje: Esquivar las Bolas

### Recolección de Datos
El primer paso para que la red neuronal aprenda a esquivar las bolas es recolectar datos de entrenamiento. Estos datos se recogen durante el juego cuando el jugador está controlado manualmente. Los datos incluyen:

#### Entradas:
- **Desplazamiento horizontal del jugador respecto a la primera bola (`desplazamientoBall`):** Este valor indica la distancia horizontal entre el jugador y la primera bola.
- **Velocidad de la primera bola (`velocidadBall`):** La velocidad horizontal de la primera bola.
- **Desplazamiento vertical de la segunda bola (`desplazamientoBall2`):** Este valor indica la distancia vertical entre el jugador y la segunda bola.
- **Desplazamiento horizontal de la tercera bola (`desplazamientoBall3x`):** La distancia horizontal entre el jugador y la tercera bola.
- **Desplazamiento vertical de la tercera bola (`desplazamientoBall3y`):** La distancia vertical entre el jugador y la tercera bola.

#### Salidas:
- **Estado en el aire (`estatusAire`):** Indica si el jugador está en el aire.
- **Estado en el suelo (`estatuSuelo`):** Indica si el jugador está en el suelo.
- **Estado moviéndose a la derecha (`estado_derecha`):** Indica si el jugador se está moviendo a la derecha.
- **Estado moviéndose a la izquierda (`destado_izquierda`):** Indica si el jugador se está moviendo a la izquierda.
- **Estado inicial (`estado_inicial`):** Indica si el jugador está en su estado inicial.
- **Estado moviéndose hacia atrás (`estado_atras`):** Indica si el jugador se está moviendo hacia atrás.

### Entrenamiento de la Red Neuronal
Utilizo los datos recolectados para entrenar la red neuronal utilizando la librería Synaptic. El entrenamiento se realiza con una tasa de aprendizaje pequeña y un alto número de iteraciones para asegurar que la red aprenda adecuadamente los patrones en los datos.

### Decisiones Automáticas
En modo automático, la red neuronal toma decisiones en cada frame del juego utilizando los valores actuales de desplazamiento y velocidad de las bolas como entradas. La red neuronal produce salidas que corresponden a las acciones que el jugador debe tomar (moverse a la derecha, moverse hacia atrás, saltar, etc.).

### Lógica de Movimiento
#### Movimiento a la Derecha e Izquierda:
El personaje se mueve a la derecha cuando se presiona la tecla correspondiente y a la izquierda cuando se presiona la tecla opuesta. En modo automático, la red neuronal decide el movimiento basado en los desplazamientos y velocidades de las bolas.

#### Salto:
El personaje salta cuando se presiona la tecla de salto y está en el suelo. En modo automático, la red neuronal decide cuándo saltar.

#### Evitación de Colisiones:
La lógica del juego incluye detección de colisiones entre el personaje y las bolas. Cuando ocurre una colisión, el juego se pausa.
