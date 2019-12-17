import React, { useState } from 'react';
import LayoutComponent from '../Components/Layout/index'

const Layout = React.createContext({
  showNav: () => null,
  hideNav: () => null
});

const LayoutProvider = ({children}) => {
  const [showNav, setShowNav] = useState(true);

  return (
    <Layout.Provider
      value={{
        showNav: () => setShowNav(true),
        hideNav: () => setShowNav(false)
      }}
    >
      <LayoutComponent showNav={showNav}>
        {children}
      </LayoutComponent>
    </Layout.Provider>
  );
}

const LayoutConsumer = Layout.Consumer;

export { LayoutProvider, LayoutConsumer };