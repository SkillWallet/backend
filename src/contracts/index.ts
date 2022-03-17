import community from './abis/Community.json';
import skillWallet from './abis/SkillWallet.json';
import osm from './abis/OSM.json';
import activities from './abis/Activities.json';
import distributedTown from './abis/DistributedTown.json';
import { ethers, provider, signer } from '../tools/ethers';

require('dotenv').config()

export const distributedTownContract = () => {
  try {
    let contract = new ethers.Contract(
      process.env.DISTRIBUTED_TOWN_ADDRESS,
      distributedTown.abi,
      signer,
    );
    return contract;
  } catch (err) {
    console.log(err);
  }
};

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


export const activitiesContract = (address) => {
  try {
    let contract = new ethers.Contract(
      address,
      activities.abi,
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

