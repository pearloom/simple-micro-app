import Vue from 'vue'
import App from './App.vue'

import SimpleMicroApp from 'simple-micro-app'


window.globalStr = 'parent'

SimpleMicroApp.start()

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
}).$mount('#app')
