<template>
  <div class="container text-center">
    <logo />
    <h1>音量測定ツール</h1>
    <h3 id="status">初期化されていません</h3>
    <div class="progress">
      <div
        id="progressBar"
        class="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        style="width:0%;"
        aria-valuenow="0"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
    <h3 id="maxInput">input:<span class="volume">0</span>dB</h3>
    <h3 id="maxSpectrums">spectrums:<span class="volume">0</span>dBFS/Hz</h3>
    <b-button
      id="startButton"
      variant="primary"
      onclick="startRecording()"
      disabled
    >
      測定開始
    </b-button>
    <b-button
      id="stopButton"
      variant="danger"
      onclick="endRecording()"
      style="display:none;"
      disabled
    >
      測定停止
    </b-button>
    <hr />
    <div id="completeLog"></div>
    <hr />
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  head: {
    script: [{ src: './index.js', type: 'text/javascript', body: true }]
  }
}
</script>

<style>
.volume {
  font-size: 50px;
  font-weight: bold;
  color: #f00;
}
</style>
