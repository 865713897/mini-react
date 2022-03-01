import diff from "./diff";

export default function render(
  virtualDOM,
  container,
  oldDOM = container.firstChild
) {
  // 比对
  diff(virtualDOM, container, oldDOM);
}
