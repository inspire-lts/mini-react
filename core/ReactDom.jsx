import React from "./React.jsx";

const ReactDom = {
  createRoot(container) {
    return {
      render(App) {
        React.render(App, container);
      },
    };
  },
};

export default ReactDom;
