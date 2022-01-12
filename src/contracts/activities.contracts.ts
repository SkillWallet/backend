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
    }
  }

}