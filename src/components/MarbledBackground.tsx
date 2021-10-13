import React from 'react';

import {Image, StyleSheet, View} from 'react-native';

import {screenHeight, screenWidth} from 'styles';

const _styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  imageRow: {
    flex: 1,
    flexDirection: 'row',
  },
  innerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

type Props = React.PropsWithChildren<{}>;

const MarbledBackground = ({children}: Props): React.ReactElement<Props> => {
  const imageMatrix = React.useMemo(() => {
    const imgWidth = 360;
    const imgHeight = 360;
    const horizontalCount = Math.ceil(screenWidth / imgWidth);
    const verticalCount = Math.ceil(screenHeight / imgHeight);
    const matrix = [];
    for (var i = 0; i < verticalCount; i++) {
      const row = [];
      for (var j = 0; j < horizontalCount; j++) {
        row.push(
          <Image
            key={`bg-${i}-${j}`}
            source={require('images/background.jpeg')}
          />,
        );
      }
      matrix.push(row);
    }
    return matrix;
  }, []);

  console.log(imageMatrix);

  return (
    <View style={_styles.container}>
      {imageMatrix.map((row, i) => (
        <View key={`row-${i}`} style={_styles.imageRow}>
          {row}
        </View>
      ))}
      <View style={_styles.innerContainer}>{children}</View>
    </View>
  );
};

export default MarbledBackground;
