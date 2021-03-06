//Plugin Imports
import { auth, FS_User } from "@/plugins/firebase";
import Store from "@/plugins/vuex";
import { safePush } from "@/plugins/router";

//Controller Import
import { adminController } from "../admin";
import { managerController } from "../manager";
import { orderHandlerController } from "../order_handler";
import { receptionistController } from "../receptionist";

//Schema Imports
import { EmployeeDocument } from "@/models/employee/schema";
import { AdminDocument } from "@/models/admin/schema";
import { ClientDocument } from "@/models/client/schema";

//Data Imports
import { EmployeeRoles } from "@/models/employee/data";
import { UserRoles } from "@/models/user/data";

//Auth Status
export enum AuthStatus {
  waiting,
  login_start,
  login_ok,
  login_fail,
  logout_start,
  logout_ok,
  logout_fail
}

//Login function
export function login(email: string, password: string): void {
  Store.commit("userController/setAuthStatus", "login_start");
  auth.signInWithEmailAndPassword(email, password).catch(err => {
    Store.commit("userController/setAuthStatus", "login_fail");
    console.log(err);
  });
}
//Login callback
async function onLogin(user_id: string): Promise<void> {
  Store.commit("userController/setUserCurrent", user_id);

  const isAdmin: boolean = await new AdminDocument(user_id).exists();
  if (isAdmin) Store.registerModule("adminController", adminController);

  const establishmentRoles: {
    id: string;
    roles: EmployeeRoles;
  } = await new EmployeeDocument(user_id).getEstablishmentRoles();
  if (establishmentRoles.roles.isManager)
    Store.registerModule("managerController", managerController);
  if (establishmentRoles.roles.isOrderHandler)
    Store.registerModule("orderHandlerController", orderHandlerController);
  if (establishmentRoles.roles.isReceptionist)
    Store.registerModule("receptionistController", receptionistController);

  const isClient: boolean = await new ClientDocument(user_id).exists();
  const roles: UserRoles = { isAdmin, ...establishmentRoles.roles, isClient };

  if (establishmentRoles.id)
    Store.commit("userController/setUserEstablishment", establishmentRoles.id);
  Store.commit("userController/setUserRoles", roles);
  Store.commit("userController/setAuthStatus", "login_ok");
  safePush("profile");
}

//Logout function
export function logout(): void {
  Store.commit("userController/setAuthStatus", "logout_start");
  auth.signOut().catch(err => {
    Store.commit("userController/setAuthStatus", "logout_fail");
    console.log(err);
  });
}
//Logout callback
async function onLogout(): Promise<void> {
  Store.unregisterModule("adminController");
  Store.unregisterModule("managerController");
  Store.unregisterModule("orderHandlerController");
  Store.unregisterModule("receptionistController");
  Store.commit("userController/setUserRoles");
  Store.commit("userController/setUserCurrent");
  Store.commit("userController/setAuthStatus", "logout_ok");
  safePush("login");
}

//Auth Listener
auth.onAuthStateChanged(
  async (user: FS_User | null): Promise<void> => {
    if (!user) await onLogout();
    else await onLogin(user.uid);
  }
);
