# Appwrite Setup Guide

This React Native habit tracker app uses Appwrite as the backend service. Follow these steps to set up your Appwrite project:

## 1. Create Appwrite Account and Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io/) and create an account
2. Create a new project
3. Note down your Project ID and Endpoint URL

## 2. Set up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your-project-id-here
EXPO_PUBLIC_APPWRITE_PLATFORM=com.yourcompany.habittracker
EXPO_PUBLIC_DB_ID=your-database-id-here
EXPO_PUBLIC_HABITS_COLLECTION_ID=your-habits-collection-id-here
EXPO_PUBLIC_COMPLETIONS_COLLECTION_ID=your-completions-collection-id-here
```

## 3. Create Database and Collections

### Create Database
1. In your Appwrite console, go to Databases
2. Create a new database
3. Note down the Database ID

### Create Collections

#### Habits Collection
Create a collection with the following attributes:
- `user_id` (String, required)
- `title` (String, required)
- `description` (String, required)
- `frequency` (String, required)
- `streak_count` (Integer, default: 0)
- `last_completed` (String, required)
- `created_at` (String, required)

#### Completions Collection
Create a collection with the following attributes:
- `habit_id` (String, required)
- `user_id` (String, required)
- `completed_at` (String, required)

## 4. Set up Authentication

1. In your Appwrite console, go to Auth
2. Enable Email/Password authentication
3. Configure your authentication settings

## 5. Set Permissions

Make sure to set appropriate permissions for your collections:
- Read/Write access for authenticated users
- Create/Update/Delete permissions for the respective collections

## 6. Run the App

1. Install dependencies: `npm install`
2. Start the development server: `npm start`
3. Scan the QR code with Expo Go app on your device

## Troubleshooting

- Make sure all environment variables are correctly set
- Verify that your Appwrite project is active
- Check that all collections have the correct attributes
- Ensure authentication is properly configured
