import React from "react";
import hoistNonReactStatics from "hoist-non-react-statics";
import WaitingContext from "./context";
import { useWait } from "./hooks";

function getDisplayName(Component) {
  return Component.displayName || Component.name || "Component";
}

function injectWaiting(
  WrappedComponent,
  { forwardRef = false, propName = "waiting" } = {}
) {
  const WithWaiting = props => {
    const { Wait } = useWait();

    return (
      <WaitingContext.Consumer>
        {value => {
          value.Wait = Wait;
          return (
            <WrappedComponent
              {...props}
              {...{
                [propName]: value
              }}
              ref={forwardRef ? props.forwardedRef : null}
            />
          );
        }}
      </WaitingContext.Consumer>
    );
  };

  WithWaiting.displayName = `WithWaiting(${getDisplayName(WrappedComponent)})`;
  WithWaiting.WrappedComponent = WrappedComponent;

  if (forwardRef) {
    return hoistNonReactStatics(
      React.forwardRef((props, ref) => (
        <WithWaiting {...props} forwardedRef={ref} />
      )),
      WrappedComponent
    );
  }

  return hoistNonReactStatics(WithWaiting, WrappedComponent);
}

export default injectWaiting;
