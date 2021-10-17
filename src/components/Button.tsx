import React from 'react';

import {Pressable, StyleSheet} from 'react-native';

import Text from 'components/Text';
import {RecoverableError} from 'utils/Errors';
import {backgroundColor, pageLineColor} from 'styles';

const _styles = StyleSheet.create({
  button: {
    backgroundColor: pageLineColor,
    color: backgroundColor,
  },
});

type Props = React.PropsWithChildren<{
  title: string;
  onPress: () => void;
}>;

const Button = ({
  children,
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
      {children || <Text style={_styles.button}>{title}</Text>}
    </Pressable>
  );
};

export default Button;
