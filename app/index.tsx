import { StyleSheet, Text, View, Platform } from "react-native";

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Hello World</Text>
        <Text style={styles.subtitle}>This is the first page of your app.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    // margin auto works only on web → add platform check
    ...(Platform.OS === "web" ? { marginHorizontal: "auto" } : {}),
  },
  title: {
    fontSize: 32, // smaller for mobile
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#38434D",
    textAlign: "center",
    marginTop: 8,
  },
});
