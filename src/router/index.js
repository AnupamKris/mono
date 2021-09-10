import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Controls from "../views/Controls.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/controls",
    name: "Controls",
    component: Controls,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
