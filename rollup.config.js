import fs from "fs";
import path from "path";

import typescript from "@rollup/plugin-typescript";
import babel from "rollup-plugin-babel";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import localResolve from "rollup-plugin-local-resolve";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import pkg from "./package.json";

// it's important to mark all subpackages of data-fns as externals
// see https://github.com/Hacker0x01/react-datepicker/issues/1606
const dateFnsDirs = fs
  .readdirSync(path.join(".", "node_modules", "date-fns"))
  .map((d) => `date-fns/${d}`);

const globals = {
  react: "React",
  "react-onclickoutside": "onClickOutside",
  "react-popper": "ReactPopper",
  classnames: "classNames",
};

const config = {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.browser,
      format: "umd",
      name: "DatePicker",
      globals,
    },
    {
      file: "dist/react-d8picker.js",
      format: "umd",
      name: "DatePicker",
      globals,
    },
    {
      file: pkg.main,
      format: "cjs",
      name: "DatePicker",
    },
    {
      file: pkg.module,
      format: "es",
    },
  ],
  plugins: [
    typescript(),
    resolve({
      mainFields: ["module"],
      extensions: [".js", ".ts", ".tsx"],
    }),
    peerDepsExternal(),
    babel(),
    localResolve(),
    commonjs(),
    filesize(),
    terser(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
  external: Object.keys(pkg.dependencies)
    .concat(Object.keys(pkg.peerDependencies))
    .concat(dateFnsDirs),
};

export default config;
