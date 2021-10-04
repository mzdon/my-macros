import React from 'react';

import {Animated, StyleSheet, Text, View} from 'react-native';

import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const ACTION_WIDTH = 82;
const ACTION_FONT_SIZE = 16;
const ACTION_PADDING = 10;
const MIN_HEIGHT = ACTION_FONT_SIZE + ACTION_PADDING * 2;

const styles = StyleSheet.create({
  childrenContainer: {
    minHeight: MIN_HEIGHT,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionContainer: {
    flex: 1,
  },
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: ACTION_FONT_SIZE,
    backgroundColor: 'transparent',
    padding: ACTION_PADDING,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

interface Action {
  label: string;
  color: string;
  onPress: () => void;
}

type Props = React.PropsWithChildren<{
  leftActions?: Action[];
  rightActions?: Action[];
}>;

const SwipeableRow = ({
  leftActions,
  rightActions,
  children,
}: Props): React.ReactElement<Props> => {
  const swipeableRef = React.useRef<Swipeable | null>(null);

  const close = React.useCallback(() => {
    swipeableRef.current?.close();
  }, []);

  const renderAction = React.useCallback(
    (
      text: string,
      color: string,
      callback: () => void,
      x: number,
      progress: Animated.AnimatedInterpolation,
    ) => {
      const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [x, 0],
      });
      const pressHandler = () => {
        close();
        callback();
      };

      return (
        <Animated.View
          key={text}
          style={[styles.actionContainer, {transform: [{translateX: trans}]}]}>
          <RectButton
            style={[styles.rightAction, {backgroundColor: color}]}
            onPress={pressHandler}>
            <Text style={styles.actionText}>{text}</Text>
          </RectButton>
        </Animated.View>
      );
    },
    [close],
  );

  const renderLeftActions = React.useCallback(
    (progress: Animated.AnimatedInterpolation) => {
      if (!leftActions) {
        return null;
      }
      return (
        <View
          style={[
            styles.actionsContainer,
            {
              width: leftActions.length * ACTION_WIDTH,
            },
          ]}>
          {leftActions.map((action, index) =>
            renderAction(
              action.label,
              action.color,
              action.onPress,
              0 + index * ACTION_WIDTH,
              progress,
            ),
          )}
        </View>
      );
    },
    [leftActions, renderAction],
  );

  const renderRightActions = React.useCallback(
    (progress: Animated.AnimatedInterpolation) => {
      if (!rightActions) {
        return null;
      }
      const width = rightActions.length * ACTION_WIDTH;
      return (
        <View
          style={[
            styles.actionsContainer,
            {
              width,
            },
          ]}>
          {rightActions.map((action, index) =>
            renderAction(
              action.label,
              action.color,
              action.onPress,
              width - index * ACTION_WIDTH,
              progress,
            ),
          )}
        </View>
      );
    },
    [renderAction, rightActions],
  );

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}>
      <View style={styles.childrenContainer}>{children}</View>
    </Swipeable>
  );
};

export default SwipeableRow;

interface UseEditAndDeleteActionCallbacks {
  onEditPress: () => void;
  onDeletePress: () => void;
}

export const getEditAction = (
  onEditPress: UseEditAndDeleteActionCallbacks['onEditPress'],
) => ({color: 'purple', label: 'Edit', onPress: onEditPress});

export const getDeleteAction = (
  onDeletePress: UseEditAndDeleteActionCallbacks['onDeletePress'],
) => ({color: 'red', label: 'Delete', onPress: onDeletePress});

export const getEditAndDeleteActions = ({
  onEditPress,
  onDeletePress,
}: UseEditAndDeleteActionCallbacks): Action[] => [
  getEditAction(onEditPress),
  getDeleteAction(onDeletePress),
];

export const useEditAndDeleteActions = (
  callbacks: UseEditAndDeleteActionCallbacks,
) => React.useMemo(() => getEditAndDeleteActions(callbacks), [callbacks]);
