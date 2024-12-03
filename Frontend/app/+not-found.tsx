/* eslint-disable react/react-in-jsx-scope */
import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "糟糕!" }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">該頁面不存在.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">回主頁</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
