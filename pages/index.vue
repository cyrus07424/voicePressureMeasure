<template>
  <div class="container text-center">
    <logo />
    <h1>音量測定ツール</h1>
    <h3 id="status"></h3>
    <h3 id="maxInput"><span class="volume">0</span>db</h3>
    <b-button id="srartButton" variant="primary" onclick="startRecording()" disabled>解析開始</b-button>
    <b-button id="stopButton" variant="danger" onclick="endRecording()" disabled>解析停止</b-button>
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
