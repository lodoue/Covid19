import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      meta: { layout: 'default', requiresAuth: false  },
      component: () => import(/* webpackChunkName: "home" */ "./components/Home.vue")
    }
  ]
});