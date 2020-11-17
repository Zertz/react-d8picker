import React, { useState } from "react";
import PropTypes from "prop-types";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import DatePicker from "react-d8picker";
import * as DateFNS from "date-fns/esm";
import fi from "date-fns/locale/fi";
import slugify from "slugify";
import range from "lodash/range";
import prismGitHubTheme from "prism-react-renderer/themes/github";
import editIcon from "./edit-regular.svg";

export default class CodeExampleComponent extends React.Component {
  static propTypes = {
    example: PropTypes.object.isRequired,
  };

  render() {
    const { title, description, component } = this.props.example;
    return (
      <div
        id={`example-${slugify(title, { lower: true })}`}
        className="example"
      >
        <h2 className="example__heading">{title}</h2>
        {description && <p>{description}</p>}
        <div className="row">
          <LiveProvider
            code={component.trim()}
            scope={{
              PropTypes,
              useState,
              DatePicker,
              ...DateFNS,
              range,
              fi,
            }}
            theme={prismGitHubTheme}
          >
            <pre className="example__code">
              <img
                src={editIcon}
                className="example__code__edit_icon"
                alt="edit icon"
                title="Edit the code directly on the left side and and see the output on the right"
              />
              <LiveEditor />
            </pre>
            <div className="example__preview">
              <LiveError />
              <LivePreview />
            </div>
          </LiveProvider>
        </div>
      </div>
    );
  }
}
