
import {
    SkillWalletList,
} from '../models';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { CommunityContracts } from '../contracts/community.contracts';
import { getJSONFromURI, ipfsCIDToHttpUrl } from '../utils/helpers';

export const getSkillWalletsPerCommunity = async (communityAddress: string, coreTeamMembers: boolean): Promise<any> => {
    let skillWalletsResponse: { [role: string]: SkillWalletList[] } = {};
    const metadataCID = await CommunityContracts.getMetadataUri(communityAddress);
    const communityUri = ipfsCIDToHttpUrl(metadataCID, true);
    const communityMetadata = await getJSONFromURI(communityUri);
    const filteredRoles = communityMetadata.skills.roles
        .filter(r => r.isCoreTeamMember == coreTeamMembers)
        .map(r => r.roleName) as string[]

    for (let i = 0; i < filteredRoles.length; i++) {
        skillWalletsResponse[filteredRoles[i]] = [];
    }
    const memberIds = await CommunityContracts.getMembers(communityAddress) as string[];

    for (let i = 0; i < memberIds.length; i++) {
        let tokenId = memberIds[i];
        const isActive = await SkillWalletContracts.isActive(tokenId);
        console.log('tokenID', tokenId.toString());
        if (isActive) {
            const metadataCID = await SkillWalletContracts.getTokenURI(tokenId);
            const jsonUri = ipfsCIDToHttpUrl(metadataCID, true);
            let jsonMetadata = await getJSONFromURI(jsonUri)
            const skills = jsonMetadata.properties.roles as any[];
            console.log(skills);
            if (skills && filteredRoles.findIndex(c => c == skills[0].name) > -1) {
                skillWalletsResponse[skills[0].name].push({
                    tokenId: tokenId.toString(),
                    imageUrl: ipfsCIDToHttpUrl(jsonMetadata.properties.avatar, false),
                    nickname: jsonMetadata.properties.username
                })
            }
        }
    }
    return skillWalletsResponse;
}

