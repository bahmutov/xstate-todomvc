import React from "react";
import ReactDOM from "react-dom";
import "todomvc-app-css/index.css";
import { inspect } from "@xstate/inspect";
import { Todos } from "./Todos";

// inspect({
//   iframe: false
// });

ReactDOM.render(<Todos />, document.querySelector("#app"));
