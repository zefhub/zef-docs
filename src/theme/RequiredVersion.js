import React from "react";
// import useThemeContext from "@theme/hooks/useThemeContext";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

const RequiredVersion = ({ children }) => {
  // const { isDarkTheme } = useThemeContext();
  const isDarkTheme = true;

  return (
    <Tippy content={children} theme={isDarkTheme ? "dark" : "light"}>
      <sup style={{ color: "red" }}>!!!</sup>
    </Tippy>
  );
};

export default RequiredVersion;
