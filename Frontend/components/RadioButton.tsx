// React Component and Package
import { StyleSheet, Text, Pressable, View } from "react-native";

interface RadioButtonProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function RadioButton({ label, isSelected, onSelect }: RadioButtonProps) {
  return (
    <Pressable style={styles.radioButtonLayout} onPress={onSelect}>
      <View
        style={[styles.radioButton, isSelected && styles.radioButtonSelected]}
      />
      <Text style={styles.radioLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // RadioButton
  radioButtonLayout: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: "blue",
  },
  radioLabel: {
    fontSize: 16,
  },
});
