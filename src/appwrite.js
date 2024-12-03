import { Client, Databases, Storage, Account } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('672d0b8e0014910a008a');
const databases = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);

export const projectId = "672d0b8e0014910a008a";
export const databaseId = "672d0d2a001babcd5864";
export const eventsCollectionId = "672d0d5b000ac59f390e";
export const membersCollectionId = "6749898100187151119f";
export const registrationsCollectionId = "672dc547003e13a06ab6";
export const bucketId = "672d1733003b1ad52215";

export { client, databases, storage, account };

export const createUser = async (email, password, name) => {
  try {
    const user = await account.create('unique()', email, password, name);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const deleteUserSession = async () => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error("Error deleting user session:", error);
    throw error;
  }
};