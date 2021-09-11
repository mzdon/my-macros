import React from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import {View} from 'react-native';

import EditFoodItemStep1 from 'modals/addFoodItemModal/EditFoodItemStep1';
import EditFoodItemStep2 from 'modals/addFoodItemModal/EditFoodItemStep2';
import ItemConsumed from 'modals/addFoodItemModal/ItemConsumed';
import LookupOrAdd from 'modals/addFoodItemModal/LookupOrAdd';
import {
  AddFoodItemModalRouteProp,
  AddMealModalNavigationProp,
} from 'navigation/RouteTypes';
import {useUserContext} from 'providers/UserProvider';
import ConsumedFoodItem, {ConsumedFoodItemData} from 'schemas/ConsumedFoodItem';
import FoodItem, {FoodItemData} from 'schemas/FoodItem';
import User from 'schemas/User';
import styles from 'styles';
import {CatastrophicError, RecoverableError} from 'utils/Errors';
import {useJournalContext} from 'providers/JournalProvider';

enum Page {
  Lookup = 'lookup',
  NewItem1 = 'newItem1',
  NewItem2 = 'newItem2',
  Consumed = 'consumed',
  NewGroup = 'newGroup',
}

interface AddFoodItemState {
  page: Page;
  pageHistory: Page[];
  foodItem: FoodItem | FoodItemData | null;
  consumedFoodItem: ConsumedFoodItemData | null;
}

interface FoodItemStateInterface {
  state: AddFoodItemState;
  goBack: () => void;
  addFoodItem: (foodItem: FoodItemData) => void;
  setFoodItem: (foodItem: FoodItem) => void;
  updateFoodItem: (data: FoodItemData) => void;
  setConsumedFoodItem: (consumedFoodItem: ConsumedFoodItemData) => void;
  // addFoodItemGroup: (foodItemGroupData: FoodItemGroupData) => void;
  // setFoodItemGroup: (foodItemGroup: FoodItemGroup) => void;
  // addConsumedFoodItemToGroup: (consumedFoodItem: ConsumedFoodItemData) => void;
}

interface RealmInterface {
  user: User;
  createFoodItem: (foodItemData: FoodItemData) => FoodItem;
  updateFoodItem: (foodItem: FoodItem, foodItemData: FoodItemData) => FoodItem;
  createConsumedFoodItem: (
    consumedFoodItem: ConsumedFoodItemData,
  ) => ConsumedFoodItem;
}

const updatePageHistory = (
  state: AddFoodItemState,
): AddFoodItemState['pageHistory'] => {
  const history = [...state.pageHistory];
  history.push(state.page);
  return history;
};

