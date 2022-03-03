import MiniReact from "./MiniReact";

const root = document.getElementById("root");
const virtualDom = (
  <div className="container">
    <h1>你好，MiniReact</h1>
    <h2 data-test="test">(编码必杀技)</h2>
    <div>
      嵌套1<div>嵌套1.1</div>
    </div>
    <h3>(观察：这个将会被改变)</h3>
    {2 === 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 === 2 && <div>2</div>}
    <span>这是一段内容</span>
    <button onClick={() => alert("你好")}>点击我</button>
    <h3>这个将会被删除</h3>
    2,3
    <input type="text" value="12ddd3" />
  </div>
);

const virtualDom1 = (
  <div className="container">
    <h1>你好，MiniReact</h1>
    <h2 data-test="test">(编码必杀技)</h2>
    <div>
      嵌套1<div>嵌套1.1</div>
    </div>
    <h3>(观察：这个将会被改变)</h3>
    {2 === 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 === 2 && <div>2</div>}
    <span>这是一段内容（被删除）</span>
    <button onClick={() => alert("你好！！！")}>点击我</button>
    <h6>这个将会被删除</h6>
    2,3
    <div>增加的</div>
    <input type="text" value="1111" />
  </div>
);

function Demo1(props) {
  console.log(props, "props");
  return (
    <div className="demo1">
      demo1
      <span>&heart;</span>
    </div>
  );
}

class Demo2 extends MiniReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Default Title",
    };
  }
  // 点击按钮
  onBtnClick = () => {
    this.setState({
      title: "Change Title",
    });
  };
  render() {
    console.log(this.state.title);
    return (
      <div className="demo2">
        <span style={{ color: "red", fontSize: "24px" }}>demo2</span>
        <div>
          <div style={{ color: "green", fontSize: "32px" }}>
            {this.state.title}
          </div>
          <button onClick={this.onBtnClick}>更改title</button>
        </div>
      </div>
    );
  }
}

MiniReact.render(<Demo2 />, root);
// MiniReact.render(virtualDom, root);
// setTimeout(() => {
//   MiniReact.render(virtualDom1, root);
// }, 2000);
console.log(virtualDom);
