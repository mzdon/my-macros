import React from 'react';

import {View} from 'react-native';
import {defaultPadding} from 'styles';

const Spacer = ({height = defaultPadding}) => <View style={{height}} />;

export default Spacer;
