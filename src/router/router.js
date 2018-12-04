import Vue from 'vue'
import Router from 'vue-router'
import Chart from '@/pages/charts/chart'
import Table from '@/pages/charts/table'
import ChartART from '@/pages/charts/chart_ART'
import Test from '@/pages/charts/test'
import Embedding from '@/pages/charts/embedding'
import Login from '@/pages/login/login'
import Error from '@/pages/Error/404'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "error",
            component: Error,
        }, {
            path: "/login",
            name: "login",
            component: Login,
        },
        {
            path: "/chart",
            name: 'chart',
            component: Chart,
        },
        {
            path: "/table01",
            name: "table",
            component: Chart,
        },
        {
            path: "/table",
            name: "tables",
            component: Table,
        },
        {
            path: "/ChartART",
            name: "chart_ART",
            component: ChartART,
        },
        {
            path: "/test",
            name: "test",
            component: Test,
        },
        {
            path: "/embedding",
            name: "embedding",
            component: Embedding,
        },
        {
            path: "*",
            redirect: "/"
        }
    ],

})
