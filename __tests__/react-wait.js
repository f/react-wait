import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { Waiter, useWait, injectWaiting } from "../src/index";
import * as api from "../src/api";

Enzyme.configure({ adapter: new Adapter() });

function assertInjectedProps(component, propName) {
  expect(component.prop(propName).waiters).toEqual([]);
  expect(component.prop(propName).anyWaiting).toBeInstanceOf(Function);
  expect(component.prop(propName).isWaiting).toBeInstanceOf(Function);
  expect(component.prop(propName).startWaiting).toBeInstanceOf(Function);
  expect(component.prop(propName).endWaiting).toBeInstanceOf(Function);
  expect(component.prop(propName).Wait).toBeInstanceOf(Function);
}

test("startWaiting", async () => {
  expect(api.startWaiting(["a"], "b")).toEqual(["a", "b"]);
  expect(api.startWaiting(["a", "b"], "c")).toEqual(["a", "b", "c"]);
  expect(api.startWaiting([0, 1], 2)).toEqual([0, 1, 2]);
  expect(api.startWaiting(["a b", "c d"], "e f")).toEqual([
    "a b",
    "c d",
    "e f"
  ]);
  expect(api.startWaiting(["a", "b"], "b")).toEqual(["a", "b"]);
});

test("endWaiting", async () => {
  expect(api.endWaiting(["a", "b"], "b")).toEqual(["a"]);
  expect(api.endWaiting(["a", "b", "c"], "b")).toEqual(["a", "c"]);
  expect(api.endWaiting([0, 1, 2, 3], 3)).toEqual([0, 1, 2]);
  expect(api.endWaiting(["a b", "c d"], "a b")).toEqual(["c d"]);
});

test("isWaiting", async () => {
  expect(api.isWaiting(["a", "b"], "b")).toEqual(true);
  expect(api.isWaiting(["a", "b", "c"], "d")).toEqual(false);
  expect(api.isWaiting([0, 1, 2, 3], 4)).toEqual(false);
  expect(api.isWaiting(["a b", "c d"], "a b")).toEqual(true);
});

test("anyWaiting", async () => {
  expect(api.anyWaiting(["a", "b"])).toEqual(true);
  expect(api.anyWaiting(["a", "b", "c"])).toEqual(true);
  expect(api.anyWaiting([])).toEqual(false);
});

test("contextless", async () => {
  function Component() {
    const {
      startWaiting,
      endWaiting,
      isWaiting,
      anyWaiting,
      waiters,
      Wait
    } = useWait();
    return (
      <div>
        <button id="start" onClick={() => startWaiting("test")}>
          start
        </button>
        <button id="start-2" onClick={() => startWaiting("test-2")}>
          start
        </button>
        <button id="end" onClick={() => endWaiting("test")}>
          end
        </button>
        <button id="end-2" onClick={() => endWaiting("test-2")}>
          end
        </button>
        <div id="is">{isWaiting("test") ? "true" : "false"}</div>
        <div id="any">{anyWaiting() ? "true" : "false"}</div>
        <div id="waiters">{JSON.stringify(waiters)}</div>
        <div id="waitComp">
          <Wait on="test" fallback="Loading">
            Not Loading
          </Wait>
        </div>
      </div>
    );
  }
  const app = mount(
    <Waiter>
      <Component />
    </Waiter>
  );

  expect(
    app
      .find("#is")
      .last()
      .html()
  ).toBe('<div id="is">false</div>');
  expect(
    app
      .find("#any")
      .last()
      .html()
  ).toBe('<div id="any">false</div>');
  expect(
    app
      .find("#waitComp")
      .last()
      .html()
  ).toBe('<div id="waitComp">Not Loading</div>');

  app.find("#start").simulate("click");
  expect(
    app
      .find("#is")
      .last()
      .html()
  ).toBe('<div id="is">true</div>');
  expect(
    app
      .find("#any")
      .last()
      .html()
  ).toBe('<div id="any">true</div>');
  expect(
    app
      .find("#waiters")
      .last()
      .html()
  ).toBe('<div id="waiters">["test"]</div>');
  expect(
    app
      .find("#waitComp")
      .last()
      .html()
  ).toBe('<div id="waitComp">Loading</div>');

  app.find("#start-2").simulate("click");
  expect(
    app
      .find("#any")
      .last()
      .html()
  ).toBe('<div id="any">true</div>');
  expect(
    app
      .find("#waiters")
      .last()
      .html()
  ).toBe('<div id="waiters">["test","test-2"]</div>');

  app.find("#end").simulate("click");
  expect(
    app
      .find("#is")
      .last()
      .html()
  ).toBe('<div id="is">false</div>');
  expect(
    app
      .find("#any")
      .last()
      .html()
  ).toBe('<div id="any">true</div>');
  expect(
    app
      .find("#waiters")
      .last()
      .html()
  ).toBe('<div id="waiters">["test-2"]</div>');

  app.find("#end-2").simulate("click");
  expect(
    app
      .find("#is")
      .last()
      .html()
  ).toBe('<div id="is">false</div>');
  expect(
    app
      .find("#any")
      .last()
      .html()
  ).toBe('<div id="any">false</div>');
  expect(
    app
      .find("#waiters")
      .last()
      .html()
  ).toBe('<div id="waiters">[]</div>');
});

