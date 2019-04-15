var NodeWebcam = require( "node-webcam" );

var opts = {
  width: 1280,
  height: 720,
  quality: 100,
  brightness: 20,
  delay: 0,
  saveShots: true,
  output: 'jpeg',
  device: false,
  callbackReturn: 'location',
  verbose: false }
  
var Webcam = NodeWebcam.create(opts);

async function capture() {
	await Webcam.capture( "../../img/capture.jpg", function( err, data ) {} );
	console.log('take');
}

setInterval(capture, 2000);
