import React from "react";
import { Tabs } from "expo-router";
import { useTheme } from "../../theme/theme.context";
import { LayoutDashboard, CheckSquare, User } from "lucide-react-native";

export default function TabsLayout() {
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: isDark ? "#64748b" : "#94a3b8",
        tabBarStyle: {
          backgroundColor: isDark ? "#090d16" : "#ffffff",
          borderTopColor: isDark ? "#1e293b" : "#e2e8f0",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Overview",
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => <CheckSquare size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size || 22} color={color} />,
        }}
      />
    </Tabs>
  );
}
