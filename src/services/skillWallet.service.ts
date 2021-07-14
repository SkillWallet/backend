
import {
    Actions,
    QRCodeAuth,
    SkillWallet,
    PendingActivation,
    CommunityListView,
    Chat,
} from '../models';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { CommunityContracts } from '../contracts/community.contracts';
import { Where } from '@textile/hub';
import threadDBClient from '../threaddb.config';
import { ChatCollection, PendingSWActivationCollection, QRCodeAuthCollection } from '../constants/constants';
import { getJSONFromURI, getNonce } from '../utils/helpers';

export const getSkillWallet = async (tokenId: string): Promise<SkillWallet> => {

    const skillWallet: SkillWallet = {
        pastCommunities: [],
        skills: [],
        currentCommunity: {}
    } as SkillWallet;
    const isActive = await SkillWalletContracts.isActive(tokenId);
    if (isActive) {
        const jsonUri = await SkillWalletContracts.getTokenURI(tokenId);
        let jsonMetadata = await getJSONFromURI(jsonUri)
        skillWallet.imageUrl = jsonMetadata.image;
        skillWallet.nickname = jsonMetadata.properties.username;
        skillWallet.skills = jsonMetadata.properties.skills;

        const oldCommunityAddresses: string[] = await SkillWalletContracts.getCommunityHistory(tokenId);
        oldCommunityAddresses.forEach(async address => {
            const communityMetadata = await CommunityContracts.getMetadataUri(address);
            let jsonOldCommunityMetadata = await getJSONFromURI(communityMetadata)
            console.log(communityMetadata);
            skillWallet.pastCommunities.push({
                name: jsonOldCommunityMetadata.name ?? 'DiTo #1',
                address
            })
        });

        const currentCommunity = await SkillWalletContracts.getCurrentCommunity(tokenId);
        const members = await CommunityContracts.getMembersCount(currentCommunity);

        skillWallet.currentCommunity.address = currentCommunity;
        skillWallet.currentCommunity.members = members;
        const communityMetadata = await CommunityContracts.getMetadataUri(currentCommunity);
        let jsonCommunityMetadata = await getJSONFromURI(communityMetadata)

        skillWallet.currentCommunity.name = jsonCommunityMetadata.name ?? 'DiTo #1';
        skillWallet.currentCommunity.description = jsonCommunityMetadata.description ?? 'description description description';
        skillWallet.currentCommunity.scarcityScore = 0;
        // skillWallet.diToCredits = await CommunityContracts.getDiToBalance(currentCommunity, userAddress)
        skillWallet.diToCredits = 2060;


        return skillWallet;
    } else {
        return undefined;
    }
}


export const getCommunityDetails = async (userAddress: string): Promise<CommunityListView> => {
    const isActive = await SkillWalletContracts.isActive(userAddress);
    const tokenId = await SkillWalletContracts.getSkillWalletIdByOwner(userAddress);
    if (isActive) {
        const currentCommunity = await SkillWalletContracts.getCurrentCommunity(tokenId);

        const members = await CommunityContracts.getMembersCount(currentCommunity);
        const communityMetadataUrl = await CommunityContracts.getMetadataUri(currentCommunity);
        let communityMetadata = await getJSONFromURI(communityMetadataUrl)
        const name = communityMetadata.name ?? 'DiTo #1';
        const description = communityMetadata.description ?? 'description description description';
        return {
            members,
            name,
            scarcityScore: 0,
            description,
            address: currentCommunity
        };

    } else {
        return undefined;
    }
}

export const hasPendingActivation = async (userAddress: string): Promise<boolean> => {
    const query = new Where('address').eq(userAddress);
    const activationAttempts = (await threadDBClient.filter(PendingSWActivationCollection, query)) as PendingActivation[];
    const lastAttempt = activationAttempts[activationAttempts.length - 1];
    return lastAttempt !== undefined;
}

export const getNonceForQR = async (action: number, tokenId?: string): Promise<any> => {
    const nonce = getNonce();
    if ((!tokenId || tokenId === '-1') && action !== Actions.Login)
        return { message: 'skillWalletId is required' };
    console.log(action);
    const authModel: QRCodeAuth = {
        _id: undefined,
        nonce,
        action,
        tokenId,
        isValidated: false,
    }
    await threadDBClient.insert(QRCodeAuthCollection, authModel);
    return { nonce, action };
}

