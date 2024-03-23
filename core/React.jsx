const createElement = (type, props, ...children) => {
  console.log("调用了");
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === "string") {
          return createTextNode(child);
        } else {
          child;
        }
      }),
    },
  };
};

const createTextNode = (nodeValue) => ({
  type: "TEXT_ELEMENT",
  props: {
    nodeValue,
    children: [],
  },
});

function render(el, container) {
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type);

  Object.keys(el.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = el.props[key];
    }
  });

  const children = el.props.children;
  children.forEach((child) => {
    render(child, dom);
  });
  container.append(dom);
}

const React = {
  render,
  createElement,
};

export default React;
