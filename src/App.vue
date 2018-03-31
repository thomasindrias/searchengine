<template>
  <div id="app">
    <v-app id="bg" class="animated fadeIn" light>
      <v-layout
        column
        align-center
        class="white--text mt-4 animated fadeInLeft"
      >
        <h1 class="white--text mb-2 display-4 text-xs-center">Search Engine</h1>
        <div class="subheading mb-3 text-xs-center">Powered by VueJs 2 and Firebase</div>
      </v-layout>
      <SearchEngine/>
    </v-app>
  </div>
</template>

<script>
import SearchEngine from './components/SearchEngine'

export default {
  name: 'App',
  components: {
    SearchEngine
  }
}
</script>

<style>
body,head {
  height: 100%;
  width: 100%;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #000000;
}

#bg {
  background-image: url(https://images.unsplash.com/photo-1493662404096-9ecc84ebba6b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cacb23f3922deb63d0cafb8e857649fc&auto=format&fit=crop&w=1950&q=80);
}
</style>
