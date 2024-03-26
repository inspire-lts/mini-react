import React from "./core/React.js";

function Counter({number}) {
  return <div>Counter {number}</div>;
}

function App() {
  return(
    <div>
      lts
      <Counter number={10}></Counter>
      <Counter number={20}></Counter>
    </div>
  )
}

export default App;
