import { StyleSheet, Text, Pressable, View } from "react-native";

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const RadioButton = ({ label, selected, onPress }: RadioButtonProps) => {
  return (
    <Pressable style={styles.radioButtonLayout} onPress={onPress}>
      <View
        style={[styles.radioButton, selected && styles.radioButtonSelected]}
      />
      <Text style={styles.radioLabel}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
