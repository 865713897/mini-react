import isFunctionComponent from "./isFunctionComponent";
import mountElement from "./mountElement";
import isFunction from "./isFunction";
import mountNavtiveElement from "./mountNavtiveElement";

export default function mountComponent(virtualDOM, container) {
  let nextVirtualDOM = null;
  // 判断组件类型：类组件 ｜ 函数组件
  if (isFunctionComponent(virtualDOM)) {
    nextVirtualDOM = buildFunctionComponent(virtualDOM);
  } else {
    // 类组件
    nextVirtualDOM = buildClassComponent(virtualDOM);
  }
  // mountElement(nextVirtualDOM, container);
  if (isFunction(nextVirtualDOM)) {
    mountComponent(nextVirtualDOM, container);
  } else {
    mountNavtiveElement(nextVirtualDOM, container);
  }
}

function buildFunctionComponent(virtualDOM) {
  return virtualDOM.type(virtualDOM.props || {});
}

function buildClassComponent(virtualDOM) {
  const component = new virtualDOM.type(virtualDOM.props || {});
  return component.render();
}
