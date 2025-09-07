import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"];
type Frequency = (typeof FREQUENCIES)[number];

export default function AddHabitScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [error, setError] = useState<string>("");
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async () => {
    console.log('handleSubmit called:', { title, description, frequency, user }); // Debug log
    if (!user) {
      setError("You must be signed in to create a habit");
      console.log('Error set:', "You must be signed in to create a habit");
      return;
    }

    try {
      await databases.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title,
          description,
          frequency,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );
      console.log('Navigating back'); // Debug log
      router.back();
    } catch (error) {
      console.error('Habit Creation Error:', error); // Debug log
      if (error instanceof Error) {
        setError(error.message);
        console.log('Error set:', error.message);
        return;
      }
      setError("There was an error creating the habit");
      console.log('Error set:', "There was an error creating the habit");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Add New Habit
        </Text>
        <Text style={styles.subtitle}>
          Create a habit to track your progress
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Habit Title"
          mode="outlined"
          onChangeText={(text) => {
            console.log('Title input:', text); // Debug log
            setTitle(text);
          }}
          style={styles.input}
          placeholder="e.g., Drink 8 glasses of water"
          outlineColor="#e5e7eb"
          activeOutlineColor="#6366f1"
        />
        <TextInput
          label="Description"
          mode="outlined"
          onChangeText={(text) => {
            console.log('Description input:', text); // Debug log
            setDescription(text);
          }}
          style={styles.input}
          placeholder="Describe your habit..."
          multiline
          numberOfLines={3}
          outlineColor="#e5e7eb"
          activeOutlineColor="#6366f1"
        />
        
        <View style={styles.frequencyContainer}>
          <Text style={styles.frequencyLabel}>Frequency</Text>
          <SegmentedButtons
            value={frequency}
            onValueChange={(value) => {
              console.log('Frequency selected:', value); // Debug log
              setFrequency(value as Frequency);
            }}
            buttons={FREQUENCIES.map((freq) => ({
              value: freq,
              label: freq.charAt(0).toUpperCase() + freq.slice(1),
            }))}
            style={styles.segmentedButtons}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!title} // Simplified disabled condition
          style={styles.submitButton}
        >
          Create Habit
        </Button>
        
        {error && (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons 
              name="alert-circle" 
              size={20} 
              color={theme.colors.error} 
            />
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20, // Added padding
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: "#ffffff",
  },
  title: {
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  input: {
    marginBottom: 20,
    // Removed backgroundColor to avoid rendering issues
  },
  frequencyContainer: {
    marginBottom: 32,
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  segmentedButtons: {
    // Removed backgroundColor to avoid rendering issues
  },
  submitButton: {
    borderRadius: 12,
    marginBottom: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
    zIndex: 1, // Added zIndex to avoid overlap
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
});