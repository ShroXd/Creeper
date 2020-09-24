import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
    redirect: "/host",
    children: [
      {
        path: "/host",
        name: "Host",
        component: () => import("../views/host/Host.vue")
      },
      {
        path: "/core",
        name: "Core",
        component: () => import("../views/core/Core.vue")
      },
      {
        path: "/deploy",
        name: "Deploy",
        component: () => import("../views/deploy/Deploy.vue")
      },
      {
        path: "/mod",
        name: "Mod",
        component: () => import("../views/mod/Mod.vue")
      },
      {
        path: "/script",
        name: "Script",
        component: () => import("../views/script/Script.vue")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
