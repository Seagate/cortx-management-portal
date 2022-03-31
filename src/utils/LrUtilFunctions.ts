export class Dimensions {
  private static instance: Dimensions;
  public dimensions: any = {
    window: {
      height: 0,
      width: 0,
    },
    mainLayout: {
      headerBar: {
        height: 0,
        width: 0,
      },
      navBar: {
        height: 0,
        width: 0,
      },
      content: {
        height: 0,
        width: 0,
      },
    },
  };
  private constructor() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const headerHeight = 50;
    const headerWidth = windowWidth;
    const navBarHeight = windowHeight - headerHeight;
    const navBarWidth = 60;

    this.dimensions = {
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
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Dimensions();
    }
    return this.instance;
  }

  public getWindowDimension() {
    return this.dimensions.window;
  }

  public getHeaderBarDimension() {
    return this.dimensions.mainLayout.headerBar;
  }

  public getNavBarDimension() {
    return this.dimensions.mainLayout.navBar;
  }

  public getContentDimension() {
    return this.dimensions.mainLayout.content;
  }
}
