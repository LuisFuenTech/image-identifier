var Camara;
var knn;
var modelo;
var Texto;
var Clasificando = false;
var InputTexbox;
var BotonTexBox;

function setup() {
  createCanvas(320, 240)
    .class('container text-center')
    .style('padding', '0')
    .style('margin', 'auto')
    .style('display', 'block');
  background(255, 0, 0);

  Camara = createCapture({
    audio: false,
    video: {
      facingMode: {
        exact: 'environment'
      }
    }
  });
  Camara.size(320, 240);
  Camara.hide();

  modelo = ml5.featureExtractor('MobileNet', ModeloListo);
  knn = ml5.KNNClassifier();

  createP('Entrena usando el TextBox').style('margin', '5px');

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

  Texto = createP('Modelo no Listo, esperando');
  Texto.style('margin', '5px');
}

function draw() {
  image(Camara, 0, 0, 320, 240);
  BotonTexBox.html('Entrenar');
  if (knn.getNumLabels() > 0 && !Clasificando) {
    setInterval(clasificar, 500);
    Clasificando = true;
  }
}

function ModeloListo() {
  console.log('Modelo Listo');
  Texto.html('Modelo Listo');
}

function clasificar() {
  const Imagen = modelo.infer(Camara);
  knn.classify(Imagen, function(error, result) {
    if (error) {
      console.error();
    } else {
      Texto.html('Es un ' + result.label);
    }
  });
}

function EntrenarTextBox() {
  const Imagen = modelo.infer(Camara);
  knn.addExample(Imagen, InputTexbox.value());
}
