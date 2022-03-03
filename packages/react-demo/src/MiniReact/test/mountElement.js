import mountNavtiveElement from "./mountNavtiveElement";
import isFunction from "./isFunction";
import mountComponent from "./mountComponent";

export default function mountElement(virtualDOM, container) {
  if (isFunction(virtualDOM)) {
    // Component
    mountComponent(virtualDOM, container);
  } else {
    // NativeElement
    mountNavtiveElement(virtualDOM, container);
  }
}
