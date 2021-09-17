import {Dimensions, StyleSheet} from 'react-native';

export const defaultPadding = 10;

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  screen: {padding: defaultPadding},
  input: {borderColor: 'black', borderWidth: 1},
  inputLabel: {color: 'grey'},
  inputError: {borderColor: 'red'},
  inputErrorMessage: {color: 'red'},
  button: {color: 'blue'},
  error: {
    borderWidth: 1,
    borderColor: 'red',
    color: 'red',
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
