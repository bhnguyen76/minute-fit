import {
  GreetingHeader,
  StartNowButton,
  NextWorkoutCard,
  TodayProgress,
  QuickPicks,
  RecentWorkouts,
  type Workout,
} from "@/components/home";
import TrackingSection, {
  type TrackingItem,
} from "@/components/tracking/tracking-section";
import { useAuth } from "@/contexts/auth";
import { useHealthData } from "@/hooks/use-health-data";
import { getAdaptiveStepGoal, getWaterGoalOz } from "@/services/tracking-goals";
import { ScrollView, useColorScheme } from "react-native";
import { useEffect, useMemo, useState, useCallback } from "react";
import { createWaterLog, getTodayWaterSummary } from "@/services/water";
import tw from "twrnc";

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const { user } = useAuth();

  const [trackingLayout, setTrackingLayout] = useState<"list" | "grid">("list");

  const {
    steps,
    activeEnergy,
    weeklyStepHistory,
    isAvailable,
    isAuthorized,
    requestPermission,
  } = useHealthData();

  const userName = user?.first_name ?? user?.username ?? "User";

  // TODO: Replace with real data once workout models exist in the backend
  const streakDays = 0;
  const workoutsDone = 0;
  const workoutsGoal = 5;
  const minutesDone = 0;
  const minutesGoal = 30;

  const [waterOz, setWaterOz] = useState(24);

  const parsedWeight = user?.weight != null ? Number(user.weight) : null;
  const userWeightLb = Number.isFinite(parsedWeight) ? parsedWeight : null;

  const caloriesGoal = 500;

  const stepGoal = useMemo(
    () => getAdaptiveStepGoal(weeklyStepHistory),
    [weeklyStepHistory]
  );

  const waterGoal = useMemo(
    () => getWaterGoalOz(userWeightLb),
    [userWeightLb]
  );

  const recentWorkouts: Workout[] = [
    { name: "Mobility", duration: "2 min" },
    { name: "Core", duration: "1 min" },
    { name: "Walk", duration: "2 min", category: "Cardio" },
  ];

  const handleStartNow = () => {
    console.log("Start quick workout");
    // TODO: Navigate to workout screen or start quick workout flow
  };

  const handleStartWorkout = () => {
    console.log("Start next workout");
    // TODO: Navigate to workout detail/start screen
  };

  const handleSwapWorkout = () => {
    console.log("Swap workout");
    // TODO: Show workout picker or swap to different workout
  };

  const handleQuickPick = (type: "reset" | "stretch" | "cardio" | "strength") => {
    console.log(`Quick pick: ${type}`);
    // TODO: Start corresponding quick workout
  };

  const trackingItems: TrackingItem[] = useMemo(
    () => [
      {
        id: "steps",
        title: "Steps",
        value: steps,
        goal: stepGoal,
        unit: "",
        subtitle: !isAvailable
          ? "Health data not available on this device"
          : isAuthorized
            ? "Synced from Apple Health"
            : "Connect Apple Health to sync your steps",
        buttonLabel: isAvailable && !isAuthorized ? "Connect Health" : undefined,
        onPressButton:
          isAvailable && !isAuthorized ? requestPermission : undefined,
        ringColor: "#22C55E",
      },
      {
        id: "water",
        title: "Water",
        value: waterOz,
        goal: waterGoal,
        unit: "oz",
        subtitle: "Track your water intake manually",
        buttonLabel: "Add 8 oz",
        onPressButton: () => setWaterOz((prev) => prev + 8),
        ringColor: "#3B82F6",
      },
      {
        id: "calories",
        title: "Calories Burned",
        value: activeEnergy,
        goal: caloriesGoal,
        unit: "cal",
        subtitle: "Calories burned through activity today",
        ringColor: "#F97316",
      },
    ],
    [
      steps,
      activeEnergy,
      waterOz,
      stepGoal,
      waterGoal,
      isAvailable,
      isAuthorized,
      requestPermission,
      caloriesGoal,
    ],
  );

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: isDark ? "#111827" : "#FFFFFF" }]}
      contentContainerStyle={tw`p-4 pt-10`}
    >
      {/* Greeting Header */}
      <GreetingHeader userName={userName} streakDays={streakDays} />

      {/* Start Now Button */}
      <StartNowButton onPress={handleStartNow} />

      {/* Next Workout Card */}
      <NextWorkoutCard
        title="Push Ups"
        duration="1 min"
        category="Chest"
        difficulty="Medium"
        equipment="No equipment"
        onStart={handleStartWorkout}
        onSwap={handleSwapWorkout}
      />

      {/* Today's Progress */}
      <TodayProgress
        workoutsDone={workoutsDone}
        workoutsGoal={workoutsGoal}
        minutesDone={minutesDone}
        minutesGoal={minutesGoal}
        showStreakRing={false}
      />

      {/* Daily Tracking */}
      <TrackingSection
        title="Daily Tracking"
        items={trackingItems}
        layout={trackingLayout}
      />

      <QuickPicks onPress={handleQuickPick} />

      {/* Recent Workouts */}
      <RecentWorkouts workouts={recentWorkouts} />
    </ScrollView>
  );
}