const useFoodItemState = (
  realmInterface: RealmInterface,
): FoodItemStateInterface => {
  const [state, setState] = React.useState<AddFoodItemState>({
    page: Page.Lookup,
    pageHistory: [],
    foodItem: null,
    consumedFoodItem: null,
  });

  const navigation = useNavigation<AddMealModalNavigationProp>();

  const goBack = React.useCallback(() => {
    const {pageHistory} = state;
    const history = [...pageHistory];
    const lastPage = history.pop();

    if (!lastPage) {
      throw new RecoverableError("Can't go back. No page to go back to!");
    }

    setState({
      ...state,
      page: lastPage,
      pageHistory: history,
    });
  }, [state]);

  const addFoodItem = React.useCallback(
    (foodItem: FoodItemData) => {
      setState({
        ...state,
        page: Page.NewItem1,
        pageHistory: updatePageHistory(state),
        foodItem,
      });
    },
    [state, setState],
  );

  const setFoodItem = React.useCallback(
    (foodItem: FoodItem) => {
      setState({
        ...state,
        page: Page.Consumed,
        pageHistory: updatePageHistory(state),
        foodItem,
        consumedFoodItem: {
          item: foodItem,
          quantity: 0,
          unitOfMeasurement: foodItem.servingUnitOfMeasurement,
        },
      });
    },
    [state, setState],
  );

  const updateFoodItem = React.useCallback(
    (foodItemData: FoodItemData) => {
      const {foodItem} = state;
      if (!foodItem) {
        throw new RecoverableError('No foodItem in state to update');
      }

      let nextState: Partial<AddFoodItemState> = {};
      if (foodItem instanceof FoodItem) {
        nextState.foodItem = realmInterface.updateFoodItem(
          foodItem,
          foodItemData,
        );
      } else {
        nextState.foodItem = foodItem;
      }

      if (state.page === Page.NewItem1) {
        nextState.page = Page.NewItem2;
      } else if (state.page === Page.NewItem2) {
        nextState.page = Page.Consumed;
        nextState.consumedFoodItem = {
          item: foodItemData,
          quantity: 0,
          unitOfMeasurement: foodItemData.servingUnitOfMeasurement,
        };
      } else {
        throw new CatastrophicError(
          'Unexpected page found in AddFoodItemModal.updateFoodItem',
        );
      }

      setState({
        ...state,
        ...nextState,
        pageHistory: updatePageHistory(state),
      });
    },
    [state, realmInterface],
  );

  const setConsumedFoodItem = React.useCallback(
    (consumedFoodItem: ConsumedFoodItemData) => {
      const {foodItem} = state;
      if (foodItem && !(state.foodItem instanceof FoodItem)) {
        const newFoodItem = realmInterface.createFoodItem(foodItem);
        consumedFoodItem.item = newFoodItem.getData();
      }
      realmInterface.createConsumedFoodItem(consumedFoodItem);
      navigation.goBack();
    },
    [navigation, realmInterface, state],
  );

  // const addFoodItemGroup = (groupData: FoodItemGroupData) => undefined;

  // const setFoodItemGroup = React.useCallback(
  //   (foodItemGroup: FoodItemGroup) => {
  //     setState({
  //       ...state,
  //       page: Page.NewGroup,
  //       pageHistory: updatePageHistory(state),
  //       foodItemGroup: foodItemGroup,
  //     });
  //   },
  //   [state, setState],
  // );

  // const addConsumedFoodItemToGroup = React.useCallback(
  //   foodItem => {
  //     const {foodItemGroup} = state;
  //     if (!foodItemGroup) {
  //       return;
  //     }
  //     foodItemGroup.addFoodItem(foodItem);
  //     setState({
  //       ...state,
  //       foodItemGroup,
  //     });
  //   },
  //   [state, setState],
  // );

  return {
    state,
    goBack,
    addFoodItem,
    setFoodItem,
    updateFoodItem,
    setConsumedFoodItem,
  };
};

const useScreen = (stateInterface: FoodItemStateInterface) => {
  const {
    state,
    goBack,
    addFoodItem,
    setFoodItem,
    updateFoodItem,
    setConsumedFoodItem,
  } = stateInterface;
  const {page, foodItem, consumedFoodItem} = state;
  switch (page) {
    case Page.Lookup:
      return (
        <LookupOrAdd addFoodItem={addFoodItem} setFoodItem={setFoodItem} />
      );
    case Page.NewItem1: {
      if (foodItem === null) {
        throw new RecoverableError('No food item found to edit');
      }
      return (
        <EditFoodItemStep1
          foodItem={foodItem}
          onGoBack={goBack}
          onUpdateFoodItem={updateFoodItem}
        />
      );
    }
    case Page.NewItem2:
      if (foodItem === null) {
        throw new RecoverableError('No food item found to edit');
      }
      return (
        <EditFoodItemStep2
          foodItem={foodItem}
          onGoBack={goBack}
          onUpdateFoodItem={updateFoodItem}
        />
      );
    case Page.NewGroup:
      // return <NewFoodGroup />;
      return <></>;
    case Page.Consumed:
      if (consumedFoodItem === null) {
        throw new RecoverableError('No consumed food item found to edit');
      }
      return (
        <ItemConsumed
          consumedFoodItem={consumedFoodItem}
          onGoBack={goBack}
          onAddItemConsumed={setConsumedFoodItem}
        />
      );
    default:
      throw new CatastrophicError(
        `Found some unhandled state: ${JSON.stringify(state)}`,
      );
  }
};

const AddFoodItemModal = () => {
  const route = useRoute<AddFoodItemModalRouteProp>();
  const {journalEntryId, mealIndex} = route.params;
  const {user, createFoodItem, updateFoodItem} = useUserContext();
  const {createConsumedFoodItem} = useJournalContext();
  const onCreateConsumedFoodItem = React.useCallback(
    (consumedFoodItem: ConsumedFoodItemData) => {
      return createConsumedFoodItem(
        journalEntryId,
        mealIndex,
        consumedFoodItem,
      );
    },
    [createConsumedFoodItem, journalEntryId, mealIndex],
  );
  const state = useFoodItemState({
    user,
    createFoodItem,
    updateFoodItem,
    createConsumedFoodItem: onCreateConsumedFoodItem,
  });
  const screen = useScreen(state);
  return <View style={styles.screen}>{screen}</View>;
};

export default AddFoodItemModal;
