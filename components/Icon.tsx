import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const IconSet: any = {
  ion: Ionicons,
  feather: Feather,
  ant: AntDesign,
  material: MaterialIcons,
  materialCom: MaterialCommunityIcons,
  fontAwesome: FontAwesome5
};

export function Icon({ set = 'ion', name = '', size = 24, color = 'black' }) {
  const IconComponent = IconSet[set];
  return <IconComponent name={name} size={size} color={color} />;
}
