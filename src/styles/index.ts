import {Dimensions, StyleSheet} from 'react-native';

export const defaultPadding = 10;

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

export const backgroundColor = '#FFFFFF';
export const pageLineColor = '#8CCFD8';

export default StyleSheet.create({
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
