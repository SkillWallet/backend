import { QrCodeAuthModel } from './../models/qrCodeAuth';
import { SkillsCategory } from './../models/skillCategory';
import { GeneralSkills } from './../constants/constants';
import {
  Actions,
  SkillWallet,
  CommunityListView,
  InteractionNFT,
  EventsList,
  CommunityBadges,
  MembershipID,
  Task,
  Type,
  TaskDetails,
} from "../models";
import { SkillWalletContracts } from "../contracts/skillWallet.contracts";
import { CommunityContracts } from "../contracts/community.contracts";
import { getJSONFromURI, getNonce, ipfsCIDToHttpUrl } from "../utils/helpers";
import { ActivityContracts } from "../contracts/activities.contracts";
import { ethers } from 'ethers';

export async function getByCategory(category: string): Promise<SkillsCategory> {
  return GeneralSkills.find(coll => coll.main === category) as SkillsCategory;
}

export const getSkillWallet = async (tokenId: string): Promise<SkillWallet> => {
  const skillWallet: SkillWallet = {
    pastCommunities: [],
    skills: [],
    currentCommunities: [],
  } as SkillWallet;

  if (tokenId === "-1") {
    return {
      tokenId: "-1",
      nickname: "Apple test",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png",
      diToCredits: 2000,
      repScore: 1.6,
      currentCommunities: [
        {
          name: "Apple Test Community",
          address: "0x",
          members: 2,
          description: "This is a test community for Apple testers.",
          scarcityScore: 72,
          comScore: 2,
          repCredits: 2000,
        },
      ],
      pastCommunities: [],
      skills: [
        {
          name: "Tester",
          value: 10,
        },
      ],
    };
  }
  const isActive = await SkillWalletContracts.isActive(tokenId);
  if (isActive) {
    const jsonUriCID = await SkillWalletContracts.getTokenURI(tokenId);
    const jsonUri = ipfsCIDToHttpUrl(jsonUriCID, true);
    let jsonMetadata = await getJSONFromURI(jsonUri);
    skillWallet.imageUrl = ipfsCIDToHttpUrl(
      jsonMetadata.properties.avatar || jsonMetadata.image,
      false
    );
    skillWallet.nickname = jsonMetadata.properties.username;
    skillWallet.skills =
      jsonMetadata.properties.skills || jsonMetadata.properties.roles;

    const oldCommunityAddresses: string[] =
      await SkillWalletContracts.getCommunityHistory(tokenId);
    oldCommunityAddresses.forEach(async (address) => {
      const communityMetadataCID = await CommunityContracts.getMetadataUri(
        address
      );
      const communityMetadata = ipfsCIDToHttpUrl(communityMetadataCID, true);
      let jsonOldCommunityMetadata = await getJSONFromURI(communityMetadata);
      console.log(communityMetadata);
      skillWallet.pastCommunities.push({
        name: jsonOldCommunityMetadata.title ?? jsonOldCommunityMetadata.name,
        address,
      });
    });

    const currentCommunity = await SkillWalletContracts.getCurrentCommunity(
      tokenId
    );
    const members = await CommunityContracts.getMembersCount(currentCommunity);

    const communityMetadataCID = await CommunityContracts.getMetadataUri(
      currentCommunity
    );
    const communityMetadata = ipfsCIDToHttpUrl(communityMetadataCID, true);
    let jsonCommunityMetadata = await getJSONFromURI(communityMetadata);

    const currentCommunityModel = {
      address: currentCommunity,
      members: members,
      name: jsonCommunityMetadata.title ?? jsonCommunityMetadata.name,
      description: jsonCommunityMetadata.description,
      scarcityScore: 0,
      comScore: 1.08,
      repCredits: 2342,
    };

    skillWallet.currentCommunities.push(currentCommunityModel);

    skillWallet.tokenId = tokenId;
    skillWallet.repScore = 1.3;
    return skillWallet;
  } else {
    return undefined;
  }
};

export const getInteractions = async (
  tokenId: string
): Promise<InteractionNFT[]> => {
  const isActive = await SkillWalletContracts.isActive(tokenId);
  if (isActive) {
    return [
      // {
      //     image: 'https://hub.textile.io/ipfs/bafkreidr5q62zcsy2ry2nqi6er2iq5ticftusgbj7fedotuz3pxldqrfou',
      //     role: 1,
      //     amount: 3,
      //     title: 'Title',
      //     communityName: 'Com name',
      //     membershipID: '1',
      //     date: 'Nov, 11, 2020',
      // },
      // {
      //     image: 'https://hub.textile.io/ipfs/bafkreibnuixt3dwsnp6tilkmth75cg7loeurun2udtsoucwotfklwc6ymu',
      //     role: 2,
      //     amount: 4,
      //     title: 'Title',
      //     communityName: 'Com name',
      //     membershipID: '1',
      //     date: 'Nov, 11, 2020',
      // }
    ];
  } else {
    return undefined;
  }
};

