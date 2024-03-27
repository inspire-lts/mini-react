import React from "./core/React.js";

let count = 10;
function Counter({ number }) {
  const handleDemo = () => {
    console.log("clickkkk");
    count++;
    React.update();
  };
  return (
    <div>
      Counter {count}
      <button onClick={handleDemo}>clickk</button>
    </div>
  );
}

function App() {
  return (
    <div>
      lts
      <Counter number={10}></Counter>
    </div>
  );
}

export default App;
