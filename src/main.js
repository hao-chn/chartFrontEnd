// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import axios from './axios'
import VueJsonp from 'vue-jsonp'
import vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css'
import BaiduMap from './assets/map'

//echarts主题库
require('echarts/theme/macarons');
require('echarts/theme/infographic');
require('echarts/theme/shine');
require('echarts/map/js/china');
require('echarts/map/js/world');
require('echarts/extension/bmap/bmap');


Vue.use(ElementUI);
Vue.use(VueJsonp);
Vue.prototype.$echarts = echarts;

Vue.use(axios);
Vue.prototype.$BaiduMap = BaiduMap;
Vue.config.productionTip = false;

Vue.directive('focus', {
    bind: function (el, binding, vnode) {
        if (binding.value) {
            el.focus()
        }
    },
    update(el, binding, vnode) {
        if (binding.value) {
            el.focus()
        }
    }
});

Vue.use(vuex);
var store = new vuex.Store({//store对象
    state: {
        subTitle: {},
        tableData: {},
        token: '',
    },
    mutations: {
        set_token(state, token) {
            state.token = token;
            sessionStorage.token = token
        },
        del_token(state) {
            state.token = '';
            sessionStorage.removeItem('token')
        }
    },
    getters: {
        subtitle: state => {
            return state.subTitle;
        },
        tableData: state => {
            return state.tableData;
        }
    }
});
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
});