export const getEvents = async (tokenId: string): Promise<EventsList> => {
  const isActive = await SkillWalletContracts.isActive(tokenId);
  if (isActive) {
    return {
      pastEvents: [
        // {
        //     title: 'Community Call #1',
        //     roles: ['DAO', 'Member', 'Founder'],
        //     credits: 6,
        // },
        // {
        //     title: 'Community Call #2',
        //     roles: ['DAO', 'Member', 'Founder'],
        //     credits: 12,
        // }
      ],
      futureEvents: [
        // {
        //     title: 'Community Call #3',
        //     roles: ['DAO', 'Member', 'Founder'],
        //     credits: 6,
        // },
        // {
        //     title: 'Community Call #4',
        //     roles: ['DAO', 'Member', 'Founder'],
        //     credits: 12,
        // }
      ],
    };
  } else {
    return undefined;
  }
};

export const getTasks = async (activityAddress: string): Promise<Task[]> => {
  if (activityAddress == ethers.constants.AddressZero) {
    return [];
  }
  const activityIds = await ActivityContracts.getActivities(
    activityAddress,
    Type.CoreTeamTask
  );
  const tasks = [];

  for (var i = 0; i < activityIds.length; i++) {
    const tokenCID = await ActivityContracts.getTokenURI(
      activityAddress,
      activityIds[i]
    );
    const tokenUri = ipfsCIDToHttpUrl(tokenCID, true);
    let jsonMetadata = await getJSONFromURI(tokenUri);
    const task = await ActivityContracts.getTaskById(
      activityAddress,
      activityIds[i]
    );
    console.log(jsonMetadata);
    tasks.push({
      activityId: task.activityId.toString(),
      title: jsonMetadata.name,
      createdOn: task.createdOn.toString(),
      status: task.status,
      creator: task.creator.toString(),
      taker: task.taker.toString(),
      description: jsonMetadata.properties.description,
      isCoreTeamMembersOnly: jsonMetadata.properties.isCoreTeamMembersOnly,
    });
  }

  return tasks;
};

export const getTaskById = async (
  activityAddress: string,
  activityID: string
): Promise<TaskDetails> => {
  const activity = await ActivityContracts.getTaskById(
    activityAddress,
    activityID
  );
  console.log(activity);

  const tokenUriCID = await ActivityContracts.getTokenURI(
    activityAddress,
    activityID
  );
  const tokenUri = ipfsCIDToHttpUrl(tokenUriCID, true);
  let jsonMetadata = await getJSONFromURI(tokenUri);
  const task = await ActivityContracts.getTaskById(activityAddress, activityID);

  const taskDetails: TaskDetails = { task: undefined, taker: undefined };
  taskDetails.task = {
    activityId: task.activityId.toString(),
    createdOn: task.createdOn.toString(),
    status: task.status,
    creator: task.creator.toString(),
    taker: task.taker.toString(),
    description: jsonMetadata.properties.description,
    title: jsonMetadata.name,
    isCoreTeamMembersOnly: jsonMetadata.properties.isCoreTeamMembersOnly,
  };

  if (taskDetails.task.status > 0) {
    const takerTokenId = await SkillWalletContracts.getSkillWalletIdByOwner(
      taskDetails.task.taker
    );
    const jsonUriCID = await SkillWalletContracts.getTokenURI(takerTokenId);
    const jsonUri = ipfsCIDToHttpUrl(jsonUriCID, true);
    let jsonMetadata = await getJSONFromURI(jsonUri);
    taskDetails.taker = {
      tokenId: takerTokenId,
      imageUrl: ipfsCIDToHttpUrl(jsonMetadata.image, false),
      nickname: jsonMetadata.properties.username,
      timestamp: undefined,
    };
  }

  return taskDetails;
};

