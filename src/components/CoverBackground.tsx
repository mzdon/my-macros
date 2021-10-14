import React from 'react';

import Background from 'components/Background';
import {JustChildrenProps} from 'types/Common';

const CoverBackground = ({
  children,
}: JustChildrenProps): React.ReactElement<JustChildrenProps> => {
  return (
    <Background asset={require('images/marbled.jpeg')}>{children}</Background>
  );
};

export default CoverBackground;
