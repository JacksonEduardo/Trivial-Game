import React, { useState, useEffect } from "react";
import "../style/navbar.css";
import { Link } from "react-router-dom";
import { useGameContext } from "../logic/globalContext";

const Navbar = () => {
  const { theme, setTheme } = useGameContext();
  // const [changeTheme, setChangeTheme] = useState(false);
  const [dinamicClass, setDinamicClass] = useState("");

  useEffect(() => {
    setDinamicClass(theme === "light" ? "sunIcon test" : "moonIcon test");
  }, [theme]);

  // toogle function
  const toggleTheme = () => {
    // code to change global theme
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // save in localStorage
    // code to animate button to change theme

    // setDinamicClass(newTheme === "light" ? "moonIcon" : "sunIcon");
  };

  return (
    <>
      <nav className="navbarContainer">
        <Link className="noDecoration" to={"/"}>
          <div className="logoTitle">
            <div className="logoEmpanada"></div>
            <h1 className="logo">Trivial</h1>
          </div>
        </Link>
        <div onClick={toggleTheme} className="iconContainer">
          <div className={`containerIconTheme ${dinamicClass} `}>
            {/* empty only to contian icons of theme */}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
