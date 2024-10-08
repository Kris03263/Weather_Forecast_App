import { StyleSheet, View } from "react-native";

import wetIcon from "@/assets/svgs/wet-icon.svg";
import RainRateIcon from "@/assets/svgs/rainRate-icon.svg";
import WindSpeedIcon from "@/assets/svgs/windSpeed-icon.svg";
import WindDirectionIcon from "@/assets/svgs/windDirection-icon.svg";
import DressingIcon from "@/assets/svgs/dressing-icon.svg";
import HealthIcon from "@/assets/svgs/health-icon.svg";
import SportIcon from "@/assets/svgs/sport-icon.svg";
import TransportationIcon from "@/assets/svgs/transportation-icon.svg";
import ActivityIcon from "@/assets/svgs/activity-icon.svg";
import PlusIcon from "@/assets/svgs/plus-icon.svg";
import WeatherIcon from "@/assets/svgs/weather-icon.svg";
import UserAccountIcon from "@/assets/svgs/userAccount-icon.svg";
import UserPasswordIcon from "@/assets/svgs/userPassword-icon.svg";

interface SvgProps {
  style?: object;
  name?: string;
}

export function SvgImage({ style = {}, name = "" }: SvgProps) {
  const Icon = {
    wet: wetIcon,
    rainRate: RainRateIcon,
    windSpeed: WindSpeedIcon,
    windDirection: WindDirectionIcon,
    dressing: DressingIcon,
    health: HealthIcon,
    sport: SportIcon,
    transportation: TransportationIcon,
    activity: ActivityIcon,
    plus: PlusIcon,
    weather: WeatherIcon,
    userAccount: UserAccountIcon,
    userPassword: UserPasswordIcon,
  }[name];

  return <View>{Icon ? <Icon style={style} /> : null}</View>;
}
