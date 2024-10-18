import { StyleSheet, Image } from "react-native";

const images = require.context("../assets/images", true, /\.(png|jpe?g|svg)$/);

interface DynamicImageProps {
  style: object;
  path: string;
}

// example usage `../assets/images/day/01.png`

export const DynamicImage = ({ style, path }: DynamicImageProps) => {
  const imagePath = images(`./${path}`);
  return (
    <Image
      resizeMode="contain"
      style={[styles.Image, style]}
      source={imagePath}
    />
  );
};

const styles = StyleSheet.create({
  Image: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});
