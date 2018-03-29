<template>
  <div id="app" class="container">
    <SearchEngine/>
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
