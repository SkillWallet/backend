import {
  Client,
  createUserAuth,
  KeyInfo,
  PrivateKey,
  QueryJSON,
  ThreadID,
  UserAuth,
} from '@textile/hub'

import {
  QRCodeAuthCollection,
  ChatCollection,
  NotificationCollection,
  CoreTeamMemberNamesCollection
} from './constants/constants';
import { injectable } from 'inversify';
import {
  qrCodeAuthSchema,
  chatSchema,
  notificationSchema,
  coreTeamMemberNameSchema
} from './models'
require('dotenv').config()

const ditoThreadID = process.env.DITO_THREADID;
const ditoPrivKey = process.env.DITO_PRIVATE_KEY;
const keyInfo = {
  key: process.env.TEXTILE_KEY,
  secret: process.env.TEXTILE_SECRET
}
@injectable()
class ThreadDBInit {
  client: Client;
  ditoThreadID: ThreadID;
  communityKeysThreadID: ThreadID;

  public async getClient(): Promise<Client> {
    if (!this.client)
      await this.initialize();

    return this.client;
  }

  async initialize() {
    const auth = await this.auth(keyInfo);
    const client = await Client.withKeyInfo(auth)
    this.ditoThreadID = ThreadID.fromString(ditoThreadID);

    try {
      await client.getCollectionIndexes(this.ditoThreadID, QRCodeAuthCollection);
    } catch (err) {
      await client.newCollection(this.ditoThreadID, { name: QRCodeAuthCollection, schema: qrCodeAuthSchema });
    }

    try {
      await client.getCollectionIndexes(this.ditoThreadID, CoreTeamMemberNamesCollection);
    } catch (err) {
      await client.newCollection(this.ditoThreadID, { name: CoreTeamMemberNamesCollection, schema: coreTeamMemberNameSchema });
    }

    try {
      await client.getCollectionIndexes(this.ditoThreadID, ChatCollection);
    } catch (err) {
      await client.newCollection(this.ditoThreadID, { name: ChatCollection, schema: chatSchema });
    }
    try {
      await client.getCollectionIndexes(this.ditoThreadID, NotificationCollection);
    } catch (err) {
      await client.newCollection(this.ditoThreadID, { name: NotificationCollection, schema: notificationSchema });
    }
  }

  private async auth(keyInfo: KeyInfo) {
    // Create an expiration and create a signature. 60s or less is recommended.
    const expiration = new Date(Date.now() + 60 * 1000)
    // Generate a new UserAuth
    const userAuth: UserAuth = await createUserAuth(keyInfo.key, keyInfo.secret ?? '', expiration)
    return userAuth
  }

  public async getAll(collectionName: string, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;

    return await client.find(thread, collectionName, {});
  }

  public async getByID(collectionName: string, id: string, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;
    return await client.findByID(thread, collectionName, id);
  }

  public async filter(collectionName: string, filter: QueryJSON, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;
    const toReturn = await client.find(thread, collectionName, filter);
    return toReturn;
  }

  public async delete(collectionName: string, filter: QueryJSON, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);
    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;
    const toDelete = (await client.find(thread, collectionName, {})).map(item => (item as any)._id);
    await client.delete(thread, collectionName, toDelete);
    return toDelete;
  }

  public async insert(collectionName: string, model: any, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;

    return await client.create(thread, collectionName, [model]);
  }

  public async save(collectionName: string, values: any[], threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;
    return await client.save(thread, collectionName, values);
  }

  public async update(collectionName: string, id: string, model: any, threadID?: string) {
    const auth = await this.auth(keyInfo);
    const client = Client.withUserAuth(auth);

    const thread = threadID ? ThreadID.fromString(threadID) : this.ditoThreadID;
    let toUpdate = await client.findByID(thread, collectionName, id);
    toUpdate = model;
    client.save(thread, collectionName, [toUpdate]);
  }
}


const threadDBClient = new ThreadDBInit();
threadDBClient.getClient();
export default threadDBClient;