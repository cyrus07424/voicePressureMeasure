// クロスブラウザ定義
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// 変数定義
var localMediaStream = null;
var localScriptProcessor = null;
var audioContext = new AudioContext();
var bufferSize = 1024;
var recordingFlg = false;

// 音量の最大値
var maxInput = 0;

// 画面表示用
var maxInputElement = $("#maxInput");
var statusElement = $("#status");


// キャンバス
var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");

// 音声解析
var audioAnalyser = null;

// マイクのストリームを取得
navigator.getUserMedia({audio: true}, function(stream) {
    console.log("navigator.getUserMedia");

    // 録音関連
    localMediaStream = stream;
    var scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
    localScriptProcessor = scriptProcessor;
    var mediastreamsource = audioContext.createMediaStreamSource(stream);
    mediastreamsource.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    scriptProcessor.connect(audioContext.destination);

    // 音声解析関連
    audioAnalyser = audioContext.createAnalyser();
    audioAnalyser.fftSize = 2048;
    frequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);
    timeDomainData = new Uint8Array(audioAnalyser.frequencyBinCount);
    mediastreamsource.connect(audioAnalyser);
    
    statusElement.html("初期化完了");
},
function(e) {
    console.log(e);
    statusElement.html("初期化失敗");
});

// 解析開始
var startRecording = function() {
    console.log("startRecording");
    recordingFlg = true;
    maxInput = 0;
    maxInputElement.html(maxInput);
    statusElement.html("解析中...");

    // 10秒後に停止
    setTimeout(endRecording, 10000);
};

// 解析終了
var endRecording = function() {
    console.log("endRecording");
    recordingFlg = false;
    statusElement.html("停止中");
};

// 録音バッファ作成（録音中自動で繰り返し呼び出される）
var onAudioProcess = function(e) {
    if (!recordingFlg) {
        return;  
    } 

    // 音声バッファを取得
    var input = e.inputBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
        // 振幅の絶対値を取得して最大値を更新
        var absInput = Math.abs(input[i]);
        if (maxInput < absInput) {
            maxInput = absInput;
            maxInputElement.html(maxInput);
        }
    }

    // 波形を解析
    analyseVoice();
};

// 解析用処理
var analyseVoice = function() {
    var fsDivN = audioContext.sampleRate / audioAnalyser.fftSize;
    var spectrums = new Uint8Array(audioAnalyser.frequencyBinCount);
    audioAnalyser.getByteFrequencyData(spectrums);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    canvasContext.beginPath();

    for (var i = 0, len = spectrums.length; i < len; i++) {
        //canvasにおさまるように線を描画
        var x = (i / len) * canvas.width;
        var y = (1 - (spectrums[i] / 255)) * canvas.height;
        if (i === 0) {
            canvasContext.moveTo(x, y);
        } else {
            canvasContext.lineTo(x, y);
        }
        var f = Math.floor(i * fsDivN);  // index -> frequency;

        // 500 Hz単位にy軸の線とラベル出力
        if ((f % 500) === 0) {
            var text = (f < 1000) ? (f + " Hz") : ((f / 1000) + " kHz");
            // Draw grid (X)
            canvasContext.fillRect(x, 0, 1, canvas.height);
            // Draw text (X)
            canvasContext.fillText(text, x, canvas.height);
        }
    }

    canvasContext.stroke();

    // x軸の線とラベル出力
    var textYs = ["1.00", "0.50", "0.00"];
    for (var i = 0, len = textYs.length; i < len; i++) {
        var text = textYs[i];
        var gy   = (1 - parseFloat(text)) * canvas.height;
        // Draw grid (Y)
        canvasContext.fillRect(0, gy, canvas.width, 1);
        // Draw text (Y)
        canvasContext.fillText(text, 0, gy);
    }
}