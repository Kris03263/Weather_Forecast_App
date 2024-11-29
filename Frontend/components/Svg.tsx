// React Component and Package
import { View } from "react-native";
// Svg paths
import WetIcon from "@/assets/svgs/wet-icon.svg";
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
import ListIcon from "@/assets/svgs/list-icon.svg";
import CloseIcon from "@/assets/svgs/close-icon.svg";
import EarthQuakeIcon from "@/assets/svgs/earthquake-icon.svg";
import DownIcon from "@/assets/svgs/down-icon.svg";
import AqiIcon from "@/assets/svgs/aqi-icon.svg";
import TempIcon from "@/assets/svgs/temp-icon.svg";
import Pm2_5Icon from "@/assets/svgs/pm2_5-icon.svg";
import ShareIcon from "@/assets/svgs/share.svg";
import TyphoonIcon from "@/assets/svgs/typhoon-icon.svg";

interface SvgProps {
  style?: object;
  name?: string;
}

export function SvgImage({ style = {}, name = "" }: SvgProps) {
  const Icon = {
    wet: WetIcon,
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
    list: ListIcon,
    close: CloseIcon,
    earthquake: EarthQuakeIcon,
    down: DownIcon,
    aqi: AqiIcon,
    temp: TempIcon,
    pm2_5: Pm2_5Icon,
    share: ShareIcon,
    typhoon: TyphoonIcon,
  }[name];

  return (
    <View style={style}>
      {Icon ? <Icon style={style} width="100%" height="100%" /> : null}
    </View>
  );
}
