import { distributedTownContract } from "./index";
export class DistributedTownContracts {

  public static async getCommunities() {
    try {
      const contract = distributedTownContract();
      const addresses = await contract.getCommunities();
      console.log(addresses);
      return addresses;
    } catch (err) {
      console.log(err);
    }
  }

  public static async isDiToNativeCommunity(address: string) {
    try {
      const contract = distributedTownContract();
      const isDiToNative = await contract.isDiToNativeCommunity(address);
      return isDiToNative;
    } catch (err) {
      console.log(err);
    }
  }

}