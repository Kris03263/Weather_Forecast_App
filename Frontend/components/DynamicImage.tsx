// React Component and Package
import { StyleSheet, Image } from "react-native";

interface DynamicImageProps {
  style: object;
  path: string;
}

export const DynamicImage = ({ style, path }: DynamicImageProps) => {
  const images = require.context(
    "../assets/images",
    true,
    /\.(png|jpe?g|svg)$/
  );
  const imagePath = images(`./${path}`); // example usage `../assets/images/day/01.png`

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
