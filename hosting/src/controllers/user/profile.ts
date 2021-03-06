//Plugin Imports
import Store from "@/plugins/vuex";

//Schema Imports
import { CountryDocument } from "@/models/country/schema";
import { UserDocument } from "@/models/user/schema";

//Data Imports
import { UserData } from "@/models/user/data";
import { CountryData } from "@/models/country/data";

//User Profile Data
export type UserProfile = null | {
  first_name: string;
  last_name: string;
  email: string;
  phone: number;
  country: {
    code: number;
    iso: string;
    name: string;
    flag_url?: string;
  };
};

//getData: Outputs the profile data for the currently logged-in user.
export async function getData(user_id: string): Promise<UserProfile> {
  if (user_id == "") return null;
  const userData: UserData = await new UserDocument(user_id).read();
  const countryData: CountryData = await new CountryDocument(
    userData.country_id
  ).read();
  delete userData.country_id;
  return { ...userData, country: countryData };
}
