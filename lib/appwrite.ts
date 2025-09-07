import { Account, Client, Databases } from "react-native-appwrite";

// Environment variables check
const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const platform = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM;

if (!endpoint || !projectId || !platform) {
  console.error('Missing Appwrite environment variables');
}

export const client = new Client()
  .setEndpoint(endpoint || '')
  .setProject(projectId || '')
  .setPlatform(platform || '');

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID || '';
export const HABITS_COLLECTION_ID = process.env.EXPO_PUBLIC_HABITS_COLLECTION_ID || '';
export const COMPLETIONS_COLLECTION_ID = process.env.EXPO_PUBLIC_COMPLETIONS_COLLECTION_ID || '';

export interface RealtimeResponse {
  events: string[];
  payload: any;
}