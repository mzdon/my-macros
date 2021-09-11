import React from 'react';

import BaseTextInput from 'components/BaseTextInput';
import BirthdayInput from 'components/BirthdayInput';
import HeightInput from 'components/HeightInput';
import RadioButtons from 'components/RadioButtons';
import Spacer from 'components/Spacer';
import WeightInput from 'components/WeightInput';
import {UserInfoStepProps} from 'screens/userInfo/Common';
import {MeasurementSystem} from 'types/MeasurementSystem';
import {useUpdater} from 'utils/State';

type Step1Props = UserInfoStepProps<string | number | MeasurementSystem | null>;

const UserInfoStep1 = ({
  data,
  onUpdate,
}: Step1Props): React.ReactElement<Step1Props> => {
  const updateName = useUpdater(onUpdate, 'name');
  const updateBirthday = useUpdater(onUpdate, 'birthday');
  const onUpdateMeasurementSystem = useUpdater<MeasurementSystem | null>(
    onUpdate,
    'measurementSystem',
  );
  const updateMeasurementSystem = (v: string | null) => {
    onUpdateMeasurementSystem(v as MeasurementSystem | null);
  };
  const updateHeight = useUpdater<number>(onUpdate, 'height');
  const updateWeight = useUpdater<number>(onUpdate, 'weight');

  return (
    <>
      <BaseTextInput
        label="Name"
        value={data.name}
        placeholder="Name"
        onChangeText={updateName}
      />
      <Spacer />
      <BirthdayInput value={data.birthday} onChangeText={updateBirthday} />
      <Spacer />
      <RadioButtons
        label="Measurement System (optional)"
        optional
        values={[MeasurementSystem.Imperial, MeasurementSystem.Metric]}
        value={data.measurementSystem}
        onChange={updateMeasurementSystem}
      />
      <Spacer />
      <HeightInput
        value={data.height}
        measurementSystem={data.measurementSystem}
        onChangeText={updateHeight}
      />
      <WeightInput
        value={data.weight}
        measurementSystem={data.measurementSystem}
        onChangeText={updateWeight}
      />
    </>
  );
};

export default UserInfoStep1;
