//FS Imports
import {
  db,
  FS_Collection,
  FS_Document,
  FS_DocumentData
} from "@/plugins/firebase";

//Schema Imports
import { EstablishmentDocument } from "../establishment/schema";

//Data Imports
import { EmployeeData, EmployeeRoles, EmployeeDataFS_Data } from "./data";
import { EstablishmentData } from "../establishment/data";

//Document Class
export class EmployeeDocument {
  //Properties
  public readonly ref: FS_Document;
  public readonly id: string;
  //Constructor
  public constructor(id: string) {
    this.id = id;
    this.ref = EmployeeCollection.ref.doc(id);
  }
  //Read methods
  public read = (): Promise<EmployeeData> =>
    this.ref.get().then(async (res: FS_DocumentData) => {
      const temp: EmployeeDataFS_Data = <EmployeeDataFS_Data>res.data();
      const employeeData: EmployeeData = {
        establishment_id: temp.establishment ? temp.establishment.id : undefined
      };
      return employeeData;
    });
  public getRoles = (): Promise<EmployeeRoles> =>
    this.ref.get().then(async (res: FS_DocumentData) => {
      let roles: EmployeeRoles = {
        isManager: false,
        isOrderHandler: false,
        isReceptionist: false
      };
      const temp: EmployeeDataFS_Data = <EmployeeDataFS_Data>res.data();
      if (!temp.establishment) return roles;
      const establishmentData: EstablishmentData = await new EstablishmentDocument(
        temp.establishment.id
      ).read();
      roles.isManager = establishmentData.employees.manager_ids.includes(
        this.id
      );
      roles.isOrderHandler = establishmentData.employees.order_handler_ids.includes(
        this.id
      );
      roles.isReceptionist = establishmentData.employees.receptionist_ids.includes(
        this.id
      );
      return roles;
    });
  //Update methods
  public setEstablishment = async (
    establishment: EstablishmentDocument
  ): Promise<void> => this.ref.update({ establishment: establishment.ref });
  public unsetEstablishment = async (): Promise<void> =>
    this.ref.update({ establishment: null });
  //Delete method
  public delete = async (): Promise<void> => this.ref.delete();
}

//Collection Class
export abstract class EmployeeCollection {
  //Properties
  public static readonly ref: FS_Collection = db.collection("employees");
  public static readonly id: string = EmployeeCollection.ref.id;
  //Create method
  public static create = async (id: string): Promise<EmployeeDocument> => {
    const employee: EmployeeDocument = new EmployeeDocument(id);
    const employeeData: EmployeeDataFS_Data = {
      establishment: undefined
    };
    return employee.ref.set(employeeData).then(() => employee);
  };
}