import MiniReact from "./MiniReact";

const container = document.getElementById("root");

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

const modifyDom = (
  <div className="container">
    <h1>你好，MiniReact</h1>
    <h2 data-test="test111">(编码必杀技)</h2>
    <div>
      嵌套1<div>嵌套1.1</div>
    </div>
    <h3>(观察：这个将会被改变)</h3>
    {2 === 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 === 2 && <div>2</div>}
    <span>这是一段被修改的内容</span>
    <button onClick={() => alert("你好!!!!!")}>点击我</button>
    <h3>这个将会被删除</h3>
    2,3
    <input type="text" value="123" />
  </div>
);

function Demo() {
  return <div>test</div>;
}

// MiniReact.render(virtualDom, container);
function Heart(props) {
  const { title } = props;
  return (
    <div>
      &hearts;
      {title}
      <Demo />
    </div>
  );
}

class Alert extends MiniReact.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>Hello React{this.props.title}</div>;
  }
}

MiniReact.render(virtualDom, container);

setTimeout(() => {
  MiniReact.render(modifyDom, container);
}, 2000);

console.log(virtualDom);
