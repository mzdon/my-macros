import {useNavigation} from '@react-navigation/native';

export const useParentNavigation = () => {
  const navigation = useNavigation();
  const stackNavigation = navigation.getParent();
  return stackNavigation;
};
