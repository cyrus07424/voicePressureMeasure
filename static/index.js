// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

// クロスブラウザ対応
var AudioContext = window.AudioContext || window.webkitAudioContext;

// 定数
var bufferSize = 1024;
var recordingMillis = 10000;
var countDownInterval = 100;

// 変数
var localMediaStream = null;
var localScriptProcessor = null;
var audioContext = new AudioContext();
var recordingFlg = false;
var remainingMillis = 0;

// タイマー
var timer = null;

// 完了回数
var completeCount = 0;

// 音量の最大値
var maxInput = 0;
var maxSpectrums = Number.NEGATIVE_INFINITY;

// キャンバス
var canvas = document.getElementById("canvas");
var canvasContext = canvas.getContext("2d");

// 音声測定
var audioAnalyser = null;

// マイクのストリームを取得
navigator.mediaDevices.getUserMedia({audio: true})
.then(function(stream) {
    console.log("navigator.getUserMedia");

    // 録音関連
    localMediaStream = stream;
    var scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
    localScriptProcessor = scriptProcessor;
    var mediastreamsource = audioContext.createMediaStreamSource(stream);
    mediastreamsource.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    scriptProcessor.connect(audioContext.destination);

    // 音声測定関連
    audioAnalyser = audioContext.createAnalyser();
    audioAnalyser.fftSize = 2048;
    frequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);
    timeDomainData = new Uint8Array(audioAnalyser.frequencyBinCount);
    mediastreamsource.connect(audioAnalyser);

    // 初期化完了処理
    setStartButtonDisabled(false);
    refreshStatus("初期化完了");
})
.catch(function(error) {
    console.log(error);
    refreshStatus("初期化失敗");
});

// 測定開始
var startRecording = function() {
    console.log("startRecording");
    recordingFlg = true;
    maxInput = 0;
    maxSpectrums = Number.NEGATIVE_INFINITY;
    refreshVolume();
    refreshStatus("測定中...");
    setStartButtonDisabled(true);
    setStopButtonDisabled(false);

    // カウントダウン開始
    remainingMillis = recordingMillis;

    // 100ミリ秒ごとにカウントダウン処理を実行
    timer = setInterval(countDown, countDownInterval);
};

// 測定完了処理
var completeRecording = function() {
    console.log("completeRecording");

    // 完了ログを追加
    completeCount++;
    addCompleteLog();

    // 終了
    endRecording();
};

// 測定終了
var endRecording = function() {
    console.log("endRecording");
    recordingFlg = false;
    if (timer != null) {
        clearTimeout(timer);
    }
    refreshStatus("停止中");
    setStartButtonDisabled(false);
    setStopButtonDisabled(true);

    // プログレスバーを再描画
    refreshProgressbar(0);
};

// カウントダウン処理
var countDown = function() {
    // 残り時間を減少
    remainingMillis -= countDownInterval;

    // プログレスバーを再描画
    refreshProgressbar((remainingMillis * 100) / recordingMillis);

    // カウントダウン終了時
    if(remainingMillis <= 0){
        // 測定完了処理
        completeRecording();
    }
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
            refreshVolume();
        }
    }

    // 波形を測定
    analyseVoice();
};

// 測定用処理
var analyseVoice = function() {
    var fsDivN = audioContext.sampleRate / audioAnalyser.fftSize;
    var spectrums = new Uint8Array(audioAnalyser.frequencyBinCount);
    var floatSpectrums = new Float32Array(audioAnalyser.frequencyBinCount);
    audioAnalyser.getByteFrequencyData(spectrums);
    audioAnalyser.getFloatFrequencyData(floatSpectrums);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    canvasContext.beginPath();

    for (var i = 0, len = spectrums.length; i < len; i++) {
        // canvasにおさまるように線を描画
        var x = (i / len) * canvas.width;
        var y = (1 - (spectrums[i] / 255)) * canvas.height;
        if (i === 0) {
            canvasContext.moveTo(x, y);
        } else {
            canvasContext.lineTo(x, y);
        }
        // 添字から周波数に変換
        var f = Math.floor(i * fsDivN);

        // 1000 Hz単位にy軸の線とラベル出力
        if ((f % 1000) === 0) {
            var text = (f < 1000) ? (f + " Hz") : ((f / 1000) + " kHz");
            // Draw grid (X)
            canvasContext.fillRect(x, 0, 1, canvas.height);
            // Draw text (X)
            canvasContext.fillText(text, x, canvas.height);
        }

        // 周波数が250Hz～2000Hzの間の場合
        if (250 <= f && f <= 2000) {
            // 最大値を更新
            if (maxSpectrums < floatSpectrums[i]) {
                maxSpectrums = floatSpectrums[i];
                refreshVolume();
            }
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
};

// ステータスを再描画
var refreshStatus = function(status) {
    $("#status").html(status);
};

// プログレスバーを再描画
// value = 0~100
var refreshProgressbar = function(value) {
    // 残り秒数を計算
    var remainingSeconds = Math.ceil((recordingMillis / 1000) * (value / 100));

    var progressBar = $("#progressBar");
    progressBar.css("width", value + "%");
    if (0 < remainingSeconds) {
        progressBar.html(remainingSeconds + "秒");
    }　else {
        progressBar.html("");
    }
};

// 音量を再描画
var refreshVolume = function() {
    console.log({
        maxInput: maxInput,
        maxSpectrums: maxSpectrums
    });

    // デシベル値を計算
    $("#maxInput span").html(calcDb(maxInput));
    $("#maxSpectrums span").html(calcSpectrumsDb(maxSpectrums));
};

// 完了ログを追加
var addCompleteLog = function() {
    var index = completeCount + "回目 : ";
    var completeInputLog = calcDb(maxInput) + " [db]";
    var completeSpectrumsLog = calcSpectrumsDb(maxSpectrums) + " [db]";
    $("#completeLog").prepend(
        $("<div>").append(
            index,
            completeInputLog,
            ", ",
            completeSpectrumsLog
        )
    );
};

// デシベル値を計算(振幅)
var calcSpectrumsDb = function(input) {
    // 小数点以下第3位で四捨五入
    return Math.round(input * 100) / 100;
};

// デシベル値を計算(成分)
var calcDb = function(input) {
    if (input <= 0) {
        // 結果がInfinityにならないようにする
        return 0;
    } else {
        // デシベル値を計算
        var db = 20 * Math.log(input * 1000000) / Math.log(10);

        // 小数点以下第3位で四捨五入
        return Math.round(db * 100) / 100;
    }
};

// 測定開始ボタンの活性状態を設定
var setStartButtonDisabled = function(disabled) {
    var button = $("#srartButton");
    if (disabled) {
        button.prop("disabled", true).addClass("disabled");
    } else {
        button.prop("disabled", false).removeClass("disabled");
    }
};

// 測定終了ボタンの活性状態を設定
var setStopButtonDisabled = function(disabled) {
    var button = $("#stopButton");
    if (disabled) {
        button.prop("disabled", true).addClass("disabled");
    } else {
        button.prop("disabled", false).removeClass("disabled");
    }
};