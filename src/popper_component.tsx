import classnames from "classnames";
import * as React from "react";
import { Manager, Popper, Reference } from "react-popper";
import TabLoop from "./tab_loop";

interface Props {
  className?: string;
  hidePopper?: boolean;
  popperComponent?: JSX.Element;
  popperModifiers?: Record<string, any>; // <datepicker/> props
  popperPlacement?: any; // <datepicker/> props
  popperContainer?: any;
  popperProps?: Record<string, any>;
  targetComponent?: React.ReactNode;
  enableTabLoop?: boolean;
  popperOnKeyDown?: (event: any) => void;
}

export default class PopperComponent extends React.Component<Props> {
  static defaultProps = {
    hidePopper: true,
    popperModifiers: {
      preventOverflow: {
        enabled: true,
        escapeWithReference: true,
        boundariesElement: "viewport",
      },
    },
    popperProps: {},
    popperPlacement: "bottom-start",
  };

  render() {
    const {
      className,
      hidePopper,
      popperComponent,
      popperModifiers,
      popperPlacement,
      popperProps,
      targetComponent,
      enableTabLoop,
      popperOnKeyDown,
    } = this.props;

    let popper;

    if (!hidePopper) {
      const classes = classnames("react-datepicker-popper", className);
      popper = (
        <Popper
          modifiers={popperModifiers}
          placement={popperPlacement}
          {...popperProps}
        >
          {({ ref, style, placement, arrowProps }) => (
            <TabLoop enableTabLoop={enableTabLoop}>
              <div
                {...{ ref, style }}
                className={classes}
                data-placement={placement}
                onKeyDown={popperOnKeyDown}
              >
                {React.cloneElement(popperComponent, { arrowProps })}
              </div>
            </TabLoop>
          )}
        </Popper>
      );
    }

    if (this.props.popperContainer) {
      // @ts-ignore
      popper = React.createElement(this.props.popperContainer, {}, popper);
    }

    const wrapperClasses = classnames("react-datepicker-wrapper");

    return (
      // @ts-ignore
      <Manager className="react-datepicker-manager">
        <Reference>
          {({ ref }) => (
            <div ref={ref} className={wrapperClasses}>
              {targetComponent}
            </div>
          )}
        </Reference>
        {popper}
      </Manager>
    );
  }
}
