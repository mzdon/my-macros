import React from 'react';

import MacroDefinitionsInput from 'components/MacroDefinitionsInput';
import {UserInfoStepProps} from 'screens/userInfo/Common';
import {MacroDefinitionStrings} from 'types/MacroDefinition';
import {useUpdater} from 'utils/State';

type Props = UserInfoStepProps<MacroDefinitionStrings>;

const UserInfoStep2 = ({data, onUpdate}: Props): React.ReactElement<Props> => {
  const updateMacroDefinition = useUpdater<MacroDefinitionStrings>(
    onUpdate,
    'macroDefinition',
  );
  return (
    <MacroDefinitionsInput
      value={data.macroDefinition}
      onChange={updateMacroDefinition}
    />
  );
};

export default UserInfoStep2;
