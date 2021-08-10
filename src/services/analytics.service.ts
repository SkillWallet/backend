import axios from "axios"
import { RLP } from "ethers/lib/utils";


export const getActiveUsers = async (address: string, startDate?: number, perMonth?: boolean, perDay?: boolean): Promise<any> => {
    const res = await axios.get(`https://api.covalenthq.com/v1/80001/address/${address}/transactions_v2/?key=ckey_aae01fa51e024af3a2634d9d030&no-logs=true`);
    let txs = res.data.data.items as any[];
    console.log(new Date(txs[0].block_signed_at).getMonth());
    console.log(new Date(startDate).getMonth());
    if (perMonth)
        txs =
            txs.filter(tx => new Date(tx.block_signed_at).getFullYear() == new Date(startDate).getFullYear());
    if (perDay)
        txs =
            txs.filter(tx => new Date(tx.block_signed_at).getMonth() == new Date(startDate).getMonth());

    const activeUsers = txs.map(tx => ({ address: tx.from_address, date: tx.block_signed_at })) as any[];
    const result = [];
    if (perMonth) {
        activeUsers.forEach(element => {
            if (typeof (result[new Date(element.date).getMonth() + 1]) != 'object')
                result[new Date(element.date).getMonth() + 1] = [];
            if (result[new Date(element.date).getMonth() + 1].indexOf(element.address) == -1)
                result[new Date(element.date).getMonth() + 1].push(element.address);
        });
    } else if (perDay) {
        activeUsers.forEach(element => {
            if (typeof (result[new Date(element.date).getDate()]) != 'object')
                result[new Date(element.date).getDate()] = []
            if (result[new Date(element.date).getDate()].indexOf(element.address) == -1)
                result[new Date(element.date).getDate()].push(element.address);
        });
    }

    const lengths = result.map(r => r.length);
    const returnRes = {};
    for (var index = 0; index < lengths.length; index++) {
        returnRes[index] = lengths[index];
    }

    return returnRes;
}

// Redo those to use only the SW contract (get NFTs minted)
export const getNewUsers = async (address: string, startDate?: number, perMonth?: boolean, perDay?: boolean): Promise<any> => {

    const allUsersRequest = await axios.get(`https://api.covalenthq.com/v1/80001/address/${address}/transactions_v2/?key=ckey_aae01fa51e024af3a2634d9d030&no-logs=true`);
    const allUsers = allUsersRequest.data.data.items.map((tx => ({ address: tx.from_address, date: tx.block_signed_at }))) as any[];

    const result = {};

    const uniqueAddresses = [];
    if (perMonth) {
        allUsers.forEach(element => {
            if (typeof (result[new Date(element.date).getMonth() + 1]) != 'number')
                result[new Date(element.date).getMonth() + 1] = 0;
            if (uniqueAddresses.indexOf(element.address) == -1 && new Date(element.date).getFullYear() == new Date(startDate).getFullYear()) {
                result[new Date(element.date).getMonth() + 1]++;
                uniqueAddresses.push(element.address);
            }
        });
    } else if (perDay) {
        allUsers.forEach(element => {
            if (typeof (result[new Date(element.date).getDate()]) != 'number')
                result[new Date(element.date).getDate()] = 0;

            if (uniqueAddresses.indexOf(element.address) == -1 && new Date(element.date).getMonth() == new Date(startDate).getMonth()) {
                result[new Date(element.date).getDate()]++;
                uniqueAddresses.push(element.address);
            }
        });
    }

    return result;
}


