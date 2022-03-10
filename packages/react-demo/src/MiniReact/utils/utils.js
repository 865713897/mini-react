// diff比对
export function diff(virtualDOM, container, oldRealDOM) {
  const oldVirtualDOM = oldRealDOM && oldRealDOM._virtualDOM;
  const oldComponent = oldVirtualDOM && oldVirtualDOM.component;
  if (!oldRealDOM) {
    mountElement(virtualDOM, container);
  } else if (
    virtualDOM.type !== oldVirtualDOM.type &&
    typeof virtualDOM.type !== "function"
  ) {
    // 节点类型不同，并且不是组件
    const newElement = createDOMElement(virtualDOM);
    oldRealDOM.parentNode.replaceChild(newElement, oldRealDOM);
  } else if (typeof virtualDOM.type === "function") {
    // 组件
    diffComponent(virtualDOM, oldComponent, oldRealDOM, container);
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
    // 将拥有key属性的子节点放在一起
    let keyedElements = {};
    for (let i = 0, len = oldRealDOM.childNodes.length - 1; i < len; i++) {
      let domElement = oldRealDOM.childNodes[i];
      if (domElement.nodeType === 1) {
        let key = document.getAttribute('key');
        if (key) {
          keyedElements[key] = domElement;
        }
      }
    }
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

// 比对组件
export function diffComponent(virtualDOM, oldComponent, oldRealDOM, container) {
  if (isSameComponent(virtualDOM, oldComponent)) {
    updateComponent(virtualDOM, oldComponent, oldRealDOM, container);
  } else {
    mountElement(virtualDOM, container, oldRealDOM);
  }
}

// 更新组件
export function updateComponent(
  virtualDOM,
  oldComponent,
  oldRealDOM,
  container
) {
  oldComponent.componentWillReceiveProps(virtualDOM.props);
  if (oldComponent.shouldComponentUpdate(virtualDOM.props)) {
    // 未更新前的props
    let preProps = oldComponent.props;
    oldComponent.componentWillUpdate(virtualDOM.props);
    // 更新props
    oldComponent.updateProps(virtualDOM.props);
    // 获取组件返回的最新virtualDOM
    let nextVirtualDOM = oldComponent.render();
    // 更新component组件实例对象
    nextVirtualDOM.component = oldComponent;
    // 比对
    diff(nextVirtualDOM, container, oldRealDOM);
    oldComponent.componentDidUpdate(preProps);
  }
}

// 是否同一组件
export function isSameComponent(virtualDOM, oldComponent) {
  return virtualDOM && virtualDOM.type === oldComponent.constructor;
}

// 删除元素
export function unmountNode(node) {
  node.remove();
}

// 挂载元素
export function mountElement(virtualDOM, container, oldRealDOM) {
  // 如果是function
  if (isFunction(virtualDOM)) {
    mountComponent(virtualDOM, container, oldRealDOM);
  } else {
    // 普通DOM
    mountNavtiveElement(virtualDOM, container, oldRealDOM);
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
export function mountComponent(virtualDOM, container, oldRealDOM) {
  let realVirtualDOM = null;
  let component = null;
  if (isFunctionComponent(virtualDOM)) {
    // 函数组件
    realVirtualDOM = virtualDOM.type(virtualDOM.props || {});
  } else {
    // 类组件
    const newRealVirtualDOM = new virtualDOM.type(virtualDOM.props || {});
    realVirtualDOM = newRealVirtualDOM.render();
    realVirtualDOM.component = newRealVirtualDOM;
    component = realVirtualDOM.component;
  }
  if (component) {
    component.componentDidMount();
    if (component.props && component.props.ref) {
      component.props.ref(component);
    }
  }
  if (isFunction(realVirtualDOM)) {
    mountComponent(realVirtualDOM, container, oldRealDOM);
  } else {
    mountNavtiveElement(realVirtualDOM, container, oldRealDOM);
  }
}

// 渲染普通DOM
export function mountNavtiveElement(virtualDOM, container, oldRealDOM) {
  // 判断旧的dom对象是否存在，如果存在，则删除
  if (oldRealDOM) {
    unmountNode(oldRealDOM);
  }
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

  if (virtualDOM.props && virtualDOM.props.ref) {
    virtualDOM.props.ref(newElement);
  }

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
