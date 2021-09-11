import React from 'react';

export interface FoodItem {
  id: string;
  description: string;
  calories: number;
  carb: number;
  protein: number;
  fat: number;
  sugar: number | undefined;
  fiber: number | undefined;
  servingSize: number;
  servingUnitOfMeasurement: string;
  servingSizeNote: string | undefined;
}

export interface ConsumedFoodItem {
  item: FoodItem;
  quantity: number;
  unitOfMeasurement: string;
}

export interface FoodContextValue {
  items: Record<string, FoodItem>;
  groups: Record<string, Array<ConsumedFoodItem>>;
}

const FoodContext = React.createContext<FoodContextValue | null>(null);

type Props = React.PropsWithChildren<{}>;

const FoodContextProvider = ({children}: Props): React.ReactElement<Props> => {
  return (
    <FoodContext.Provider value={{items: {}, groups: {}}}>
      {children}
    </FoodContext.Provider>
  );
};

export default FoodContextProvider;

export const useFoodContext = () => {
  const foodContext = React.useContext(FoodContext);
  if (foodContext === null) {
    throw new Error(
      'No FoodContext value found. Was useFoodContext() called outside of a FoodProvider?',
    );
  }
  return foodContext;
};