export const loginValidation = async (nonce: number, tokenId: string): Promise<boolean> => {
    const query = new Where('nonce').eq(nonce).and('action').eq(Actions.Login).and('isValidated').eq(false);
    const login = (await threadDBClient.filter(QRCodeAuthCollection, query)) as QRCodeAuth[];
    if (login && login.length > 0) {
        login[login.length - 1].isValidated = true;
        login[login.length - 1].tokenId = tokenId;
        await threadDBClient.save(QRCodeAuthCollection, login);
        return true;
    }
    return false;
}

export const findNonce = async (action: Actions, tokenId: string): Promise<number[]> => {
    let query = undefined;
    const actionNumber = +action;
    console.log(actionNumber);
    console.log(typeof (actionNumber));
    if (action === Actions.Login)
        // TODO: add tokenId
        query = new Where('action').eq(actionNumber).and('isValidated').eq(false);
    else
        query = new Where('tokenId').eq(tokenId).and('action').eq(actionNumber).and('isValidated').eq(false);
    const auths = (await threadDBClient.filter(QRCodeAuthCollection, query)) as QRCodeAuth[];
    return auths.map(l => l.nonce);
}

export const getTokenIDAfterLogin = async (nonce: number): Promise<string> => {
    const query = new Where('nonce').eq(nonce).and('action').eq(Actions.Login).and('isValidated').eq(true);
    const login = (await threadDBClient.filter(QRCodeAuthCollection, query)) as QRCodeAuth[];
    if (login && login.length > 0) {
        await threadDBClient.delete(QRCodeAuthCollection, query);
        return login[login.length - 1].tokenId;
    } else
        return "-1";
}

export const invalidateNonce = async (nonce: number, tokenId: string, action: Actions): Promise<void> => {
    const query = new Where('nonce').eq(nonce).and('isValidated').eq(false).and('action').eq(action);
    const qrAuths = (await threadDBClient.filter(QRCodeAuthCollection, query)) as QRCodeAuth[];
    qrAuths.forEach(auth => {
        auth.isValidated = true;
        if (tokenId)
            auth.tokenId = tokenId;
        threadDBClient.update(QRCodeAuthCollection, auth._id, auth);
    });
}

export const getChat = async (skillWalletId: string, recipient: string): Promise<Chat> => {
    const query1 = new Where('participant1').eq(skillWalletId).and('participant2').eq(recipient);
    const query2 = new Where('participant2').eq(skillWalletId).and('participant1').eq(recipient);

    const finalQuery = query1.or(query2);

    const res = await threadDBClient.filter(ChatCollection, finalQuery) as Chat[];
    if (res.length > 0)
        return res[0];
    else
        return undefined;
}

export const addMessage = async (participant1: string, participant2: string, text: string): Promise<void> => {
    const query1 = new Where('participant1').eq(participant1).and('participant2').eq(participant2);
    const query2 = new Where('participant2').eq(participant1).and('participant1').eq(participant2);

    const finalQuery = query1.or(query2);

    const res = await threadDBClient.filter(ChatCollection, finalQuery) as Chat[];
    let chat: Chat;
    const message = {
        text,
        createdAt: new Date().toUTCString(),
        _id: undefined
    };
    if (res.length > 0) {
        chat = res[0];
        chat.messages.push(message);
        await threadDBClient.update(ChatCollection, chat._id, chat);
    } else {

        const part1JsonUri = await SkillWalletContracts.getTokenURI(participant1);
        let jsonMetadata1 = await getJSONFromURI(part1JsonUri)
        console.log(jsonMetadata1);
        const part2JsonUri = await SkillWalletContracts.getTokenURI(participant2);
        let jsonMetadata2 = await getJSONFromURI(part2JsonUri)
        console.log(jsonMetadata2);


        chat = {
            _id: undefined,
            participant1: participant1,
            participant2: participant2,
            participant1Name: jsonMetadata1.properties.username,
            participant1PhotoUrl: jsonMetadata1.image,
            participant2Name: jsonMetadata2.properties.username,
            participant2PhotoUrl: jsonMetadata2.image,
            messages: [message]
        };

        await threadDBClient.insert(ChatCollection, chat);
    }

}