import { StyleSheet, View } from "react-native";

import HumidityIcon from "@/assets/svgs/humidity-icon.svg";
import RainRateIcon from "@/assets/svgs/rain-rate-icon.svg";
import WindSpeedIcon from "@/assets/svgs/wind-speed-icon.svg";
import WindDirectionIcon from "@/assets/svgs/wind-direction-icon.svg";
import DressingIcon from "@/assets/svgs/dressing-icon.svg";
import HealthIcon from "@/assets/svgs/health-icon.svg";
import SportIcon from "@/assets/svgs/sport-icon.svg";
import TransportationIcon from "@/assets/svgs/transportation-icon.svg";
import ActivityIcon from "@/assets/svgs/activity-icon.svg";
import PlusIcon from "@/assets/svgs/plus-icon.svg";
import WeatherIcon from "@/assets/svgs/weather-icon.svg";

interface SvgProps {
  style?: object;
  name?: string;
}

export function SvgImage({ style = {}, name = "" }: SvgProps) {
  const Icon = {
    humidity: HumidityIcon,
    "rain-rate": RainRateIcon,
    "wind-speed": WindSpeedIcon,
    "wind-direction": WindDirectionIcon,
    dressing: DressingIcon,
    health: HealthIcon,
    sport: SportIcon,
    transportation: TransportationIcon,
    activity: ActivityIcon,
    plus: PlusIcon,
    weather: WeatherIcon,
  }[name];

  return <View>{Icon ? <Icon style={style} /> : null}</View>;
}