export const getBadges = async (
  tokenId: string
): Promise<CommunityBadges[]> => {
  const isActive = await SkillWalletContracts.isActive(tokenId);
  if (isActive) {
    return [
      {
        communityName: "DiTo #1",
        badges: [
          {
            title: "MembershipID",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non arcu augue. Sed et sapien fringilla, vestibulum nulla viverra, lobortis est. Sed purus lectus, gravida a leo in, tincidunt commodo urna. Mauris vitae pulvinar lacus, sed interdum nisi. Cras faucibus mi massa, a rhoncus odio eleifend at. Aliquam imperdiet, felis sit amet ultrices congue, orci purus dignissim lectus, non tincidunt sapien tellus vel ex. Nam rhoncus orci arcu, non posuere mauris aliquet vitae. Donec sit amet tristique tortor. Donec eget purus eget felis gravida eleifend. Vestibulum auctor nec lorem a tristique. Nam malesuada blandit efficitur. Curabitur condimentum lectus sit amet semper iaculis. Suspendisse nec tempus ante. In hac habitasse platea dictumst. In in diam eu massa dignissim iaculis eu eu eros. Maecenas sapien nibh, luctus eget ante nec, aliquam aliquam urna. Phasellus lobortis sem et dolor consectetur, at rhoncus ipsum sollicitudin. Sed placerat quam quam, quis interdum leo tempus rhoncus. Pellentesque erat metus, hendrerit ac viverra sit amet, egestas eget ante. Donec at elit sed velit sagittis commodo sit amet sit amet nisl. Proin justo lorem, lacinia eu tortor ac, aliquam venenatis erat. Mauris egestas eu eros at commodo. Pellentesque tempus ultrices ex, ut ornare ipsum blandit vel. Vivamus iaculis tortor a tortor rutrum, sed aliquam erat eleifend. Morbi cursus, mauris in scelerisque lacinia, elit leo gravida ex, ac facilisis purus enim at felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer semper eros mi, non tincidunt massa sagittis molestie.",
            image:
              "https://hub.textile.io/ipfs/bafkreibnuixt3dwsnp6tilkmth75cg7loeurun2udtsoucwotfklwc6ymu",
          },
        ],
      },
      {
        communityName: "DiTo #2",
        badges: [
          {
            title: "MembershipID",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non arcu augue. Sed et sapien fringilla, vestibulum nulla viverra, lobortis est. Sed purus lectus, gravida a leo in, tincidunt commodo urna. Mauris vitae pulvinar lacus, sed interdum nisi. Cras faucibus mi massa, a rhoncus odio eleifend at. Aliquam imperdiet, felis sit amet ultrices congue, orci purus dignissim lectus, non tincidunt sapien tellus vel ex. Nam rhoncus orci arcu, non posuere mauris aliquet vitae. Donec sit amet tristique tortor. Donec eget purus eget felis gravida eleifend. Vestibulum auctor nec lorem a tristique. Nam malesuada blandit efficitur. Curabitur condimentum lectus sit amet semper iaculis. Suspendisse nec tempus ante. In hac habitasse platea dictumst. In in diam eu massa dignissim iaculis eu eu eros. Maecenas sapien nibh, luctus eget ante nec, aliquam aliquam urna. Phasellus lobortis sem et dolor consectetur, at rhoncus ipsum sollicitudin. Sed placerat quam quam, quis interdum leo tempus rhoncus. Pellentesque erat metus, hendrerit ac viverra sit amet, egestas eget ante. Donec at elit sed velit sagittis commodo sit amet sit amet nisl. Proin justo lorem, lacinia eu tortor ac, aliquam venenatis erat. Mauris egestas eu eros at commodo. Pellentesque tempus ultrices ex, ut ornare ipsum blandit vel. Vivamus iaculis tortor a tortor rutrum, sed aliquam erat eleifend. Morbi cursus, mauris in scelerisque lacinia, elit leo gravida ex, ac facilisis purus enim at felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer semper eros mi, non tincidunt massa sagittis molestie.",
            image:
              "https://hub.textile.io/ipfs/bafkreidr5q62zcsy2ry2nqi6er2iq5ticftusgbj7fedotuz3pxldqrfou",
          },
        ],
      },
      {
        communityName: "DiTo #3",
        badges: [
          {
            title: "MembershipID",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non arcu augue. Sed et sapien fringilla, vestibulum nulla viverra, lobortis est. Sed purus lectus, gravida a leo in, tincidunt commodo urna. Mauris vitae pulvinar lacus, sed interdum nisi. Cras faucibus mi massa, a rhoncus odio eleifend at. Aliquam imperdiet, felis sit amet ultrices congue, orci purus dignissim lectus, non tincidunt sapien tellus vel ex. Nam rhoncus orci arcu, non posuere mauris aliquet vitae. Donec sit amet tristique tortor. Donec eget purus eget felis gravida eleifend. Vestibulum auctor nec lorem a tristique. Nam malesuada blandit efficitur. Curabitur condimentum lectus sit amet semper iaculis. Suspendisse nec tempus ante. In hac habitasse platea dictumst. In in diam eu massa dignissim iaculis eu eu eros. Maecenas sapien nibh, luctus eget ante nec, aliquam aliquam urna. Phasellus lobortis sem et dolor consectetur, at rhoncus ipsum sollicitudin. Sed placerat quam quam, quis interdum leo tempus rhoncus. Pellentesque erat metus, hendrerit ac viverra sit amet, egestas eget ante. Donec at elit sed velit sagittis commodo sit amet sit amet nisl. Proin justo lorem, lacinia eu tortor ac, aliquam venenatis erat. Mauris egestas eu eros at commodo. Pellentesque tempus ultrices ex, ut ornare ipsum blandit vel. Vivamus iaculis tortor a tortor rutrum, sed aliquam erat eleifend. Morbi cursus, mauris in scelerisque lacinia, elit leo gravida ex, ac facilisis purus enim at felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer semper eros mi, non tincidunt massa sagittis molestie.",
            image:
              "https://hub.textile.io/ipfs/bafkreibnuixt3dwsnp6tilkmth75cg7loeurun2udtsoucwotfklwc6ymu",
          },
        ],
      },
    ];
  } else {
    return undefined;
  }
};

