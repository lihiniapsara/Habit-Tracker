# 🚀 Complete Setup Guide for Habit Tracker

## Step 1: Appwrite Backend Setup

### 1.1 Create Appwrite Account
1. Go to [https://cloud.appwrite.io/](https://cloud.appwrite.io/)
2. Sign up for a free account
3. Create a new project

### 1.2 Get Your Project Details
After creating your project, you'll need:
- **Project ID**: Found in your project dashboard
- **Endpoint**: `https://cloud.appwrite.io/v1` (default)

### 1.3 Create Database
1. Go to **Databases** in your Appwrite console
2. Click **Create Database**
3. Name it: `HabitTracker`
4. Note down the **Database ID**

### 1.4 Create Collections

#### Habits Collection
1. In your database, click **Create Collection**
2. Name: `habits`
3. Add these attributes:
   - `user_id` (String, required)
   - `title` (String, required)
   - `description` (String, required)
   - `frequency` (String, required)
   - `streak_count` (Integer, default: 0)
   - `last_completed` (String, required)
   - `created_at` (String, required)

#### Completions Collection
1. Create another collection named `completions`
2. Add these attributes:
   - `habit_id` (String, required)
   - `user_id` (String, required)
   - `completed_at` (String, required)

### 1.5 Set Up Authentication
1. Go to **Auth** in your Appwrite console
2. Click **Settings**
3. Enable **Email/Password** authentication
4. Save settings

### 1.6 Set Permissions
For both collections, set permissions:
1. Go to **Settings** → **Permissions**
2. Add rule: **Any** → **Users** → **Read/Write**
3. Save permissions

## Step 2: Environment Configuration

Create a `.env` file in your project root with:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your-actual-project-id
EXPO_PUBLIC_APPWRITE_PLATFORM=com.habittracker.app
EXPO_PUBLIC_DB_ID=your-actual-database-id
EXPO_PUBLIC_HABITS_COLLECTION_ID=your-actual-habits-collection-id
EXPO_PUBLIC_COMPLETIONS_COLLECTION_ID=your-actual-completions-collection-id
```

## Step 3: Test the App

1. **Start the development server**: `npm start`
2. **Scan QR code** with Expo Go app
3. **Test features**:
   - Sign up/Sign in
   - Create habits
   - Complete habits (swipe right)
   - Delete habits (swipe left)
   - View streaks

## 🎯 All Features Available

✅ **Authentication**: Sign up, sign in, sign out
✅ **Habit Management**: Create, edit, delete habits
✅ **Habit Completion**: Swipe to complete habits
✅ **Streak Tracking**: Visual progress tracking
✅ **Real-time Updates**: Live synchronization
✅ **Modern UI**: Beautiful, responsive design
✅ **Swipe Gestures**: Intuitive interactions
✅ **Empty States**: Helpful user guidance
✅ **Progress Analytics**: Detailed statistics

## 🔧 Troubleshooting

### Common Issues:
1. **"User not authenticated"**: Check Appwrite auth settings
2. **"Collection not found"**: Verify collection IDs in .env
3. **"Permission denied"**: Check collection permissions
4. **App crashes**: Ensure all environment variables are set

### Need Help?
- Check the console for error messages
- Verify all IDs in your .env file
- Ensure Appwrite project is active
- Check internet connection

## 🎨 UI Features

The app includes a modern, beautiful design with:
- Clean card-based layout
- Smooth animations
- Intuitive swipe gestures
- Beautiful color scheme
- Responsive design
- Empty state illustrations
- Progress indicators
- Streak badges

---

**Ready to build better habits! 🎯✨**
