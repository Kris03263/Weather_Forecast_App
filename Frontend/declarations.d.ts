declare module "*.svg" {
  import { SvgProps } from "react-native-svg";

  const content: React.FC<SvgProps>;

  export default content;
}

declare module "react-native-modal-dropdown" {
  import { Component } from "react";
  import { StyleProp, ViewStyle, TextStyle } from "react-native";

  interface ModalDropdownProps {
    options: string[] | number[];
    defaultValue?: string;
    onSelect?: (index: string, value: string) => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    dropdownStyle?: StyleProp<ViewStyle>;
    dropdownTextStyle?: StyleProp<TextStyle>;
    dropdownTextHighlightStyle?: StyleProp<TextStyle>;
  }

  export default class ModalDropdown extends Component<ModalDropdownProps> {}
}
