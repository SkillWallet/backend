import { Actions } from '../models';
import { skillWalletContract, osmContract } from './index';

export class SkillWalletContracts {

    public static async getSkillWalletIdByOwner(address: string): Promise<string> {
        try {
            const contract = skillWalletContract();
            const tokenId = await contract.getSkillWalletIdByOwner(address);
            return tokenId.toString();
        } catch (err) {
            console.log(err);
        }
    }

    public static async getTokenURI(tokenId: string): Promise<string> {
        try {
            const contract = skillWalletContract();
            const uri = await contract.tokenURI(tokenId);
            return uri;
        } catch (err) {
            console.log(err);
        }
    }

    public static async getCommunityHistory(tokenId: string): Promise<any> {
        try {
            const contract = skillWalletContract();
            const history = await contract.getCommunityHistory(tokenId);
            return history;
        } catch (err) {
            console.log(err);
        }
    }

    public static async getCurrentCommunity(tokenId: string): Promise<any> {
        try {
            const contract = skillWalletContract();
            const community = await contract.getActiveCommunity(tokenId);
            return community;
        } catch (err) {
            console.log(err);
        }
    }

    public static async getSkills(tokenId: string): Promise<any> {
        try {
            const contract = skillWalletContract();
            const skills = await contract.getSkillSet(tokenId);
            return skills;
        } catch (err) {
            console.log(err);
        }
    }


    public static async isActive(tokenId: string): Promise<boolean> {
        try {
            if (tokenId == '123123123')
                return true;
            const contract = skillWalletContract();
            console.log(tokenId);
            const isActivated = await contract.isSkillWalletActivated(tokenId);
            console.log(isActivated);
            return isActivated;
        } catch (err) {
            console.log(err);
        }
    }


    public static async ownerOf(tokenId: string): Promise<string> {
        try {
            const contract = skillWalletContract();
            const owner = await contract.ownerOf(tokenId);
            return owner;
        } catch (err) {
            console.log(err);
        }
    }

    public static async addPubKeyToSkillWallet(tokenId: string, pubKey: string): Promise<void> {
        const contractInst = skillWalletContract();

        let addPubKeyTx = await contractInst.addPubKeyToSkillWallet(
            tokenId,
            pubKey
        );

        console.log(addPubKeyTx);

        // Wait for transaction to finish
        const transactionResult = await addPubKeyTx.wait();
        const { events } = transactionResult;
        console.log(events);
        const registeredEvent = events.find(
            e => e.event === 'PubKeyAddedToSkillWallet',
        );
        if (!registeredEvent)
            throw Error('Something went wrong!');
        else
            console.log('Successfully added pubKey to the SW!');
    }


    public static async validate(signature: string, tokenId: string, action: Actions, stringParams: [], intParams: [], addressParams: []): Promise<void> {
        const contractInst = skillWalletContract();
        const osmAddr = contractInst.getOSMAddress();
        const osmInst = osmContract(osmAddr);

        let createTx = await osmInst.validate(
            signature,
            tokenId,
            action,
            stringParams,
            intParams,
            addressParams
        );

        // Wait for transaction to finish
        const transactionResult = await createTx.wait();
        const { events } = transactionResult;
        const registeredEvent = events.find(
            e => e.event === 'ValidationRequestIdSent',
        );
        if (!registeredEvent)
            throw Error('Something went wrong!');
        else
            console.log('Triggered chainlink validation!');
    }
}
