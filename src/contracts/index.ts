import community from './abis/Community.json';
import skillWallet from './abis/SkillWallet.json';
import osm from './abis/OSM.json';

import { ethers, provider, signer } from '../tools/ethers';

require('dotenv').config()

export const skillWalletContract = () => {
  try {
    let contract = new ethers.Contract(
      process.env.SKILL_WALLET_ADDRESS,
      skillWallet.abi,
      signer,
    );
    return contract;
  } catch (err) {
    console.log(err);
  }
}
export const communityContract = (address) => {
  try {
    let contract = new ethers.Contract(
      address,
      community.abi,
      signer,
    );
    return contract;
  } catch (err) {
    console.log(err);
  }
};

export const osmContract = (address) => {
  try {
    let contract = new ethers.Contract(
      address,
      osm.abi,
      signer,
    );
    return contract;
  } catch (err) {
    console.log(err);
  }
};

