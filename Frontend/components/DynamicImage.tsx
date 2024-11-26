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
  Image: {},
});
