var Camara;
var BotonesEntrenar;
var knn;
var modelo;
var Texto;
var Clasificando = false;
var InputTexbox;
var BotonTexBox;
//hey
function setup() {
  createCanvas(320, 240)
    .class('container text-center')
    .style('padding', '0')
    .style('margin', 'auto')
    .style('display', 'block');
  background(255, 0, 0);
  Camara = createCapture(VIDEO);
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
  BotonTexBox.mousePressed(EntrenarTexBox);

  var BotonGuardar = createButton('Guardar');
  BotonGuardar.class('btn btn-primary');
  BotonGuardar.style('margin', '5px');
  BotonGuardar.style('padding', '6px');
  BotonGuardar.mousePressed(GuardadNeurona);

  var BotonCargar = createButton('Cargar');
  BotonCargar.class('btn btn-primary');
  BotonCargar.style('margin', '5px');
  BotonCargar.style('padding', '6px');
  BotonCargar.mousePressed(CargarNeurona);

  Texto = createP('Modelo no Listo, esperando');
  Texto.style('margin', '5px');
}

function EntrenarKnn(ObjetoEntrenar) {
  const Imagen = modelo.infer(Camara);
  knn.addExample(Imagen, ObjetoEntrenar);
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
      //clasificar();
    }
  });
}

function EntrenarTexBox() {
  const Imagen = modelo.infer(Camara);
  knn.addExample(Imagen, InputTexbox.value());
}

function GuardadNeurona() {
  if (Clasificando) {
    save(knn, 'modelo.json');
  }
}

function CargarNeurona() {
  console.log('Cargando una Neurona');
  knn.load('./modelo.json', function() {
    console.log('Neurona Cargada knn');
    Texto.html('Neurona cargana de archivo');
  });
}

function draw() {
  image(Camara, 0, 0, 320, 240);
  BotonTexBox.html('Entrenar');
  if (knn.getNumLabels() > 0 && !Clasificando) {
    //clasificar();
    setInterval(clasificar, 500);
    Clasificando = true;
  }
}

// Temporary save code until ml5 version 0.2.2
const save = (knn, name) => {
  const dataset = knn.knnClassifier.getClassifierDataset();
  if (knn.mapStringToIndex.length > 0) {
    Object.keys(dataset).forEach(key => {
      if (knn.mapStringToIndex[key]) {
        dataset[key].label = knn.mapStringToIndex[key];
      }
    });
  }
  const tensors = Object.keys(dataset).map(key => {
    const t = dataset[key];
    if (t) {
      return t.dataSync();
    }
    return null;
  });
  let fileName = 'myKNN.json';
  if (name) {
    fileName = name.endsWith('.json') ? name : `${name}.json`;
  }
  saveFile(
    fileName,
    JSON.stringify({
      dataset,
      tensors
    })
  );
};

const saveFile = (name, data) => {
  const downloadElt = document.createElement('a');
  const blob = new Blob([data], {
    type: 'octet/stream'
  });
  const url = URL.createObjectURL(blob);
  downloadElt.setAttribute('href', url);
  downloadElt.setAttribute('download', name);
  downloadElt.style.display = 'none';
  document.body.appendChild(downloadElt);
  downloadElt.click();
  document.body.removeChild(downloadElt);
  URL.revokeObjectURL(url);
};
