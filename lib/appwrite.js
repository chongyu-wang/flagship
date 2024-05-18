
import { Account, Client, Databases, ID, Avatars, Query } from 'appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.eecs497.clonely',
    projectId: '66464089002c2c51e76c',
    databaseId: '664641f70001e7d653ce',
    userCollectionId: '6646421c0035fd93d7e8',
    videoCollectionId: '6646424e0002545f9257',
    storageId: '6646440400027ed3f55e'
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    // Register User

    console.log("a1");
    console.log("Received email:", email);
    console.log("Received password:", password);
    console.log("Received username:", username);

    if (!email || !password || !username) {
        console.error("Missing required parameter: email, password, or username is undefined or empty");
        throw new Error("Missing required parameter: email, password, or username");
    }
  
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        console.log("1");
        if (!newAccount) throw Error;
        console.log("2");

        const avatarUrl = avatars.getInitials(username);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl
            }
        )
        
        await account.createEmailPasswordSession(email, password);
        

        return newUser;

    } catch (error) {
        console.log("A1");
        console.log(error);
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try {
        await account.createEmailPasswordSession(email, password);
        // const session = await account.createEmailPasswordSession(email, password);
        // return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        throw new Error(error);
    }
}


