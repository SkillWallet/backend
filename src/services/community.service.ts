
import {
    SkillWalletList,
} from '../models';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { CommunityContracts } from '../contracts/community.contracts';
import { getJSONFromURI } from '../utils/helpers';

export const getSkillWalletsPerCommunity = async (communityAddress: string): Promise<any> => {
    let skillWalletsResponse: { [role: string]: SkillWalletList[] } = {};

    const communityUri = await CommunityContracts.getMetadataUri(communityAddress);
    const communityMetadata = await getJSONFromURI(communityUri);
    console.log(communityMetadata.properties.roles);

    for (let i = 0; i < communityMetadata.properties.roles.length; i++) {
        skillWalletsResponse[communityMetadata.properties.roles[i]] = [];
    }

    const memberIds = await CommunityContracts.getMembers(communityAddress) as string[];

    for (let i = 0; i < memberIds.length; i++) {
        let tokenId = memberIds[i];
        const isActive = await SkillWalletContracts.isActive(tokenId);
        if (isActive) {
            const jsonUri = await SkillWalletContracts.getTokenURI(tokenId);
            let jsonMetadata = await getJSONFromURI(jsonUri)
            const skills = jsonMetadata.properties.skills as any[];
            skillWalletsResponse[skills[0].name].push({
                tokenId: tokenId.toString(),
                imageUrl: jsonMetadata.image,
                nickname: jsonMetadata.properties.username
            })
        }
    }
    return skillWalletsResponse;
}

