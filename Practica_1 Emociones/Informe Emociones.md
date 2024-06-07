# Reporte de Practica 1 Emociones

[Regreso al indice](/README.md)

## Cómo realicé el código

Este código lo modifiqué a partir de unos códigos que el profesor ya tenía. Contaba con la parte de detección de rostros, así que únicamente lo ajusté para que capture fotograma por fotograma enfocado en la cara, gracias también al `haarcascade_frontalface_alt.xml`.

El código de entrenamiento fue el `cargaimagen78.ipynd`, lo modifiqué principalmente en las rutas. En este archivo también estaba la parte para poner a prueba el `.xml` que entrené.

**¿Porque el uso de LBPHF?**
Decidí usar el algoritmo LBPH, principalmente porque sus tiempos de entrenamiento son muy cortos y facilita la obtención hacer pruevas en del xml por si se ocupa entrenar mas.

## Explicación del código

Este código en Python utiliza la biblioteca OpenCV para entrenar un modelo de reconocimiento facial utilizando el algoritmo LBPH (Local Binary Patterns Histograms).

Primero, establezco la ruta al conjunto de datos de imágenes de caras con `dataSet = 'bd\emociones'`. Luego, utilizo `os.listdir(dataSet)` para obtener una lista de todos los archivos en ese directorio, que asumo son imágenes de caras. Esta lista se imprime en la consola.

Después, inicializo tres listas vacías: `labels`, `facesData` y `label`. `labels` y `facesData` se llenarán con los datos de las imágenes y sus respectivas etiquetas. `label` es un contador que incremento para cada cara en el conjunto de datos.

El código luego entra en un bucle for que recorre cada cara en la lista de caras. Para cada cara, crea una ruta al archivo de la imagen, luego abre esa imagen y la añade a la lista `facesData`. También añado la etiqueta actual a la lista `labels`. Luego incremento la etiqueta.

Finalmente, creo un objeto `LBPHFaceRecognizer` utilizando `cv.face.LBPHFaceRecognizer_create()`. Entreno este reconocedor con los datos de las caras y las etiquetas utilizando `faceRecognizer.train(facesData, np.array(labels))`. Luego guardo este reconocedor entrenado en un archivo llamado 'carasLBPHFace.xml' para su uso futuro.

---

El algoritmo LBPH es un método popular para el reconocimiento facial que puede ser más eficiente y preciso que otros métodos para ciertos conjuntos de datos.

Este código es un ejemplo de reconocimiento facial utilizando la biblioteca OpenCV en Python. Aquí está lo que hace cada parte del código:

1. Importo las bibliotecas necesarias: `cv2` para el procesamiento de imágenes y `os` para las operaciones del sistema operativo. Sin embargo, parece que `os` no se utiliza en este código.

2. Creo un objeto `faceRecognizer` utilizando el método `LBPHFaceRecognizer_create()`. Este objeto se utiliza para reconocer caras en las imágenes.

3. Leo un archivo XML que contiene el modelo de reconocimiento facial entrenado.

4. Abro la cámara del dispositivo (indicado por el `0` en `cv.VideoCapture(0)`) para capturar video en tiempo real.

5. Cargo el clasificador de rostros Haar Cascade desde un archivo XML.

6. Entro en un bucle infinito donde capturo cada frame del video, lo convierto a escala de grises y detecto rostros en él.

7. Para cada rostro detectado, extraigo la región de interés, la redimensiono a un tamaño estándar de 100x100 píxeles y la paso al reconocedor de caras para obtener una predicción.

8. La predicción y la confianza se dibujan en el frame original. Si la confianza es menor que 70, considero que el rostro es reconocido y dibujo un rectángulo verde alrededor del rostro. Si no, lo considero desconocido y dibujo un rectángulo rojo.

9. Muestro el frame con las anotaciones en una ventana.

10. Si se presiona la tecla `ESC` (27 en código ASCII), se rompe el bucle.

11. Al final, libero el objeto de captura de video y cierro todas las ventanas de OpenCV.
