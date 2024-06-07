# Reporte 4, Catrastofes
[Regreso al indice](/Indice.md)
## Modificación del Código

Ya teníamos el código gracias al archivo `CNN.ipynb` proporcionado por el profesor. Contiene todo lo necesario, desde la creación del modelo hasta el entrenamiento y los métodos para probarlo con imágenes. Solo fue necesario ajustar las rutas para cargar y guardar archivos.

## Estructura y Funcionamiento de las CNN

### Capas Convolucionales:

- **Convolución**: La operación fundamental en las CNN consiste en deslizar un filtro (o kernel) sobre una imagen y calcular productos puntuales entre el filtro y segmentos de la imagen para generar un mapa de características.
- **Filtros**: Estas pequeñas matrices se aplican repetidamente a toda la imagen. Capturan características locales como bordes, texturas y otros patrones visuales.
- **Mapas de Características**: Resaltan partes de la imagen que coinciden con los patrones aprendidos por los filtros.

### Capas de Pooling (Submuestreo):

- **Max Pooling**: Reduce la dimensionalidad de los mapas de características tomando el valor máximo en una ventana deslizante.
- **Average Pooling**: Similar al max pooling, pero toma el promedio de los valores en la ventana. Estas capas reducen la cantidad de parámetros y hacen que la red sea más robusta.

### Capas Completamente Conectadas (Fully Connected):

Al final de las capas convolucionales y de pooling, se añaden capas completamente conectadas. Cada neurona está conectada a todas las neuronas de la capa anterior. Estas capas actúan como clasificadores que procesan las características extraídas por las capas convolucionales.

### Función de Activación:

- **ReLU (Rectified Linear Unit)**: La función de activación más común en las CNN. Introduce no linealidad en la red y ayuda a manejar el problema del gradiente desaparecido.

## Aplicaciones de las CNN

Las aplicaciones de las CNN son diversas:

- **Reconocimiento y Clasificación de Imágenes**:
  - Identificación de objetos en imágenes (por ejemplo, perros, gatos, autos).
  - Reconocimiento facial.

- **Segmentación de Imágenes**:
  - Delineación de objetos dentro de una imagen, útil en campos como la medicina para identificar tumores en radiografías.

- **Detección de Objetos**:
  - Identificación y localización de múltiples objetos dentro de una imagen.

- **Análisis de Vídeo**:
  - Aplicación de técnicas de reconocimiento y seguimiento de objetos en secuencias de video.

- **Visión por Computadora en Automóviles Autónomos**:
  - Detección y clasificación de señales de tráfico, peatones y otros vehículos.
