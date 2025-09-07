import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");

  const theme = useTheme();
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    console.log('handleAuth called:', { email, password, isSignUp }); // Debug log
    if (!email || !password) {
      setError("Please fill in all fields.");
      console.log('Error set:', "Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Passwords must be at least 6 characters long.");
      console.log('Error set:', "Passwords must be at least 6 characters long.");
      return;
    }

    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password);
      if (error) {
        setError(error);
        console.log('SignUp error:', error);
        return;
      }
    } else {
      const error = await signIn(email, password);
      if (error) {
        setError(error === "Invalid credentials" ? "Incorrect email or password" : error);
        console.log('SignIn error:', error);
        return;
      }
      console.log('Navigating to /');
      router.replace("/");
    }
  };

  const handleSwitchMode = () => {
    console.log('Switching mode:', !isSignUp); // Debug log
    setIsSignUp((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name="target" 
              size={48} 
              color="#6366f1" 
            />
          </View>
          <Text style={styles.title} variant="headlineMedium">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </Text>
          <Text style={styles.subtitle}>
            {isSignUp 
              ? "Start building better habits today" 
              : "Continue your habit journey"
            }
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="example@gmail.com"
            mode="outlined"
            style={styles.input}
            onChangeText={(text) => {
              console.log('Email input:', text); // Debug log
              setEmail(text);
            }}
            outlineColor="#e5e7eb"
            activeOutlineColor="#6366f1"
          />
          <TextInput
            label="Password"
            autoCapitalize="none"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            onChangeText={(text) => {
              console.log('Password input:', text); // Debug log
              setPassword(text);
            }}
            outlineColor="#e5e7eb"
            activeOutlineColor="#6366f1"
          />
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
          <Button 
            mode="contained" 
            style={styles.button} 
            onPress={handleAuth}
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
          <Button
            mode="text"
            onPress={handleSwitchMode}
            style={styles.switchModeButton}
            textColor="#6b7280"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20, // Added padding
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "700",
    color: "#1f2937",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  form: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    marginBottom: 20,
    // Removed backgroundColor to avoid rendering issues
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
  switchModeButton: {
    marginTop: 16,
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