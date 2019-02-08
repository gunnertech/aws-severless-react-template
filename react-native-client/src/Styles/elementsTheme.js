const getElementsTheme = muiStyles => ({
  ...muiStyles,
  Header: {
    containerStyle:{
      backgroundColor: muiStyles.palette.headerBackgroundColor,
      justifyContent: 'space-around',
    }
  }
})

export default getElementsTheme;