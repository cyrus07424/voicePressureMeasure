<template>
  <div class="container">
    <logo />
    <h1>音量測定ツール</h1>
    <h3 id="status"></h3>
    <h3 id="maxInput">0</h3>
    <b-button variant="primary" onclick="startRecording()">解析開始</b-button>
    <b-button variant="danger" onclick="endRecording()">解析停止</b-button>
    <hr />
    <div class="row">
      <div class="col-sm-6">
        <canvas id="canvas" width="500" height="500"></canvas>
      </div>
    </div>
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

<style></style>
