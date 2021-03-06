import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/user/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/user/Register.vue")
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/user/Profile.vue")
  },
  {
    path: "/admin/establishments",
    name: "admin_establishment_list",
    component: () => import("@/views/admin/EstablishmentList.vue")
  },
  {
    path: "/admin/establishment/:id",
    name: "admin_establishment_detail",
    component: () => import("@/views/admin/EstablishmentDetail.vue")
  },
  {
    path: "/admin/employees",
    name: "admin_employee_list",
    component: () => import("@/views/admin/EmployeeList.vue")
  },
  {
    path: "/manager/establishment",
    name: "manager_establishment_detail",
    component: () => import("@/views/manager/EstablishmentDetail.vue")
  },
  {
    path: "/manager/menu",
    name: "manager_menu_detail",
    component: () => import("@/views/manager/MenuDetail.vue")
  },
  {
    path: "/manager/menu/dishes",
    name: "manager_dish_detail",
    component: () => import("@/views/manager/DishDetail.vue")
  },
  {
    path: "/manager/tables",
    name: "manager_tables",
    component: () => import("@/views/manager/MesaGestor.vue")
  },
  {
    path: "/order_handler/menu",
    name: "order_handler_menu_detail",
    component: () => import("@/views/order_handler/MenuDetail.vue")
  },
  {
    path: "/order_handler/orders",
    name: "order_handler_order_list",
    component: () => import("@/views/order_handler/OrderList.vue")
  },
  {
    path: "/receptionist/reservations",
    name: "receptionist_reservation_list",
    component: () => import("@/views/receptionist/ReservationList.vue")
  },
  {
    path: "/receptionist/orders",
    name: "receptionist_order_list",
    component: () => import("@/views/receptionist/OrderList.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

import { Dictionary } from "vuex";

//route
export function route(): string {
  return router.currentRoute.name ? router.currentRoute.name : "";
}

//safePush: pushes a route the browser is not currently into.
export function safePush(
  route_name: string,
  params?: Dictionary<string>
): void {
  if (route() != route_name) {
    if (!params) router.push({ name: route_name });
    else router.push({ name: route_name, params });
  }
}
