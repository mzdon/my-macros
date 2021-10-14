import React from 'react';

import {StyleSheet, Text, TextProps} from 'react-native';

const _styles = StyleSheet.create({
  base: {
    fontSize: 16,
  },
  coverHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

type Props = React.PropsWithChildren<TextProps>;
type TextComponent = (props: Props) => React.ReactElement<Props>;
type TextComponents = TextComponent & {
  CoverHeader: TextComponent;
  PageHeader: TextComponent;
  SubHeader: TextComponent;
};

const createComponent = (typeStyle?: Props['style']): TextComponent => {
  const Component = ({
    style,
    children,
    ...rest
  }: Props): React.ReactElement<Props> => {
    return (
      <Text style={[_styles.base, typeStyle, style]} {...rest}>
        {children}
      </Text>
    );
  };
  return Component;
};

const Base = createComponent() as TextComponents;
Base.CoverHeader = createComponent(_styles.coverHeader);
Base.PageHeader = createComponent(_styles.pageHeader);
Base.SubHeader = createComponent(_styles.subHeader);

export default Base;