export const getMembershipID = async (
  tokenId: string,
  communityAddress: string
): Promise<MembershipID> => {
  const skillWallet = await getSkillWallet(tokenId);
  const community = await getCommunityDetails(communityAddress);
  const isActive = true;
  if (isActive) {
    return {
      communityName: "DiTo #1",
      logoImage:
        "https://hub.textile.io/ipfs/bafkreibnuixt3dwsnp6tilkmth75cg7loeurun2udtsoucwotfklwc6ymu",
      membershipNumber: "1",
      communnityDescription: community.description,
      about:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non arcu augue. Sed et sapien fringilla, vestibulum nulla viverra, lobortis est. Sed purus lectus, gravida a leo in, tincidunt commodo urna. Mauris vitae pulvinar lacus, sed interdum nisi. Cras faucibus mi massa, a rhoncus odio eleifend at. Aliquam imperdiet, felis sit amet ultrices congue, orci purus dignissim lectus, non tincidunt sapien tellus vel ex. Nam rhoncus orci arcu, non posuere mauris aliquet vitae.",
      owner: skillWallet?.nickname,
      date: "Nov, 13, 2021",
    };
  } else {
    return undefined;
  }
};

export const getCommunityDetails = async (
  communityAddress: string
): Promise<CommunityListView> => {
  const members = await CommunityContracts.getMembersCount(communityAddress);
  const communityMetadataUrlCID = await CommunityContracts.getMetadataUri(
    communityAddress
  );
  const communityMetadataUrl = ipfsCIDToHttpUrl(communityMetadataUrlCID, true);
  let communityMetadata = await getJSONFromURI(communityMetadataUrl);
  const name = communityMetadata.title ?? "DiTo #1";
  const description =
    communityMetadata.description ?? "description description description";
  return {
    members,
    name,
    scarcityScore: 0,
    description,
    address: communityAddress,
  };
};

export const getNonceForQR = async (
  action: number,
  tokenId?: string
): Promise<any> => {
  const nonce = getNonce();
  if ((!tokenId || tokenId === "-1") && action !== Actions.Login)
    return { message: "skillWalletId is required" };
  console.log(action);

  const authModel = new QrCodeAuthModel({
    nonce,
    action,
    tokenId,
    isValidated: false,
  });

  await authModel.save();

  return { nonce, action };
};

export const findNonce = async (
  action: Actions,
  tokenId: string
): Promise<number[]> => {
  const actionNumber = +action;
  console.log(actionNumber);
  console.log(typeof actionNumber);
  console.log(action == Actions.Login);

  const auths = await QrCodeAuthModel.find({ tokenId, action: actionNumber, isValidated: false }).exec();

  return auths.map((l) => l.nonce);
};

export const invalidateNonce = async (
  nonce: number,
  tokenId: string,
  action: Actions
): Promise<void> => {
  const qrAuths = await QrCodeAuthModel.find({ nonce, action, isValidated: false }).exec();

  qrAuths.forEach((auth) => {
    if (tokenId) auth.tokenId = tokenId;
    auth.isValidated = true;
    auth.save();
  });
};
