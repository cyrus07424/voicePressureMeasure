<template>
  <div>
    <header>
      <!-- Fixed navbar -->
      <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <a class="navbar-brand" href="#">音量測定ツール</a>
      </nav>
    </header>
    <main role="main" class="flex-shrink-0">
      <nuxt />
    </main>
  </div>
</template>

<style>
main > .container {
  padding: 60px 15px 0;
}

.footer {
  background-color: #f5f5f5;
}

.footer > .container {
  padding-right: 15px;
  padding-left: 15px;
}

code {
  font-size: 80%;
}
</style>
