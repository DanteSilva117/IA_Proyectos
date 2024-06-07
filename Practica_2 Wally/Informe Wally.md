# Reporte practica 2 Wally
[Regreso al indice](/README.md)
## ¿Como se uso el codigo?

Para general el `cascade.xml` se uso la aplicacion de **Cascade-Trainer-GUI** 

![image info]("C:/Users/dante/Downloads/fondo_v3.jpeg")

## ¿Para qué sirve?

El modelo Cascade es útil para detectar objetos en imágenes. En el caso de "¿Dónde está Wally?", se utiliza para localizar al personaje Wally en diversas imágenes complejas y detalladas. Este tipo de modelo es muy eficiente y preciso, lo que lo hace ideal para tareas de detección donde es crucial encontrar pequeños objetos dentro de imágenes grandes y complejas.

## ¿Cómo funciona?

El modelo Cascade funciona en varias etapas, cada una con un clasificador. Estos clasificadores se organizan en forma de cascada, de ahí el nombre "Cascade". Aquí se detalla el funcionamiento general:

1. **Entrenamiento de múltiples clasificadores:** Se entrenan varios clasificadores con datos de entrenamiento. Cada clasificador se especializa en diferentes características y niveles de detalle.
2. **Evaluación en etapas:** Cada etapa de la cascada tiene un clasificador que analiza la imagen. Si una región de la imagen pasa el primer clasificador, se pasa al siguiente clasificador en la cascada.
3. **Eliminación progresiva:** Las regiones que no cumplen con los criterios del clasificador en una etapa se eliminan de consideración. Solo las regiones que pasan todos los clasificadores se consideran como detecciones finales.
4. **Mejora continua:** Los clasificadores se entrenan de manera que cada etapa se vuelva más precisa y específica, reduciendo así los falsos positivos en las etapas iniciales y aumentando la eficiencia.

## ¿Cómo es el entrenamiento?

El entrenamiento del modelo Cascade para detectar a Wally sigue varios pasos clave:

1. **Recolección de datos:** Se recopilan muchas imágenes de Wally en diferentes contextos y con diferentes fondos. Estas imágenes se etiquetan manualmente para indicar la ubicación exacta de Wally.
2. **Preprocesamiento:** Las imágenes se procesan para normalizar tamaños y características, facilitando el entrenamiento del modelo.
3. **Generación de subimágenes:** Se generan muchas subimágenes a partir de las imágenes originales, algunas con Wally y otras sin él, para balancear el entrenamiento.
4. **Entrenamiento de clasificadores individuales:** Se entrena un clasificador simple para detectar características básicas de Wally. Luego, se entrena un segundo clasificador más complejo, que se encargará de las subimágenes que hayan pasado el primer clasificador. Este proceso se repite varias veces, añadiendo clasificadores cada vez más complejos.
5. **Validación y ajuste:** El modelo se valida con un conjunto separado de imágenes que no se usaron durante el entrenamiento. Se ajustan los parámetros del modelo para mejorar la precisión y reducir errores.

El uso del modelo Cascade en la detección de objetos como Wally se basa en su capacidad para reducir progresivamente la cantidad de regiones de interés en una imagen, evaluándolas de manera eficiente y precisa a través de múltiples etapas. Esta metodología no solo mejora la precisión, sino que también optimiza el rendimiento computacional, haciéndolo ideal para aplicaciones en tiempo real o en grandes conjuntos de datos de imágenes.
