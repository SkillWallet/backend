export interface SkillWallet {
    tokenId: string;
    nickname: string;
    imageUrl: string;
    diToCredits: number;
    currentCommunity: CommunityList;
    pastCommunities: CommunityList[];
    skills: Skill[];
}

 interface CommunityList {
    name: string;
    address: string;
    members?: number;
    description?: string;
    scarcityScore?: number;
}

 interface Skill {
    name: string;
    value: number;
}
