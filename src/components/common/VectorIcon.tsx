import * as React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

interface VectorIconProps {
  type:
    | 'AntDesign'
    | 'Entypo'
    | 'EvilIcons'
    | 'Feather'
    | 'FontAwesome'
    | 'FontAwesome5'
    | 'Fontisto'
    | 'Foundation'
    | 'Ionicons'
    | 'MaterialCommunityIcons'
    | 'MaterialIcons'
    | 'Octicons'
    | 'SimpleLineIcons'
    | 'Zocial';
  name: string;
  size?: number;
  color?: string;
  onPress?: () => void;
  style?: any;
}

export const VectorIcon: React.FC<VectorIconProps> = props => {
  const {type, onPress, ...restProps} = props;

  if (type === 'AntDesign') {
    return <AntDesign {...restProps} onPress={onPress} />;
  } else if (type === 'Entypo') {
    return <Entypo {...restProps} onPress={onPress} />;
  } else if (type === 'EvilIcons') {
    return <EvilIcons {...restProps} onPress={onPress} />;
  } else if (type === 'Feather') {
    return <Feather {...restProps} onPress={onPress} />;
  } else if (type === 'FontAwesome') {
    return <FontAwesome {...restProps} onPress={onPress} />;
  } else if (type === 'FontAwesome5') {
    return <FontAwesome5 {...restProps} onPress={onPress} />;
  } else if (type === 'Fontisto') {
    return <Fontisto {...restProps} onPress={onPress} />;
  } else if (type === 'Foundation') {
    return <Foundation {...restProps} onPress={onPress} />;
  } else if (type === 'Ionicons') {
    return <Ionicons {...restProps} onPress={onPress} />;
  } else if (type === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons {...restProps} onPress={onPress} />;
  } else if (type === 'MaterialIcons') {
    return <MaterialIcons {...restProps} onPress={onPress} />;
  } else if (type === 'Octicons') {
    return <Octicons {...restProps} onPress={onPress} />;
  } else if (type === 'SimpleLineIcons') {
    return <SimpleLineIcons {...restProps} onPress={onPress} />;
  } else if (type === 'Zocial') {
    return <Zocial {...restProps} onPress={onPress} />;
  }

  return null;
};
