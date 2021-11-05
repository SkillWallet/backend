
import {
    Actions,
    QRCodeAuth,
    SkillWallet,
    PendingActivation,
    CommunityListView,
    Chat,
    InteractionNFT,
    EventsList,
    CommunityBadges,
} from '../models';
import { SkillWalletContracts } from '../contracts/skillWallet.contracts';
import { CommunityContracts } from '../contracts/community.contracts';
import { Where } from '@textile/hub';
import threadDBClient from '../threaddb.config';
import { ChatCollection, NotificationCollection, PendingSWActivationCollection, QRCodeAuthCollection } from '../constants/constants';
import { getJSONFromURI, getNonce } from '../utils/helpers';

export const getSkillWallet = async (tokenId: string): Promise<SkillWallet> => {

    const skillWallet: SkillWallet = {
        pastCommunities: [],
        skills: [],
        currentCommunities: []
    } as SkillWallet;
    // const isActive = await SkillWalletContracts.isActive(tokenId);
    const isActive = true;
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
                name: jsonOldCommunityMetadata.title ?? 'DiTo #1',
                address
            })
        });

        const currentCommunity = await SkillWalletContracts.getCurrentCommunity(tokenId);
        const members = await CommunityContracts.getMembersCount(currentCommunity);

        const communityMetadata = await CommunityContracts.getMetadataUri(currentCommunity);
        let jsonCommunityMetadata = await getJSONFromURI(communityMetadata)

        const currentCommunityModel = {
            address: currentCommunity,
            members: members,
            name: jsonCommunityMetadata.title ?? 'DiTo #1',
            description: jsonCommunityMetadata.description,
            scarcityScore: 0,
            comScore: 1.08,
            repCredits: 2342
        };

        skillWallet.currentCommunities.push(currentCommunityModel);

        skillWallet.tokenId = tokenId;
        skillWallet.repScore = 1.3;
        return skillWallet;
    } else {
        return undefined;
    }
}


export const getInteractions = async (tokenId: string): Promise<InteractionNFT[]> => {
    // const isActive = await SkillWalletContracts.isActive(tokenId);
    const isActive = true;
    if (isActive) {
        return [
            {
                image: 'https://hub.textile.io/ipfs/bafkreidr5q62zcsy2ry2nqi6er2iq5ticftusgbj7fedotuz3pxldqrfou',
                role: 1,
                amount: 2,
                title: 'Title',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non arcu augue. Sed et sapien fringilla, vestibulum nulla viverra, lobortis est. Sed purus lectus, gravida a leo in, tincidunt commodo urna. Mauris vitae pulvinar lacus, sed interdum nisi.'

            },
            {
                image: 'https://hub.textile.io/ipfs/bafkreibnuixt3dwsnp6tilkmth75cg7loeurun2udtsoucwotfklwc6ymu',
                role: 2,
                amount: 1,
                title: 'Title',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non arcu augue. Sed et sapien fringilla, vestibulum nulla viverra, lobortis est. Sed purus lectus, gravida a leo in, tincidunt commodo urna. Mauris vitae pulvinar lacus, sed interdum nisi.'

            }
        ]
    } else {
        return undefined;
    }
}



export const getEvents = async (tokenId: string): Promise<EventsList> => {
    // const isActive = await SkillWalletContracts.isActive(tokenId);
    const isActive = true;
    if (isActive) {
        return {
            pastEvents: [
                {
                    title: 'Community Call #1',
                    roles: ['DAO', 'Member', 'Founder'],
                    credits: 6,
                },
                {
                    title: 'Community Call #2',
                    roles: ['DAO', 'Member', 'Founder'],
                    credits: 12,
                }
            ],
            futureEvents: [
                {
                    title: 'Community Call #3',
                    roles: ['DAO', 'Member', 'Founder'],
                    credits: 6,
                },
                {
                    title: 'Community Call #4',
                    roles: ['DAO', 'Member', 'Founder'],
                    credits: 12,
                }
            ]
        }
    } else {
        return undefined;
    }
}


