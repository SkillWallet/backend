import { PartnerKey, PartnerKeyModel } from './../models/key';
import { CommunityDetailsView } from './../models/community';
import { DistributedTownContracts } from './../contracts/distributedTown.contracts';

import {
    CoreTeamMemberNameModel,
    SkillWalletList,
} from '../models';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { CommunityContracts } from '../contracts/community.contracts';
import { getJSONFromURI, ipfsCIDToHttpUrl } from '../utils/helpers';
import * as skillsService from "../services/skillWallet.service"

var crypto = require("crypto");

export async function getPAByCommunity(communityAddress: string): Promise<PartnerKey> {
    const partnerKey = await PartnerKeyModel.find({ communityAddress }).exec();

    if (partnerKey && partnerKey.length > 0)
        return partnerKey[0];
    else
        return undefined;
}

export async function createPartnerAgreementKey(partnersAgreementAddress: string, communityAddress: string): Promise<string> {
    const key = new PartnerKeyModel({
        key: crypto.randomBytes(20).toString('hex'),
        partnersAgreementAddress,
        communityAddress
    });

    await key.save();

    return key.key;
}

export async function getCommunity(address: string): Promise<CommunityDetailsView> {
    const metadataUriCID = await CommunityContracts.getMetadataUri(address);
    const metadataUri = ipfsCIDToHttpUrl(metadataUriCID, true);
    const metadata = await getJSONFromURI(metadataUri);
    const isDiToNative = await DistributedTownContracts.isDiToNativeCommunity(address);

    let catName = '';
    switch (metadata.properties.template) {
        case 'Open-Source & DeFi': catName = 'DLT & Blockchain'; break;
        case 'Art & NFTs': catName = 'Art & Lifestyle'; break;
        case 'Local & DAOs': catName = 'Local Community'; break;
    }
    const skills = await skillsService.getByCategory(catName);
    return {
        name: metadata.title,
        address: address,
        description: metadata.description,
        roles: metadata.skills,
        template: metadata.properties.template,
        image: ipfsCIDToHttpUrl(metadata.image, false),
        skills: skills,
        isDiToNativeCommunity: isDiToNative,
        partnersAgreementAddress: undefined
    };
}

export async function addDiscordWebHook(key: string, webhook: string) {
    const partnerKey = await PartnerKeyModel.findOne({ key }).exec();
    if(partnerKey) {
        partnerKey.discordWebhookUrl = webhook;
        partnerKey.save();
    }
}

export async function getKey(key: string): Promise<PartnerKey> {
    const partnerKey = await PartnerKeyModel.find({ key }).exec();
    if (partnerKey && partnerKey.length > 0)
        return partnerKey[0];
    else
        return undefined;
}

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

export const addCoreTeamMemberName = async (communityAddress: string, memberAddress: string, memberName: string) => {
    const coreTeamMemberNames = await CoreTeamMemberNameModel.find({ communityAddress, memberAddress }).exec();

    if (coreTeamMemberNames.length > 0) return;

    const coreTeamMemberNicknameModel = new CoreTeamMemberNameModel({
        communityAddress,
        memberAddress,
        memberName,
    });

    return coreTeamMemberNicknameModel.save();
}

export const getCoreTeamMemberNames = async (communityAddress: string) => {
    return await CoreTeamMemberNameModel.find({ communityAddress }).exec();
}