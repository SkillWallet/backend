import { Schema, model } from 'mongoose';

export interface CoreTeamMemberName {
    _id: string;
    communityAddress: string;
    memberAddress: string;
    memberName: string;
}

const CoreTeamMemberNameSchema = new Schema({
	communityAddress: { type: String, default: 0 },
	memberAddress: { type: String },
	memberName: { type: String, default: 0 }
})

export const CoreTeamMemberNameModel = model('CoreTeamMemberNames', CoreTeamMemberNameSchema);
