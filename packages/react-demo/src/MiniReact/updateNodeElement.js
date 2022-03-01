export default function updateNodeElement(
  newElement,
  virtualDOM,
  oldVirtualDOM = {}
) {
  // 获取该节点对应的props属性
  const newProps = virtualDOM.props || {};
  const oldProps = oldVirtualDOM.props || {};
  Object.keys(newProps).forEach((propName) => {
    // 属性值
    const newPropsValue = newProps[propName];
    // 旧属性值
    const oldPropsValue = oldProps[propName];
    if (newPropsValue !== oldPropsValue) {
      if (propName.slice(0, 2) === "on") {
        // 事件属性
        const eventName = propName.toLowerCase().slice(2);
        newElement.addEventListener(eventName, newPropsValue);
        if (oldPropsValue) {
          // 删除原有事件处理函数
          newElement.removeEventListener(eventName, oldPropsValue);
        }
      } else if (propName === "value" || propName === "checked") {
        newElement[propName] = newPropsValue;
      } else if (propName !== "children") {
        // 不是children
        if (propName === "className") {
          newElement.setAttribute("class", newPropsValue);
        } else {
          // 普通属性
          newElement.setAttribute(propName, newPropsValue);
        }
      }
    }
    // 判断属性被删除的情况
    Object.keys(oldProps).forEach((propName) => {
      const newPropsValue = newProps[propName];
      const oldPropsValue = oldProps[propName];
      if (!newPropsValue) {
        // 属性被删除
        if (propName.slice(0, 2) === "on") {
          const eventName = propName.toLowerCase().slice(2);
          newElement.removeEventListener(eventName, oldProps[propName]);
        } else if (propName !== "children") {
          newElement.removeAttribute(propName);
        }
      }
    });
  });
}
