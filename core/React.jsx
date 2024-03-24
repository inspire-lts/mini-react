const createElement = (type, props, ...children) => {
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
  newWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
}

let newWorkOfUnit = null;
function workLoop(deadline) {
  let showYield = false;

  while (!showYield && newWorkOfUnit) {
    newWorkOfUnit = performWorkOfUnit(newWorkOfUnit);
    showYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function initChild(fiber) {
  const children = fiber.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}
function performWorkOfUnit(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    fiber.parent.dom.append(dom);

    updateProps(dom, fiber.props);
  }

  // 3. 转换链表，设置指针
  initChild(fiber);

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }

  if (fiber.sibling) {
    return fiber.sibling;
  }

  return fiber.parent?.sibling;
}
requestIdleCallback(workLoop);

const React = {
  render,
  createElement,
};

export default React;
