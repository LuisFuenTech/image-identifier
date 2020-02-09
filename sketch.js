var video;
let writingField;
let userText;
let userPicture;

function setup() {
  //Create canvas
  canvas = createCanvas(400, 600);
  background(51);

  //Use phone's back camera
  //Question:
  //Why doesn't this actually work on a phone???
  //Save the result of createCapture using phone's back camera
  video = createCapture({
    audio: false,
    video: {
      facingMode: {
        exact: 'environment'
      }
    }
  });
  //But hide the live video to the user
  video.hide();
  //Set the size of the video (and image)
  video.size(320, 240);

  //Create takePhotoButton
  takePhotoButton = createButton('Take Photo');
  //When pressed, call takeImage function
  takePhotoButton.mousePressed(takeImage);
  //Place the button
  takePhotoButton.position(160, 245);
  //Add instructions to user

  //Create text input field
  writingField = createInput();
  writingField.position(50, 400);
  writingField.size(300, 60);

  //Create submitPicture button
  submitTextButton = createButton('Submit Text');
  submitTextButton.position(160, 480);
  //When clicked, call submitPictureFunction
  submitTextButton.mousePressed(displayTogether);
}

function draw() {
  //Grab the value of the user's text
  //This is in draw() to be able to grab it at any time
  userText = writingField.value();
}

function takeImage() {
  //Display to the canvas one image
  //of the video feed when the user presses the button
  userPicture = image(video, 40, 0);
}

function displayTogether() {
  //This function creates a "fresh copy" of the image and text

  //Why doesn't drawing the userPicture one more time work?
  //image(userPicture, 320, 240);
  textSize(60);
  textFont('Helvetica');
  text(userText, 50, 100);

  //When submit is pressed, send canvas to blob
}
