import React from 'react';

import {Animated, StyleSheet, Text, View} from 'react-native';
import {RectButton, Swipeable} from 'react-native-gesture-handler';

import SwipeableIndicator from 'components/SwipeableIndicator';

const ACTION_WIDTH = 82;
const ACTION_FONT_SIZE = 16;
const ACTION_PADDING = 10;
export const MIN_HEIGHT = ACTION_FONT_SIZE + ACTION_PADDING * 2;
const RED = '#EF5272';
const PURPLE = '#B797FF';

const styles = StyleSheet.create({
  childrenContainer: {
    minHeight: MIN_HEIGHT,
    flexDirection: 'row',
  },
  actionsContainer: {
    flexDirection: 'row-reverse',
  },
  leftActionsContainer: {
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
      trans: Animated.AnimatedInterpolation,
    ) => {
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
      const getTranslateX = (
        prog: Animated.AnimatedInterpolation,
        idx: number,
      ) =>
        prog.interpolate({
          inputRange: [0, 1],
          outputRange: [ACTION_WIDTH * (idx + 1) * -1, 0],
        });
      return (
        <View
          style={[
            styles.leftActionsContainer,
            {
              width: leftActions.length * ACTION_WIDTH,
            },
          ]}>
          {leftActions
            .slice(0)
            .reverse()
            .map((action, index) =>
              renderAction(
                action.label,
                action.color,
                action.onPress,
                getTranslateX(progress, index),
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
      const getTranslateX = (prog: Animated.AnimatedInterpolation, x: number) =>
        prog.interpolate({
          inputRange: [0, 1],
          outputRange: [x, 0],
        });
      return (
        <View
          style={[
            styles.actionsContainer,
            {
              width,
            },
          ]}>
          {rightActions.reduceRight((result, action, index) => {
            const nextResult = [...result];
            nextResult.push(
              renderAction(
                action.label,
                action.color,
                action.onPress,
                getTranslateX(progress, width - index * ACTION_WIDTH),
              ),
            );
            return nextResult;
          }, [] as React.ReactElement[])}
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
      <View style={styles.childrenContainer}>
        {!!leftActions && <SwipeableIndicator color={PURPLE} left />}
        {children}
        {!!rightActions && <SwipeableIndicator color={PURPLE} />}
      </View>
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
) => ({color: PURPLE, label: 'Edit', onPress: onEditPress});

export const getDeleteAction = (
  onDeletePress: UseEditAndDeleteActionCallbacks['onDeletePress'],
) => ({color: RED, label: 'Delete', onPress: onDeletePress});

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
