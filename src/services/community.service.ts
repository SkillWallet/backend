
import {
    SkillWalletList,
} from '../models';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { CommunityContracts } from '../contracts/community.contracts';
import { getJSONFromURI } from '../utils/helpers';

export const getSkillWalletsPerCommunity = async (communityAddress: string, role: string): Promise<SkillWalletList[]> => {
    const skillWallets: SkillWalletList[] = [];
    const memberIds = await CommunityContracts.getMembers(communityAddress) as string[];

    for (let i = 0; i < memberIds.length; i++) {
        let tokenId = memberIds[i];
        const isActive = await SkillWalletContracts.isActive(tokenId);
        if (isActive) {
            const jsonUri = await SkillWalletContracts.getTokenURI(tokenId);
            let jsonMetadata = await getJSONFromURI(jsonUri)
            const skills = jsonMetadata.properties.skills as any[];
            if (skills.find(x => x.name === role)) {
                skillWallets.push({
                    tokenId: tokenId.toString(),
                    imageUrl: jsonMetadata.image,
                    nickname: jsonMetadata.properties.username
                })
            } else {
                console.log(tokenId.toString());
            }
        }
    }
    return skillWallets;
}

