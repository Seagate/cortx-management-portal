import store from "../store/index";
export const populateDimensions = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const headerHeight = 50;
  const headerWidth = windowWidth;
  const navBarHeight = windowHeight - headerHeight;
  const navBarWidth = 60;

  const dimensions = {
    window: {
      height: windowHeight,
      width: windowWidth,
    },
    mainLayout: {
      headerBar: {
        height: headerHeight,
        width: headerWidth,
      },
      navBar: {
        height: navBarHeight,
        width: navBarWidth,
      },
      content: {
        height: navBarHeight,
        width: windowWidth - navBarWidth,
      },
    },
  };

  store.commit("dimensions/setDimensions", dimensions);
};
