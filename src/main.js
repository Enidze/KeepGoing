import Vue from "vue"
import App from "./App.vue"
import ElementUI from 'element-ui'
import $ from 'jquery'
import store from "./js/store"
import { Button, Upload, Input } from 'element-ui'
// import videoPlayer from "vue-video-player"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'element-ui/lib/theme-chalk/index.css'

require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');

Vue.use(ElementUI);


Vue.component(Button.name, Button);
Vue.component(Upload.name, Upload);
Vue.component(Input.name, Input);


$(function () {
    $('[data-toggle = "popover"]').popover()
});

new Vue({
    render: (createElement) => createElement(App),
    store
}).$mount('#app');
