
export interface Task {
    activityId: number;
    createdOn: number;
    status: TaskStatus;
    creator: string;
    taker: string;
}

export enum Type {
    None,
    CoreTeamTask,
    DiscordPoll,
    CommunityCall
}

export enum TaskStatus {
    Created,
    Taken,
    Finished
}