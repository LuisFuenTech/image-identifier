# Aplicación

La aplicación en su versión permite acceder a la cámara trasera del teléfono, en su versión web permite acceder a la cámara principal de la computadora, con el objeto de enfocar a un objeto, entrenar a la IA con la imagen del objeto y asignándole un nombre. El nombre se introduce en el texto box y se presiona el botón “Entrenar” n veces (se recomienda que n >= 10) para enseñarle a nuestra IA que dicho objeto tiene el nombre que le hemos asignado. Cuando enfoquemos el objeto aprendido o uno con las características similares, será capaz de reconocerlo y el nombre aparecerá donde antes estaba el texto “Modelo Listo”.

# Librerías

- **P5.js:** Es una biblioteca de JavaScript para la codificación creativa, con un enfoque en hacer que la codificación sea accesible e inclusiva para artistas, diseñadores, educadores, principiantes y cualquier otra persona
- **Ml5.js:** Tiene como objetivo hacer que el aprendizaje automático sea accesible para una amplia audiencia de artistas, programadores creativos y estudiantes. La biblioteca proporciona acceso a algoritmos y modelos de aprendizaje automático en el navegador, basándose en TensorFlow.js sin otras dependencias externas

# Desarrollo

## Cargar librerías

En el archivo principal index.html dentro de las etiquetas `<head>` se coloca todas las librerías que mencionadas anteriormente son esenciales para poder hacer un aprendizaje automático.

```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/p5.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.3/addons/p5.dom.min.js"></script>
<script src="https://unpkg.com/ml5@0.2.1/dist/ml5.min.js"></script>

```

# Cargar archivo contendor

Sketch.js es el corazón de la aplicación. Está el script responsable de la captura de los datos desde la cámara, entrenamiento de la IA y la exportación de la neurona entrenada. Este script se carga en el indx.html contiguo a las librerías anteriores.

```javascript
<script src="sketch.js"></script>
```

# Funciones principales

```javascript
function setup() {}

function draw() {}

function ModeloListo() {}

function clasificar() {}

function EntrenarTexBox() {}
```

- **`function setup()`**: Es ejecutada una vez, cuando el programa empieza. Es usada para definir propiedades iniciales como amaño de la pantalla y color de fondo y para cargar medios como imágenes y tipografías cuando el programa empieza. Solo puede haber una función setup() en cada programa y no debe ser llamada después de su ejecución inicial.
- **`function draw()`**: Es ejecutada después de setup(), y ejecuta contínuamente las líneas de código dentro de su bloque hasta que el programa es detenido.
- **`function ModeloListo()`**: Es ejecutada para notificar a la aplicación que el objeto modelo ha sido cargado y está listo para ser utilizado.
- **`function clasificar()`**: Es ejecutada cada 500ms, tiene la responsabilidad de capturar la imagen de la cámara, aplicarle el algoritmo KNN (k-nearest neighbors) e imprimir el resultado o nombre de la imagen identificada.
- **`function EntrenarTextBox()`**: Es ejecutada cuando se desea entrenar a la neurona con la imagen y el nombre ingresado en el textbox.

## `funtion setup()`

Dentro de la función setup() se crea el canvas (donde se proyectará el video tomado de la cámara). La función createCanvas recibe como parámetros el alto y el ancho del canva en pixeles; las funciones encadenada class y style se usan para agregarle estilos y clase tipo html.

```javascript
createCanvas(320, 240)
  .class('container text-center')
  .style('padding', '0')
  .style('margin', 'auto')
  .style('display', 'block');
```

La función `createCapture()` se usa para crear la instancia de la cámara, recibe como parámetro la variable por default VIDEO o un objeto con la configuración customizada.

```javascript
Camara = createCapture(VIDEO);
Camara.size(320, 240);
Camara.hide();
```

El modelo de la neurona se obtiene del método que provee el objeto global de `ml5`, `featureExtractor()`, recibe el nombre del modelo que usuará embebido, MobileNet (una serie de modelos basados en TensorFlow, pero diseñados para que puedan ser usados en dispositivos de baja potencia), y la función callback `ModeloListo()` para notificar cuando esté listo el objeto.
El objeto con el algoritmo KNN se optiene a través de la función `KNNClassifier()` que provee `ml5`.

```javascript
modelo = ml5.featureExtractor('MobileNet', ModeloListo);
knn = ml5.KNNClassifier();
```

Las funciones `createInput()` y `createButton()` con propias de `P5JS` y se usan para crear el textbox y los botones que se usa en el ejemplo. La función `mousePressed()` ejecuta un evento tipo click por cada botón.
`

```javascript
InputTexbox = createInput('nombre');
InputTexbox.class('form-control col-6');
InputTexbox.style('margin', '5px');
InputTexbox.style('padding', '6px');
InputTexbox.style('');

BotonTexBox = createButton('Entrenar');
BotonTexBox.class('btn btn-success');
BotonTexBox.style('margin', '5px');
BotonTexBox.style('padding', '6px');
BotonTexBox.mousePressed(EntrenarTextBox);
```

## `function draw()`

Dentro de la función `draw()` se posiciona el canvas de la cámara, se crea el botón _Entrenar_. Luego se valida si hay objetos aprendidos, a travé de la función `getNumLabels()` (propia del objeto `knn`) para establecer que la función clasificadora sea ejecutada cada 500ms.

```javascript
function draw() {
  image(Camara, 0, 0, 320, 240);
  BotonTexBox.html('Entrenar');
  if (knn.getNumLabels() > 0 && !Clasificando) {
    setInterval(clasificar, 500);
    Clasificando = true;
  }
}
```

## `function clasificar()`

Dentro de la función `clasificar()` se extrae la imagen de la cámara con el método `infer()` de ml5 y recibe como parámetro la instancia de la cámara previamente configurada.
La imagen captura es pasada como argumento la función `classify()` del objeto knn. Además recibe como parámetro una función que recibe los errores y resultados al haber aplicado la función `classify()`. Si existe algún error, el navegador en capaz de imprirlo. Si hubo éxito, se renderiza una etiqueta de texto “Es un …” con el nombre del objeto o imagen reconocido.

## `function EntrenarTextBox()`

Esta función se ejecuta cuando se presiona el botón “Entrenar” y captura la image, y la guarda en la neurona asociándola con el valor que esté en el textBox. De esa forma le enseñamos nueva información a la neurona.

```javascript
function EntrenarTextBox() {
  const Imagen = modelo.infer(Camara);
  knn.addExample(Imagen, InputTexbox.value());
}
```

# Resumen

1. Abrir la apliación web
2. Enfocar un objeto
3. Escribir en el textBox el nombre del objeto
4. Presionar el menos 10 veces el botón “entrenar”
5. Repetir los pasos 2 al 4, con más de 2 objetos.
6. Después de entrenar a la neurona, enfocar la cámara en los objetos para visualizar el resultado en la etiqueta de texto “Es un…”

# Demostración

## Entrenamiento

Se entrena con una modena de $1000 y $500, con un reloj y con un arduino.
