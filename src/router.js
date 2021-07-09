import Vue from "vue";
import VueRouter from "vue-router";
import Resource from "./views/Resource";
// import Home from "./views/Home";
import SchedulePaging from "./views/SchedulePaging";
import ResourceHistory from "./views/ResourceHistory";
import BotRegist from "./views/BotRegist";
import VueConfirmDialog from 'vue-confirm-dialog'
 
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
    {
        path:"/",
        component: Resource
    },
    {
        path:"/resc",
        component: Resource
    },
    {
        path:"/schedule-paging",
        component:SchedulePaging
    },
    {
        path:"/resource-history",
        component:ResourceHistory
    },
    {
        path:"/bot-regist",
        component:BotRegist
    },
    ]
});
export default router;