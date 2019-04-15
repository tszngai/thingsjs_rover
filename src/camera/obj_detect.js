'use strict';

var _mobilenet = require('@tensorflow-models/mobilenet');

var mobilenet = _interopRequireWildcard(_mobilenet);

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

var _rollupConfig = require('@tensorflow-models/coco-ssd');

var _rollupConfig2 = _interopRequireDefault(_rollupConfig);

global.fetch = require('node-fetch')

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var cocoSsd = {};
cocoSsd['RollupConfig'] = _rollupConfig2.default;

var tf = require('@tensorflow/tfjs');

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
    var mn = new mobilenet.MobileNet('1.00', '1.00');
    mn.path = 'file://' + path;
    await mn.load().catch(function (err) {
        console.log('mn.load error!!!');
        return console.log(err);
    });
    return mn;
};

var classify = async function classify(model, path) {
    var image = readImage(path);
    var input = imageToInput(image, NUMBER_OF_CHANNELS);

    var mn_model = await loadModel(model);
    var predictions = await mn_model.classify(input);

    console.log('classification results:', predictions);
    // console.log(predictions[0]['className']);
    return [predictions[0]['className'], predictions[1]['className'], predictions[2]['className']];
};

if (process.argv.length !== 3) throw new Error('incorrect arguments: node script.js <MODEL> <IMAGE_FILE>');

async function scan(){
    var results = [];
    while (!(results.includes(process.argv[2]))){
        var raw = await classify('model.json', '../../img/capture.jpg').catch(function (err) {
            console.log('classify error!!!');
            console.log(err);
        });
        if (!raw) {results = []; continue;}
        results = [];
        for (var i in raw) {
            var line = raw[i].split(',');
            for (var j in line) {results.push(line[j].trim());}
        }
    }
    console.log('FOUND!!!!!!!!!!!!!!!!!!');
}

console.log('argv[2]');
console.log(process.argv[2]);
scan().catch(function (err) {
	console.log('scan error!!!');
    return console.log(err);
});
