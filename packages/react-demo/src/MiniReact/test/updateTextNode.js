export default function updateTextNode(virtualDOM, oldVirtualDOM, oldDOM) {
  if (virtualDOM.props.textContent !== oldVirtualDOM.props.textContent) {
    // 内容是否相等
    oldDOM.textContent = virtualDOM.props.textContent;
    oldDOM._virtualDOM = virtualDOM;
  }
}
