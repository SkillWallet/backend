import { activitiesContract } from "./index";

export class ActivityContracts {


  public static async getActivities(
    activityAddress: string,
    type: number
  ) {
    try {
      const contract = activitiesContract(activityAddress);
      const activities = await contract.getActivitiesByType(type);
      return activities;
    } catch (err) {
      console.log(err);
    }
  }

  public static async getTaskById(
    activityAddress: string,
    activityId: string,
  ) {
    try {
      const contract = activitiesContract(activityAddress);
      const activity = await contract.getTaskByActivityId(activityId);
      return activity;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  public static async getTokenURI(activityAddress: string, tokenId: string): Promise<string> {
    try {
      const contract = activitiesContract(activityAddress);
      const uri = await contract.tokenURI(tokenId);
      return uri as string;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
}