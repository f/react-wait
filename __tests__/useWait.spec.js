import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { Waiter, useWait } from "../src/index";

Enzyme.configure({ adapter: new Adapter() });

describe("Waiter", () => {
  test("Provides Context", async () => {
    const waiter = mount(<Waiter />);
  });
});
