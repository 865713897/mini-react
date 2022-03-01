import createDOMElement from "./createDOMElement";

export default function mountNavtiveElement(virtualDOM, container) {
  let newElement = createDOMElement(virtualDOM);
  // 将转换后的DOM对象放在父节点下
  container.appendChild(newElement);
}