export const getBadges = async (tokenId: string): Promise<CommunityBadges[]> => {
    // const isActive = await SkillWalletContracts.isActive(tokenId);
    const isActive = true;
    if (isActive) {
        return [
            {
                communityName: 'DiTo #1',
                badges: [
                    {
                        title: 'MembershipID',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non arcu augue. Sed et sapien fringilla, vestibulum nulla viverra, lobortis est. Sed purus lectus, gravida a leo in, tincidunt commodo urna. Mauris vitae pulvinar lacus, sed interdum nisi. Cras faucibus mi massa, a rhoncus odio eleifend at. Aliquam imperdiet, felis sit amet ultrices congue, orci purus dignissim lectus, non tincidunt sapien tellus vel ex. Nam rhoncus orci arcu, non posuere mauris aliquet vitae. Donec sit amet tristique tortor. Donec eget purus eget felis gravida eleifend. Vestibulum auctor nec lorem a tristique. Nam malesuada blandit efficitur. Curabitur condimentum lectus sit amet semper iaculis. Suspendisse nec tempus ante. In hac habitasse platea dictumst. In in diam eu massa dignissim iaculis eu eu eros. Maecenas sapien nibh, luctus eget ante nec, aliquam aliquam urna. Phasellus lobortis sem et dolor consectetur, at rhoncus ipsum sollicitudin. Sed placerat quam quam, quis interdum leo tempus rhoncus. Pellentesque erat metus, hendrerit ac viverra sit amet, egestas eget ante. Donec at elit sed velit sagittis commodo sit amet sit amet nisl. Proin justo lorem, lacinia eu tortor ac, aliquam venenatis erat. Mauris egestas eu eros at commodo. Pellentesque tempus ultrices ex, ut ornare ipsum blandit vel. Vivamus iaculis tortor a tortor rutrum, sed aliquam erat eleifend. Morbi cursus, mauris in scelerisque lacinia, elit leo gravida ex, ac facilisis purus enim at felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer semper eros mi, non tincidunt massa sagittis molestie.',
                        image: 'https://hub.textile.io/ipfs/bafkreibnuixt3dwsnp6tilkmth75cg7loeurun2udtsoucwotfklwc6ymu',
                    }
                ]

            },
            {
                communityName: 'DiTo #2',
                badges: [
                    {
                        title: 'MembershipID',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non arcu augue. Sed et sapien fringilla, vestibulum nulla viverra, lobortis est. Sed purus lectus, gravida a leo in, tincidunt commodo urna. Mauris vitae pulvinar lacus, sed interdum nisi. Cras faucibus mi massa, a rhoncus odio eleifend at. Aliquam imperdiet, felis sit amet ultrices congue, orci purus dignissim lectus, non tincidunt sapien tellus vel ex. Nam rhoncus orci arcu, non posuere mauris aliquet vitae. Donec sit amet tristique tortor. Donec eget purus eget felis gravida eleifend. Vestibulum auctor nec lorem a tristique. Nam malesuada blandit efficitur. Curabitur condimentum lectus sit amet semper iaculis. Suspendisse nec tempus ante. In hac habitasse platea dictumst. In in diam eu massa dignissim iaculis eu eu eros. Maecenas sapien nibh, luctus eget ante nec, aliquam aliquam urna. Phasellus lobortis sem et dolor consectetur, at rhoncus ipsum sollicitudin. Sed placerat quam quam, quis interdum leo tempus rhoncus. Pellentesque erat metus, hendrerit ac viverra sit amet, egestas eget ante. Donec at elit sed velit sagittis commodo sit amet sit amet nisl. Proin justo lorem, lacinia eu tortor ac, aliquam venenatis erat. Mauris egestas eu eros at commodo. Pellentesque tempus ultrices ex, ut ornare ipsum blandit vel. Vivamus iaculis tortor a tortor rutrum, sed aliquam erat eleifend. Morbi cursus, mauris in scelerisque lacinia, elit leo gravida ex, ac facilisis purus enim at felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer semper eros mi, non tincidunt massa sagittis molestie.',
                        image: 'https://hub.textile.io/ipfs/bafkreidr5q62zcsy2ry2nqi6er2iq5ticftusgbj7fedotuz3pxldqrfou',
                    }
                ]

            },
            {
                communityName: 'DiTo #3',
                badges: [
                    {
                        title: 'MembershipID',
                        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non arcu augue. Sed et sapien fringilla, vestibulum nulla viverra, lobortis est. Sed purus lectus, gravida a leo in, tincidunt commodo urna. Mauris vitae pulvinar lacus, sed interdum nisi. Cras faucibus mi massa, a rhoncus odio eleifend at. Aliquam imperdiet, felis sit amet ultrices congue, orci purus dignissim lectus, non tincidunt sapien tellus vel ex. Nam rhoncus orci arcu, non posuere mauris aliquet vitae. Donec sit amet tristique tortor. Donec eget purus eget felis gravida eleifend. Vestibulum auctor nec lorem a tristique. Nam malesuada blandit efficitur. Curabitur condimentum lectus sit amet semper iaculis. Suspendisse nec tempus ante. In hac habitasse platea dictumst. In in diam eu massa dignissim iaculis eu eu eros. Maecenas sapien nibh, luctus eget ante nec, aliquam aliquam urna. Phasellus lobortis sem et dolor consectetur, at rhoncus ipsum sollicitudin. Sed placerat quam quam, quis interdum leo tempus rhoncus. Pellentesque erat metus, hendrerit ac viverra sit amet, egestas eget ante. Donec at elit sed velit sagittis commodo sit amet sit amet nisl. Proin justo lorem, lacinia eu tortor ac, aliquam venenatis erat. Mauris egestas eu eros at commodo. Pellentesque tempus ultrices ex, ut ornare ipsum blandit vel. Vivamus iaculis tortor a tortor rutrum, sed aliquam erat eleifend. Morbi cursus, mauris in scelerisque lacinia, elit leo gravida ex, ac facilisis purus enim at felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer semper eros mi, non tincidunt massa sagittis molestie.',
                        image: 'https://hub.textile.io/ipfs/bafkreibnuixt3dwsnp6tilkmth75cg7loeurun2udtsoucwotfklwc6ymu',
                    }
                ]

            }
        ]

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
        const name = communityMetadata.title ?? 'DiTo #1';
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
    console.log(action == Actions.Login);
    if (action == Actions.Login)
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
    if (res.length > 0) {
        return res[0];
    } else {
        await addMessage(skillWalletId, recipient, undefined);
        const defaultMessage = await threadDBClient.filter(ChatCollection, finalQuery) as Chat[];
        return defaultMessage[0];
    }
}

export const getNotifications = async (skillWalletId: string): Promise<Notification[]> => {
    const query = new Where('skillWalletId').eq(skillWalletId);
    const res = await threadDBClient.filter(NotificationCollection, query) as Notification[];
    return res;
}

export const addMessage = async (sender: string, recipient: string, text: string): Promise<void> => {
    const query1 = new Where('participant1').eq(sender).and('participant2').eq(recipient);
    const query2 = new Where('participant2').eq(sender).and('participant1').eq(recipient);

    const finalQuery = query1.or(query2);

    const res = await threadDBClient.filter(ChatCollection, finalQuery) as Chat[];
    let chat: Chat;
    let message = undefined;
    if (text)
        message = {
            text,
            createdAt: Date.now(),
            sender: sender
        };


    if (res.length > 0) {
        chat = res[0];
        if (message)
            chat.messages.push(message);
        await threadDBClient.update(ChatCollection, chat._id, chat);
    } else {
        const senderJsonUrl = await SkillWalletContracts.getTokenURI(sender);
        let senderJsonMetadata = await getJSONFromURI(senderJsonUrl)
        const recipientJsonUrl = await SkillWalletContracts.getTokenURI(recipient);
        let recipientJsonMetadata = await getJSONFromURI(recipientJsonUrl)

        chat = {
            _id: undefined,
            participant1: sender,
            participant2: recipient,
            participant1Name: senderJsonMetadata.properties.username,
            participant1PhotoUrl: senderJsonMetadata.image,
            participant2Name: recipientJsonMetadata.properties.username,
            participant2PhotoUrl: recipientJsonMetadata.image,
            messages: message ? [message] : []
        };

        await threadDBClient.insert(ChatCollection, chat);
    }

}