import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { Waiter, useWait } from "../src/index";
import * as api from "../src/api";

Enzyme.configure({ adapter: new Adapter() });

test("startWaiting", async () => {
  expect(api.startWaiting(new Set(['a']), 'b')).toEqual(new Set(['a', 'b']))
  expect(api.startWaiting(new Set(['a', 'b']), 'c')).toEqual(new Set(['a', 'b', 'c']))
  expect(api.startWaiting(new Set([0, 1]), 2)).toEqual(new Set([0, 1, 2]))
  expect(api.startWaiting(new Set(['a b', 'c d']), 'e f')).toEqual(new Set(['a b', 'c d', 'e f']))
});

test("endWaiting", async () => {
  expect(api.endWaiting(new Set(['a', 'b']), 'b')).toEqual(new Set(['a']))
  expect(api.endWaiting(new Set(['a', 'b', 'c']), 'b')).toEqual(new Set(['a', 'c']))
  expect(api.endWaiting(new Set([0, 1, 2, 3]), 3)).toEqual(new Set([0, 1, 2]))
  expect(api.endWaiting(new Set(['a b', 'c d']), 'a b')).toEqual(new Set(['c d']))
});

test("isWaiting", async () => {
  expect(api.isWaiting(new Set(['a', 'b']), 'b')).toEqual(true)
  expect(api.isWaiting(new Set(['a', 'b', 'c']), 'd')).toEqual(false)
  expect(api.isWaiting(new Set([0, 1, 2, 3]), 4)).toEqual(false)
  expect(api.isWaiting(new Set(['a b', 'c d']), 'a b')).toEqual(true)
});

test("isWaiting", async () => {
  expect(api.anyWaiting(new Set(['a', 'b']))).toEqual(true)
  expect(api.anyWaiting(new Set(['a', 'b', 'c']))).toEqual(true)
  expect(api.anyWaiting(new Set([]))).toEqual(false)
});

test("contextless", async () => {
  function Component() {
    const { startWaiting, endWaiting, isWaiting, anyWaiting, waiters, Wait } = useWait();
    return (<div>
      <button id="start" onClick={() => startWaiting('test')}>start</button>
      <button id="start-2" onClick={() => startWaiting('test-2')}>start</button>
      <button id="end" onClick={() => endWaiting('test')}>end</button>
      <button id="end-2" onClick={() => endWaiting('test-2')}>end</button>
      <div id="is">{isWaiting('test') ? 'true' : 'false'}</div>
      <div id="any">{anyWaiting() ? 'true' : 'false'}</div>
      <div id="waiters">{JSON.stringify([...waiters])}</div>
      <div id="waitComp"><Wait on="test" fallback="Loading">Not Loading</Wait></div>
    </div>);
  }
  const app = mount(<Waiter><Component/></Waiter>);

  expect(app.find('#is').last().html()).toBe('<div id=\"is\">false</div>');
  expect(app.find('#any').last().html()).toBe('<div id=\"any\">false</div>');
  expect(app.find('#waitComp').last().html()).toBe('<div id=\"waitComp\">Not Loading</div>');

  app.find('#start').simulate('click');
  expect(app.find('#is').last().html()).toBe('<div id=\"is\">true</div>');
  expect(app.find('#any').last().html()).toBe('<div id=\"any\">true</div>');
  expect(app.find('#waiters').last().html()).toBe('<div id=\"waiters\">["test"]</div>');
  expect(app.find('#waitComp').last().html()).toBe('<div id=\"waitComp\">Loading</div>');

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

test("contextful", async () => {
  function Component() {
    const { createWaitingContext, anyWaiting, waiters } = useWait();

    const test = createWaitingContext('test')
    const test2 = createWaitingContext('test-2')

    return (<div>
      <button id="start" onClick={() => test.startWaiting()}>start</button>
      <button id="start-2" onClick={() => test2.startWaiting()}>start</button>
      <button id="end" onClick={() => test.endWaiting()}>end</button>
      <button id="end-2" onClick={() => test2.endWaiting()}>end</button>
      <div id="is">{test.isWaiting() ? 'true' : 'false'}</div>
      <div id="any">{anyWaiting() ? 'true' : 'false'}</div>
      <div id="waiters">{JSON.stringify([...waiters])}</div>
      <div id="waitComp"><test.Wait fallback="Loading">Not Loading</test.Wait></div>
    </div>);
  }
  const app = mount(<Waiter><Component/></Waiter>);

  expect(app.find('#is').last().html()).toBe('<div id=\"is\">false</div>');
  expect(app.find('#any').last().html()).toBe('<div id=\"any\">false</div>');
  expect(app.find('#waitComp').last().html()).toBe('<div id=\"waitComp\">Not Loading</div>');

  app.find('#start').simulate('click');
  expect(app.find('#is').last().html()).toBe('<div id=\"is\">true</div>');
  expect(app.find('#any').last().html()).toBe('<div id=\"any\">true</div>');
  expect(app.find('#waiters').last().html()).toBe('<div id=\"waiters\">["test"]</div>');
  expect(app.find('#waitComp').last().html()).toBe('<div id=\"waitComp\">Loading</div>');

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
