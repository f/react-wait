import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { Waiter, useWait } from "../dist/use-wait";
import * as api from "../src/api";

Enzyme.configure({ adapter: new Adapter() });

test("startWaiting", async () => {
  expect(api.startWaiting(['a'], 'b')).toEqual(['a', 'b'])
  expect(api.startWaiting(['a', 'b'], 'c')).toEqual(['a', 'b', 'c'])
  expect(api.startWaiting([0, 1], 2)).toEqual([0, 1, 2])
  expect(api.startWaiting(['a b', 'c d'], 'e f')).toEqual(['a b', 'c d', 'e f'])
});

test("endWaiting", async () => {
  expect(api.endWaiting(['a', 'b'], 'b')).toEqual(['a'])
  expect(api.endWaiting(['a', 'b', 'c'], 'b')).toEqual(['a', 'c'])
  expect(api.endWaiting([0, 1, 2, 3], 3)).toEqual([0, 1, 2])
  expect(api.endWaiting(['a b', 'c d'], 'a b')).toEqual(['c d'])
});

test("isWaiting", async () => {
  expect(api.isWaiting(['a', 'b'], 'b')).toEqual(true)
  expect(api.isWaiting(['a', 'b', 'c'], 'd')).toEqual(false)
  expect(api.isWaiting([0, 1, 2, 3], 4)).toEqual(false)
  expect(api.isWaiting(['a b', 'c d'], 'a b')).toEqual(true)
});

test("isWaiting", async () => {
  expect(api.anyWaiting(['a', 'b'])).toEqual(true)
  expect(api.anyWaiting(['a', 'b', 'c'])).toEqual(true)
  expect(api.anyWaiting([])).toEqual(false)
});

test("context", async () => {
  function Component() {
    const { startWaiting, endWaiting, isWaiting, anyWaiting, waiters } = useWait();
    return (<div>
      <button id="start" onClick={() => startWaiting('test')}>start</button>
      <button id="start-2" onClick={() => startWaiting('test-2')}>start</button>
      <button id="end" onClick={() => endWaiting('test')}>end</button>
      <button id="end-2" onClick={() => endWaiting('test-2')}>end</button>
      <div id="is">{isWaiting('test') ? 'true' : 'false'}</div>
      <div id="any">{anyWaiting() ? 'true' : 'false'}</div>
      <div id="waiters">{JSON.stringify(waiters)}</div>
    </div>);
  }
  const app = mount(<Waiter><Component/></Waiter>);

  expect(app.find('#is').last().html()).toBe('<div id=\"is\">false</div>');
  expect(app.find('#any').last().html()).toBe('<div id=\"any\">false</div>');

  app.find('#start').simulate('click');
  expect(app.find('#is').last().html()).toBe('<div id=\"is\">true</div>');
  expect(app.find('#any').last().html()).toBe('<div id=\"any\">true</div>');
  expect(app.find('#waiters').last().html()).toBe('<div id=\"waiters\">["test"]</div>');

  app.find('#start-2').simulate('click');
  expect(app.find('#any').last().html()).toBe('<div id=\"any\">true</div>');
  expect(app.find('#waiters').last().html()).toBe('<div id=\"waiters\">["test","test-2"]</div>');

  app.find('#end').simulate('click');
  expect(app.find('#is').last().html()).toBe('<div id=\"is\">false</div>');
  expect(app.find('#any').last().html()).toBe('<div id=\"any\">true</div>');
  expect(app.find('#waiters').last().html()).toBe('<div id=\"waiters\">["test-2"]</div>');

  app.find('#end-2').simulate('click');
  expect(app.find('#is').last().html()).toBe('<div id=\"is\">false</div>');
  expect(app.find('#any').last().html()).toBe('<div id=\"any\">false</div>');
  expect(app.find('#waiters').last().html()).toBe('<div id=\"waiters\">[]</div>');
})