test("contextful", async () => {
  function Component() {
    const { createWaitingContext, anyWaiting, waiters } = useWait();

    const test = createWaitingContext("test");
    const test2 = createWaitingContext("test-2");

    return (
      <div>
        <button id="start" onClick={() => test.startWaiting()}>
          start
        </button>
        <button id="start-2" onClick={() => test2.startWaiting()}>
          start
        </button>
        <button id="end" onClick={() => test.endWaiting()}>
          end
        </button>
        <button id="end-2" onClick={() => test2.endWaiting()}>
          end
        </button>
        <div id="is">{test.isWaiting() ? "true" : "false"}</div>
        <div id="any">{anyWaiting() ? "true" : "false"}</div>
        <div id="waiters">{JSON.stringify(waiters)}</div>
        <div id="waitComp">
          <test.Wait fallback="Loading">Not Loading</test.Wait>
        </div>
      </div>
    );
  }
  const app = mount(
    <Waiter>
      <Component />
    </Waiter>
  );

  expect(
    app
      .find("#is")
      .last()
      .html()
  ).toBe('<div id="is">false</div>');
  expect(
    app
      .find("#any")
      .last()
      .html()
  ).toBe('<div id="any">false</div>');
  expect(
    app
      .find("#waitComp")
      .last()
      .html()
  ).toBe('<div id="waitComp">Not Loading</div>');

  app.find("#start").simulate("click");
  expect(
    app
      .find("#is")
      .last()
      .html()
  ).toBe('<div id="is">true</div>');
  expect(
    app
      .find("#any")
      .last()
      .html()
  ).toBe('<div id="any">true</div>');
  expect(
    app
      .find("#waiters")
      .last()
      .html()
  ).toBe('<div id="waiters">["test"]</div>');
  expect(
    app
      .find("#waitComp")
      .last()
      .html()
  ).toBe('<div id="waitComp">Loading</div>');

  app.find("#start-2").simulate("click");
  expect(
    app
      .find("#any")
      .last()
      .html()
  ).toBe('<div id="any">true</div>');
  expect(
    app
      .find("#waiters")
      .last()
      .html()
  ).toBe('<div id="waiters">["test","test-2"]</div>');

  app.find("#end").simulate("click");
  expect(
    app
      .find("#is")
      .last()
      .html()
  ).toBe('<div id="is">false</div>');
  expect(
    app
      .find("#any")
      .last()
      .html()
  ).toBe('<div id="any">true</div>');
  expect(
    app
      .find("#waiters")
      .last()
      .html()
  ).toBe('<div id="waiters">["test-2"]</div>');

  app.find("#end-2").simulate("click");
  expect(
    app
      .find("#is")
      .last()
      .html()
  ).toBe('<div id="is">false</div>');
  expect(
    app
      .find("#any")
      .last()
      .html()
  ).toBe('<div id="any">false</div>');
  expect(
    app
      .find("#waiters")
      .last()
      .html()
  ).toBe('<div id="waiters">[]</div>');
});

test("injectWaiting with options", async () => {
  const propName = "customPropName";
  const wrapperRef = React.createRef();

  class ClassComponent extends React.Component {
    render() {
      return <div>Class Component</div>;
    }
  }

  const InjectedComponent = injectWaiting(ClassComponent, {
    propName,
    forwardRef: true
  });
  const app = mount(
    <Waiter>
      <InjectedComponent ref={wrapperRef} />
    </Waiter>
  );
  const component = app.find(ClassComponent);

  expect(component.prop(propName)).not.toBeFalsy();
  expect(wrapperRef.current).toBe(component.instance());
  assertInjectedProps(component, propName);
});

test("injectWaiting without options", async () => {
  const propName = "customPropName";
  const wrapperRef = React.createRef();

  class ClassComponent extends React.Component {
    render() {
      return <div>Class Component</div>;
    }
  }

  const InjectedComponent = injectWaiting(ClassComponent);
  const app = mount(
    <Waiter>
      <InjectedComponent />
    </Waiter>
  );
  const component = app.find(ClassComponent);

  expect(component.prop(propName)).toBeFalsy();
  expect(wrapperRef.current).not.toBe(component.instance());
  assertInjectedProps(component, "waiting");
});

test("injectWaiting getDisplayName", async () => {
  const displayName = "qwe";

  function WithDisplayName() {
    return <div>waiting</div>;
  }

  function WithName() {
    return <div>waiting</div>;
  }

  function WithNothing() {
    return <div>waiting</div>;
  }

  WithDisplayName.displayName = displayName;
  delete WithNothing.name;

  const InjectedWithDisplayName = injectWaiting(WithDisplayName);
  const InjectedWithName = injectWaiting(WithName);
  const InjectedWithNothing = injectWaiting(WithNothing);

  expect(InjectedWithDisplayName.displayName).toEqual(
    `WithWaiting(${displayName})`
  );
  expect(InjectedWithName.displayName).toEqual(`WithWaiting(${WithName.name})`);
  expect(InjectedWithNothing.displayName).toEqual(`WithWaiting(Component)`);
});
