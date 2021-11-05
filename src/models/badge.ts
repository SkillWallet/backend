
export interface Badge {
	image: string;
	title: string;
	description: string;
}


export interface CommunityBadges {
	communityName: string,
	badges: Badge[]
}
