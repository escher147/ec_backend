import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'


// 全局样式
import 'assets/css/global.css'
// 字体图标
import 'assets/fonts/iconfont.css'

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')