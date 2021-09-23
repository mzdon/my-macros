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
  Drawer: undefined;
  FoodCrud: NavigatorScreenParams<FoodCrudStackParamList> & {
    journalEntryId?: string;
    mealIndex?: number;
    consumedItemIndex?: number;
    foodItemId?: string;
    foodGroupId?: string;
    newFoodGroup?: boolean;
  };
  UserInfo: undefined;
};

export type FoodCrudStackParamList = {
  LookupOrAdd: undefined;
  FoodItemDescription: undefined;
  FoodItemMacros: undefined;
  FoodItemGroup: undefined;
  ItemConsumed: undefined;
};

export type DrawerParamList = {
  Journal: {
    date: string;
  };
  FoodEditor: undefined;
  DateSelector: {
    currentDate: string | undefined;
  };
  Profile: undefined;
};

export type UserInfoStackParamList = {
  UserInfoStep1: undefined;
  UserInfoStep2: undefined;
};

// These route names are defined in navigation/Constants

export type WelcomeScreenNavigationProp = StackNavigationProp<
  PublicStackParamList,
  'Welcome'
>;

export type DateSelectorScreenNavigationProp = StackNavigationProp<
  DrawerParamList,
  'DateSelector'
>;

export type DateSelectorScreenRouteProp = RouteProp<
  DrawerParamList,
  'DateSelector'
>;

export type JournalScreenNavigationProp = StackNavigationProp<
  DrawerParamList,
  'Journal'
>;
export type JournalScreenRouteProp = RouteProp<DrawerParamList, 'Journal'>;

export type UserInfoScreenNavigationProp = StackNavigationProp<
  PrivateStackParamList,
  'UserInfo'
>;

export type ProfileScreenNavigationProp = StackNavigationProp<
  DrawerParamList,
  'Profile'
>;

export type ProfileScreenRouteProp = RouteProp<DrawerParamList, 'Profile'>;

export type AddMealScreenNavigationProp = StackNavigationProp<
  PrivateStackParamList,
  'AddMeal'
>;

export type AddMealScreenRouteProp = RouteProp<
  PrivateStackParamList,
  'AddMeal'
>;

export type FoodCrudScreenNavigationProp = StackNavigationProp<
  PrivateStackParamList,
  'FoodCrud'
>;

export type FoodCrudScreenRouteProp = RouteProp<
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

export type DrawerNavigationProp = StackNavigationProp<
  PrivateStackParamList,
  'Drawer'
>;

export type DrawerRouteProp = RouteProp<PrivateStackParamList, 'Drawer'>;

export type UserInfoStep1NavigationProp = StackNavigationProp<
  UserInfoStackParamList,
  'UserInfoStep1'
>;

export type UserInfoStep1RouteProp = RouteProp<
  UserInfoStackParamList,
  'UserInfoStep1'
>;

export type UserInfoStep2NavigationProp = StackNavigationProp<
  UserInfoStackParamList,
  'UserInfoStep2'
>;

export type UserInfoStep2RouteProp = RouteProp<
  UserInfoStackParamList,
  'UserInfoStep2'
>;
