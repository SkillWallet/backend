import axios from "axios"

export const getUsers = async (address: string, startDate?: number): Promise<number> => {
    const res = await axios.get(`https://api.covalenthq.com/v1/80001/address/${address}/transactions_v2/?key=ckey_aae01fa51e024af3a2634d9d030&no-logs=true`);
    let txs = res.data.data.items as any[];

    if (startDate)
        txs =
            txs.filter(tx => Date.parse(tx.block_signed_at) > startDate);

    const uniqueAddresses = txs.map(tx => tx.from_address) as string[];

    return new Set(uniqueAddresses).size;
}


