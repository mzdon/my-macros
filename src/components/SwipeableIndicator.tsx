import React from 'react';

import {View} from 'react-native';
import {Svg, Polygon} from 'react-native-svg';

interface Props {
  color: string;
  left?: boolean;
}

const SwipeableIndicator = ({
  color,
  left = false,
}: Props): React.ReactElement<Props> => {
  const [height, setHeight] = React.useState(0);
  const handleLayout = React.useCallback(({nativeEvent: {layout}}) => {
    setHeight(layout.height);
  }, []);
  const width = height * 0.33;
  const points = left
    ? `0,0 0,${height} ${width},${height * 0.5}`
    : `${width},0 ${width},${height} 0,${height * 0.5}`;
  return (
    <View onLayout={handleLayout}>
      <Svg height={height} width={width}>
        <Polygon points={points} fill={color} strokeWidth="0" />
      </Svg>
    </View>
  );
};

export default SwipeableIndicator;
