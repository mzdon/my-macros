import {NavigatorScreenParams, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type PublicStackParamList = {
  Welcome: undefined;
};

export type PrivateStackParamList = {
  AddMeal: {
    date: string;
    mealIndex?: number;
  };
  DateSelector: undefined;
  FoodCrud: NavigatorScreenParams<FoodCrudStackParamList> & {
    journalEntryId?: string;
    mealIndex?: number;
    consumedItemIndex?: number;
    foodItemId?: string;
    foodGroupId?: string;
    newFoodGroup?: boolean;
  };
  Journal: {
    date: string;
  };
  Profile: undefined;
  UserInfo: undefined;
};

export type FoodCrudStackParamList = {
  LookupOrAdd: undefined;
  FoodItemDescription: undefined;
  FoodItemMacros: undefined;
  FoodItemGroup: undefined;
  ItemConsumed: undefined;
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

export type FoodCrudModalNavigationProp = StackNavigationProp<
  PrivateStackParamList,
  'FoodCrud'
>;

export type FoodCrudModalRouteProp = RouteProp<
  PrivateStackParamList,
  'FoodCrud'
>;

export type LookupOrAddNavigationProp = StackNavigationProp<
  FoodCrudStackParamList,
  'LookupOrAdd'
>;

export type LookupOrAddRouteProp = RouteProp<
  FoodCrudStackParamList,
  'LookupOrAdd'
>;

export type FoodItemDescriptionNavigationProp = StackNavigationProp<
  FoodCrudStackParamList,
  'FoodItemDescription'
>;

export type FoodItemDescriptionRouteProp = RouteProp<
  FoodCrudStackParamList,
  'FoodItemDescription'
>;

export type FoodItemMacrosNavigationProp = StackNavigationProp<
  FoodCrudStackParamList,
  'FoodItemMacros'
>;

export type FoodItemMacrosRouteProp = RouteProp<
  FoodCrudStackParamList,
  'FoodItemMacros'
>;

export type FoodItemGroupNavigationProp = StackNavigationProp<
  FoodCrudStackParamList,
  'FoodItemGroup'
>;

export type FoodItemGroupRouteProp = RouteProp<
  FoodCrudStackParamList,
  'FoodItemGroup'
>;

export type ItemConsumedNavigationProp = StackNavigationProp<
  FoodCrudStackParamList,
  'ItemConsumed'
>;

export type ItemConsumedRouteProp = RouteProp<
  FoodCrudStackParamList,
  'ItemConsumed'
>;
