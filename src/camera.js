'use strict';

var _mobilenet = require('@tensorflow-models/mobilenet');

var mobilenet = _interopRequireWildcard(_mobilenet);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _rollupConfig = require('./../node_modules/tensorflow-models/coco-ssd/rollup.config.js');

var _rollupConfig2 = _interopRequireDefault(_rollupConfig);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var cocoSsd = {};
cocoSsd['RollupConfig'] = _rollupConfig2.default;

console.log(1);
var tf = require('@tensorflow/tfjs');
console.log(2);

//var mobilenet = require('./../node_modules/tensorflow-models/mobilenet');
require('@tensorflow/tfjs-node');

var fs = require('fs');
var jpeg = require('jpeg-js');

var NUMBER_OF_CHANNELS = 3;

var readImage = function readImage(path) {
    var buf = fs.readFileSync(path);
    var pixels = jpeg.decode(buf, true);
    return pixels;
};

var imageByteArray = function imageByteArray(image, numChannels) {
    var pixels = image.data;
    var numPixels = image.width * image.height;
    var values = new Int32Array(numPixels * numChannels);

    for (var i = 0; i < numPixels; i++) {
        for (var channel = 0; channel < numChannels; ++channel) {
            values[i * numChannels + channel] = pixels[i * 4 + channel];
        }
    }

    return values;
};

var imageToInput = function imageToInput(image, numChannels) {
    var values = imageByteArray(image, numChannels);
    var outShape = [image.height, image.width, numChannels];
    var input = tf.tensor3d(values, outShape, 'int32');

    return input;
};

var loadModel = async function loadModel(path) {
    console.log(mobilenet);
    console.log(33333333);
    console.log(mobilenet.MobileNet);
    var mn = new mobilenet.MobileNet('1.00', '1.00');
    mn.path = 'file://' + path;
    console.log('mn');
    console.log(mn);
    console.log('mn.path');
    console.log(mn.path);
    console.log('mn.load');
    console.log(mn.load);
    await mn.load().catch((err) => console.log(err));
    return mn;
};

var classify = async function classify(model, path) {
    var image = readImage(path);
    var input = imageToInput(image, NUMBER_OF_CHANNELS);

    var mn_model = await loadModel(model);
    var predictions = await mn_model.classify(input);

    console.log('classification results:', predictions);
};

if (process.argv.length !== 4) throw new Error('incorrect arguments: node script.js <MODEL> <IMAGE_FILE>');

classify(process.argv[2], process.argv[3]);
