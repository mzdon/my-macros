import React from 'react';

import {Pressable, StyleSheet, View, ViewStyle} from 'react-native';

import Text from 'components/Text';
import {RecoverableError} from 'utils/Errors';
import {backgroundColor, defaultPadding, pageLineColor} from 'styles';

const _styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundColor,
    borderWidth: 2,
    borderRadius: 3,
    borderColor: pageLineColor,
    padding: defaultPadding,
  },
  title: {
    color: pageLineColor,
    fontSize: 16,
  },
});

type Props = React.PropsWithChildren<{
  title: string;
  containerStyle?: ViewStyle;
  onPress: () => void;
}>;

const Button = ({
  children,
  containerStyle,
  title,
  onPress,
}: Props): React.ReactElement<Props> => {
  if (title && React.Children.count(children) > 0) {
    throw new RecoverableError(
      'The Button component support children or a title, not both',
    );
  }

  return (
    <Pressable onPress={onPress}>
      <View style={[_styles.container, containerStyle]}>
        {children || <Text style={_styles.title}>{title}</Text>}
      </View>
    </Pressable>
  );
};

export default Button;
