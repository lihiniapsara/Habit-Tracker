import {
    client,
    COMPLETIONS_COLLECTION_ID,
    DATABASE_ID,
    databases,
    HABITS_COLLECTION_ID,
    RealtimeResponse,
} from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit, HabitCompletion } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Text } from "react-native-paper";

export default function StreaksScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
      const habitsSubscription = client.subscribe(
        habitsChannel,
        (response: RealtimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            fetchHabits();
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            fetchHabits();
          }
        }
      );

      const completionsChannel = `databases.${DATABASE_ID}.collections.${COMPLETIONS_COLLECTION_ID}.documents`;
      const completionsSubscription = client.subscribe(
        completionsChannel,
        (response: RealtimeResponse) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            fetchCompletions();
          }
        }
      );

      fetchHabits();
      fetchCompletions();

      return () => {
        habitsSubscription();
        completionsSubscription();
      };
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      setHabits(response.documents as Habit[]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompletions = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COMPLETIONS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      const completions = response.documents as HabitCompletion[];
      setCompletedHabits(completions);
    } catch (error) {
      console.error(error);
    }
  };

  interface StreakData {
    streak: number;
    bestStreak: number;
    total: number;
  }

  const getStreakData = (habitId: string): StreakData => {
    const habitCompletions = completedHabits
      ?.filter((c) => c.habit_id === habitId)
      .sort(
        (a, b) =>
          new Date(a.completed_at).getTime() -
          new Date(b.completed_at).getTime()
      );

    if (habitCompletions?.length === 0) {
      return { streak: 0, bestStreak: 0, total: 0 };
    }

    // build streak data
    let streak = 0;
    let bestStreak = 0;
    let total = habitCompletions.length;

    let lastDate: Date | null = null;
    let currentStreak = 0;

    habitCompletions?.forEach((c) => {
      const date = new Date(c.completed_at);
      if (lastDate) {
        const diff =
          (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diff <= 1.5) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      if (currentStreak > bestStreak) bestStreak = currentStreak;
      streak = currentStreak;
      lastDate = date;
    });

    return { streak, bestStreak, total };
  };

  const habitStreaks = habits.map((habit) => {
    const { streak, bestStreak, total } = getStreakData(habit.$id);
    return { habit, bestStreak, streak, total };
  });

  const rankedHabits = habitStreaks.sort((a, b) => b.bestStreak - a.bestStreak);

  const badgeStyles = [styles.badge1, styles.badge2, styles.badge3];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} variant="headlineMedium">
          Habit Streaks
        </Text>
        <Text style={styles.subtitle}>
          Track your progress and achievements
        </Text>
      </View>

      {rankedHabits.length > 0 && (
        <View style={styles.rankingContainer}>
          <View style={styles.rankingHeader}>
            <MaterialCommunityIcons 
              name="trophy" 
              size={24} 
              color="#f59e0b" 
            />
            <Text style={styles.rankingTitle}>Top Streaks</Text>
          </View>
          {rankedHabits.slice(0, 3).map((item, key) => (
            <View key={key} style={styles.rankingRow}>
              <View style={[styles.rankingBadge, badgeStyles[key]]}>
                <Text style={styles.rankingBadgeText}>{key + 1}</Text>
              </View>
              <View style={styles.rankingContent}>
                <Text style={styles.rankingHabit}>{item.habit.title}</Text>
                <Text style={styles.rankingDescription}>{item.habit.description}</Text>
              </View>
              <View style={styles.rankingStreakContainer}>
                <Text style={styles.rankingStreak}>{item.bestStreak}</Text>
                <Text style={styles.rankingStreakLabel}>days</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons 
            name="chart-line" 
            size={64} 
            color="#d1d5db" 
          />
          <Text style={styles.emptyStateTitle}>
            No habits yet
          </Text>
          <Text style={styles.emptyStateText}>
            Add your first habit to start tracking streaks!
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {rankedHabits.map(({ habit, streak, bestStreak, total }, key) => (
            <Card
              key={key}
              style={[styles.card, key === 0 && styles.firstCard]}
              elevation={0}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text variant="titleMedium" style={styles.habitTitle}>
                    {habit.title}
                  </Text>
                  {key === 0 && (
                    <MaterialCommunityIcons 
                      name="crown" 
                      size={20} 
                      color="#f59e0b" 
                    />
                  )}
                </View>
                <Text style={styles.habitDescription}>
                  {habit.description}
                </Text>
                <View style={styles.statsRow}>
                  <View style={styles.statBadge}>
                    <MaterialCommunityIcons 
                      name="fire" 
                      size={16} 
                      color="#f59e0b" 
                    />
                    <Text style={styles.statBadgeText}>{streak}</Text>
                    <Text style={styles.statLabel}>Current</Text>
                  </View>
                  <View style={styles.statBadgeGold}>
                    <MaterialCommunityIcons 
                      name="trophy" 
                      size={16} 
                      color="#f59e0b" 
                    />
                    <Text style={styles.statBadgeText}>{bestStreak}</Text>
                    <Text style={styles.statLabel}>Best</Text>
                  </View>
                  <View style={styles.statBadgeGreen}>
                    <MaterialCommunityIcons 
                      name="check-circle" 
                      size={16} 
                      color="#10b981" 
                    />
                    <Text style={styles.statBadgeText}>{total}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  firstCard: {
    borderWidth: 2,
    borderColor: "#f59e0b",
    backgroundColor: "#fffbeb",
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  habitTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: "#1f2937",
    flex: 1,
  },
  habitDescription: {
    color: "#6b7280",
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statBadge: {
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 70,
    flex: 1,
    marginHorizontal: 4,
  },
  statBadgeGold: {
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 70,
    flex: 1,
    marginHorizontal: 4,
  },
  statBadgeGreen: {
    backgroundColor: "#d1fae5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 70,
    flex: 1,
    marginHorizontal: 4,
  },
  statBadgeText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1f2937",
    marginTop: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
    fontWeight: "600",
  },
  rankingContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  rankingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  rankingTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: "#1f2937",
    marginLeft: 8,
  },
  rankingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  rankingBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#e5e7eb",
  },
  badge1: { backgroundColor: "#f59e0b" }, // gold
  badge2: { backgroundColor: "#6b7280" }, // silver
  badge3: { backgroundColor: "#d97706" }, // bronze
  rankingBadgeText: {
    fontWeight: "700",
    color: "#ffffff",
    fontSize: 14,
  },
  rankingContent: {
    flex: 1,
  },
  rankingHabit: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "600",
    marginBottom: 2,
  },
  rankingDescription: {
    fontSize: 13,
    color: "#6b7280",
  },
  rankingStreakContainer: {
    alignItems: "center",
  },
  rankingStreak: {
    fontSize: 18,
    color: "#1f2937",
    fontWeight: "700",
  },
  rankingStreakLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
});
