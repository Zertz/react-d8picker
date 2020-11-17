import React, { useState, useEffect } from "react";
import ExampleComponents from "../Examples";
import ribbon from "./ribbon.png";
import logo from "./logo.png";
import DatePicker from "react-d8picker";

const Example = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [isScrolled, setIsScrolled] = useState(true);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    const Show = window.scrollY < 400;
    if (Show) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  return (
    <DatePicker
      open={isOpen && isScrolled}
      selected={startDate}
      onChange={(date) => {
        setStartDate(date);
        setIsOpen(false);
      }}
      onInputClick={() => setIsOpen(true)}
    />
  );
};

const Root = () => (
  <div>
    <div className="hero">
      <div className="hero__content">
        <h1 className="hero__title">React Datepicker</h1>
        <div className="hero__crafted-by">
          <a href="https://hackerone.com" className="hero__crafted-by-link">
            Crafted by{" "}
            <img
              src={logo}
              className="hero__image"
              alt="HackerOne"
              title="HackerOne"
            />
          </a>
        </div>
        <div className="hero__example">
          <Example />
        </div>
      </div>
    </div>
    <div className="wrapper">
      <h1>React Datepicker</h1>
      <p className="badges">
        <a href="https://npmjs.org/package/react-d8picker">
          <img
            src="https://badge.fury.io/js/react-d8picker.svg"
            alt="NPM package version badge"
            className="badge"
          />
        </a>
      </p>
      <p>A simple and reusable datepicker component for React.</p>

      <h2>Installation</h2>
      <p>The package can be installed via NPM:</p>
      <p>
        <code>npm install react-d8picker --save</code>
      </p>
      <p>Or by using Yarn:</p>
      <p>
        <code>yarn add react-d8picker</code>
      </p>
      <p>
        Below are examples which also can be edited directly via the editor on
        the left side and will be rendered on the right.
      </p>
    </div>
    <div className="wrapper">
      <ExampleComponents />
    </div>

    <a href="https://github.com/Zertz/react-d8picker/">
      <img className="github-ribbon" src={ribbon} alt="Fork me on GitHub" />
    </a>
  </div>
);

export default Root;
