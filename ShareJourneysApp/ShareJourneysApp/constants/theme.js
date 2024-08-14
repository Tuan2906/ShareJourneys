import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export const COLORS = {
    primary: '#242760',
    secondary: '#544C4C',
    white: '#FFFFFF',
    light: '#fbfbfb',
    black: '#000000',
    lightGray: '#b2b2b2',
    gray: 'rgba(36, 39, 96, 0.05)',
    secondaryGray: 'rgba(84, 76, 76, 0.14)',
    carrot: '#e67e22'
}

export const SHADOW = {
    light: {
      shadowColor: COLORS.black,
      shadowRadius: 4,
      shadowOpacity: 0.1,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
    dark: {
      shadowColor: COLORS.black,
      shadowRadius: 4,
      shadowOpacity: 0.3,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
  };


export const SIZES = {
    // global SIZES
    base: 8,
    font: 14,
    radius: 30,
    padding: 10,
    padding2: 12,
    padding3: 16,

    // font sizes
    largeTitle: 50,
    h1: 30,
    h2: 20,
    h3: 18,
    h4: 16,
    caption: 12,
    radius2: 16,
    body1: 30,
    body2: 20,
    body3: 18,
    body4: 14,
    body5: 12,

    // app dimensions
    width,
    height,
}

export const FONTS = {
    largeTitle: {
        
        fontSize: SIZES.largeTitle,
        lineHeight: 55,
    },
    h1: {  fontSize: SIZES.h1, lineHeight: 36 },
    h2: {  fontSize: SIZES.h2, lineHeight: 30 },
    h3: {  fontSize: SIZES.h3, lineHeight: 22 },
    h4: {  fontSize: SIZES.h4, lineHeight: 20 },
    body1: {  fontSize: SIZES.body1, lineHeight: 36 },
    body2: {  fontSize: SIZES.body2, lineHeight: 30 },
    body3: {  fontSize: SIZES.body3, lineHeight: 22 },
    body4: {  fontSize: SIZES.body4, lineHeight: 20 },
}


export const SPACING = {
    s: 8,
    m: 18,
    l: 24,
    xl: 40,
  };

const appTheme = { COLORS, SIZES, SHADOW, FONTS, SPACING }

export default appTheme

