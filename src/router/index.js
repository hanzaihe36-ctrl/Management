import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import UserManage from "../views/UserManage.vue";

const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/user-manage", name: "UserManage", component: UserManage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
