export interface SkillWallet {
    tokenId: string;
    nickname: string;
    imageUrl: string;
    diToCredits: number;
    repScore: number;
    currentCommunities: CommunityList[];
    pastCommunities: CommunityList[];
    skills: Skill[];
}

 interface CommunityList {
    name: string;
    address: string;
    members?: number;
    description?: string;
    scarcityScore?: number;
    comScore?: number;
    repCredits?: number; 
}

 interface Skill {
    name: string;
    value: number;
}
