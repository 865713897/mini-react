import * as _ from "./utils/utils";

// 渲染组件render方法
export default function render(virtualDOM, container, oldRealDOM = container.firstChild) {
  // diff比对
  _.diff(virtualDOM, container, oldRealDOM);
}
