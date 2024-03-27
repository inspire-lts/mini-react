const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        console.log(child);
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
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
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  };
  nextWorkOfUnit = wipRoot;
}
let wipRoot = null;
let currentRoot = null;
let nextWorkOfUnit = null;
function workLoop(deadline) {
  let showYield = false;

  while (!showYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    showYield = deadline.timeRemaining() < 1;
  }

  if (!nextWorkOfUnit && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if ((fiber.effectTag = "update")) {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function updateProps(dom, nextProps, prevProps) {
  // 1. 老节点有，新节点没有 ==》删除
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });

  //2. 新节点有，老节点没有==》添加
  //3. 新节点有，老节点有==》修改

  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase();
          dom.removeEventListener(eventType, prevProps[key]);
          dom.addEventListener(eventType, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      } else {
        dom[key] = nextProps[key];
      }
    }
  });
}

function createDom(type) {
  console.log(type);
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;

    let newFiber;
    if (isSameType) {
      //update
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: "update",
        alternate: oldFiber,
      };
    } else {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: null,
        effectTag: "placement",
      };
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    updateProps(dom, fiber.props, {});
  }
  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}
function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";

  if (!isFunctionComponent) {
    updateHostComponent(fiber);
  } else {
    updateFunctionComponent(fiber);
  }

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

function update() {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  };
  nextWorkOfUnit = wipRoot;
}
requestIdleCallback(workLoop);

const React = {
  render,
  createElement,
  update,
};

export default React;
