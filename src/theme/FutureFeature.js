import React from "react";
// import useThemeContext from "@theme/hooks/useThemeContext";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

const FutureFeature = ({ children }) => {
  // const { isDarkTheme } = useThemeContext();
  const isDarkTheme = true;

  return (
    <Tippy content={children} theme={isDarkTheme ? "dark" : "light"}>
      <img src="/img/light-bulb.svg" width="20px" height="20px" />
    </Tippy>
  );
};

export default FutureFeature;
