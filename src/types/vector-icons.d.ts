declare module "react-native-vector-icons/MaterialCommunityIcons" {
  import { ComponentType } from "react";
  import { StyleProp, TextStyle } from "react-native";

  export interface MaterialCommunityIconProps {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
  }

  const Icon: ComponentType<MaterialCommunityIconProps>;
  export default Icon;
}
