// diff比对
export function diff(virtualDOM, container, oldRealDOM) {
  const oldVirtualDOM = oldRealDOM && oldRealDOM._virtualDOM;
  if (!oldRealDOM) {
    mountElement(virtualDOM, container);
  } else if (
    virtualDOM.type !== oldVirtualDOM.type &&
    typeof virtualDOM.type !== "function"
  ) {
    // 节点类型不同，并且不是组件
    const newElement = createDOMElement(virtualDOM);
    oldRealDOM.parentNode.replaceChild(newElement, oldRealDOM);
  } else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {
    // 同一类型
    if (virtualDOM.type === "text") {
      // 更新文本属性
      updateTextNode(virtualDOM, oldVirtualDOM, oldRealDOM);
    } else {
      // 更新元素属性
      updateElementAttributes(oldRealDOM, virtualDOM, oldVirtualDOM);
    }
    // 对比子节点
    virtualDOM.children.forEach((child, index) => {
      diff(child, oldRealDOM, oldRealDOM.childNodes[index]);
    });
    // 删除节点
    if (oldVirtualDOM.children.length > virtualDOM.children.length) {
      for (
        let i = oldVirtualDOM.children.length - 1;
        i > virtualDOM.children.length - 1;
        i--
      ) {
        unmountNode(oldRealDOM.childNodes[i]);
      }
    }
  }
}

// 删除元素
export function unmountNode(node) {
  node.remove();
}

// 挂载元素
export function mountElement(virtualDOM, container) {
  // 如果是function
  if (isFunction(virtualDOM)) {
    mountComponent(virtualDOM, container);
  } else {
    // 普通DOM
    mountNavtiveElement(virtualDOM, container);
  }
}

// 是否function
export function isFunction(virtualDOM) {
  return virtualDOM && typeof virtualDOM.type === "function";
}

// 是函数组件还是类组件
export function isFunctionComponent(virtualDOM) {
  const type = virtualDOM.type;
  return (
    type && isFunction(virtualDOM) && !(type.prototype && type.prototype.render)
  );
}

// 渲染函数｜类组件
export function mountComponent(virtualDOM, container) {
  let realVirtualDOM = null;
  if (isFunctionComponent(virtualDOM)) {
    // 函数组件
    realVirtualDOM = virtualDOM.type(virtualDOM.props || {});
  } else {
    // 类组件
    const newRealVirtualDOM = new virtualDOM.type(virtualDOM.props || {});
    realVirtualDOM = newRealVirtualDOM.render();
    realVirtualDOM.component = newRealVirtualDOM;
  }
  if (isFunction(realVirtualDOM)) {
    mountComponent(realVirtualDOM, container);
  } else {
    mountNavtiveElement(realVirtualDOM, container);
  }
}

// 渲染普通DOM
export function mountNavtiveElement(virtualDOM, container) {
  const newElement = createDOMElement(virtualDOM);
  container.appendChild(newElement);
  const component = virtualDOM.component;
  if (component) {
    component.setDOM(newElement);
  }
}

// 创建DOM元素
export function createDOMElement(virtualDOM) {
  let newElement = null;
  const { type, props } = virtualDOM || {};
  if (type === "text") {
    // 文本节点
    newElement = document.createTextNode(props.textContent);
  } else {
    // 元素节点
    newElement = document.createElement(type);
    updateElementAttributes(newElement, virtualDOM);
  }
  newElement._virtualDOM = virtualDOM;

  virtualDOM.children.forEach((child) => {
    mountElement(child, newElement);
  });
  return newElement;
}

// 更新文本节点
export function updateTextNode(virtualDOM, oldVirtualDOM, oldRealDOM) {
  if (virtualDOM.props.textContent !== oldVirtualDOM.props.textContent) {
    oldRealDOM.textContent = virtualDOM.props.textContent;
    oldRealDOM._virtualDOM = virtualDOM;
  }
}

// 更新DOM属性
export function updateElementAttributes(
  newElement,
  virtualDOM,
  oldVirtualDOM = {}
) {
  // 获取该节点对应的props
  const newProps = virtualDOM.props || {};
  const oldProps = oldVirtualDOM.props || {};
  Object.keys(newProps).forEach((propName) => {
    if (propName !== "children") {
      // 属性值
      const newPropsValue = newProps[propName];
      // 旧属性值
      const oldPropsValue = oldProps[propName];
      if (newPropsValue !== oldPropsValue) {
        if (propName.slice(0, 2) === "on") {
          // 事件属性
          newElement.addEventListener(
            propName.slice(2).toLowerCase(),
            newPropsValue
          );
          if (oldPropsValue) {
            // 删除原有事件，更新新事件
            newElement.removeEventListener(
              propName.slice(2).toLowerCase(),
              oldPropsValue
            );
          }
        } else if (propName === "value" || propName === "checked") {
          newElement[propName] = newPropsValue;
        } else if (propName === "className") {
          newElement.setAttribute("class", newPropsValue);
        } else if (propName === "style") {
          Object.keys(newPropsValue).forEach((styleName) => {
            newElement.style[styleName] = newPropsValue[styleName];
          });
        } else {
          newElement.setAttribute(propName, newPropsValue);
        }
      }
    }
  });

  // 属性被删除
  Object.keys(oldProps).forEach((propName) => {
    // 该属性是否存在于新props中
    const newPropsValue = newProps[propName];
    if (!newPropsValue) {
      // 如果不存在，代表该属性被删除
      if (propName.slice(0, 2) === "on") {
        newElement.removeEventListener(
          propName.slice(2).toLowerCase(),
          oldProps[propName]
        );
      } else if (propName !== "children") {
        newElement.removeAttribute(propName);
      }
    }
  });
}
