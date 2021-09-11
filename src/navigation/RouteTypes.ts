import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type PublicStackParamList = {
  Welcome: undefined;
};

export type PrivateStackParamList = {
  AddFoodItem: {journalEntryId: string; mealIndex: number};
  AddMeal: {date: string};
  DateSelector: undefined;
  Journal: {date: string};
  UserInfo: undefined;
  Profile: undefined;
};

// These route names are defined in navigation/Constants

export type WelcomeScreenNavigationProp = StackNavigationProp<
  PublicStackParamList,
  'Welcome'
>;

export type DateSelectorScreenNavigationProp = StackNavigationProp<
  PrivateStackParamList,
  'DateSelector'
>;

export type JournalScreenNavigationProp = StackNavigationProp<
  PrivateStackParamList,
  'Journal'
>;
export type JournalScreenRouteProp = RouteProp<
  PrivateStackParamList,
  'Journal'
>;

export type UserInfoScreenNavigationProp = StackNavigationProp<
  PrivateStackParamList,
  'UserInfo'
>;

export type ProfileScreenNavigationProp = StackNavigationProp<
  PrivateStackParamList,
  'Profile'
>;

export type AddMealModalNavigationProp = StackNavigationProp<
  PrivateStackParamList,
  'AddMeal'
>;

export type AddMealModalRouteProp = RouteProp<PrivateStackParamList, 'AddMeal'>;

export type AddFoodItemModalNavigationProp = StackNavigationProp<
  PrivateStackParamList,
  'AddFoodItem'
>;

export type AddFoodItemModalRouteProp = RouteProp<
  PrivateStackParamList,
  'AddFoodItem'
>;
