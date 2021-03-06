// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'vuetify/dist/vuetify.min.css'
import 'animate.css/animate.min.css'
import Vue from 'vue'
import App from './App'
import VueFire from 'vuefire'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
Vue.use(VueFire)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
