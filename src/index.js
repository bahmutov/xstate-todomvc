import React from "react";
import ReactDOM from "react-dom";
import "todomvc-app-css/index.css";
import { inspect } from "@xstate/inspect";

inspect({
  iframe: false
});

import { Todos } from "./Todos";

ReactDOM.render(<Todos />, document.querySelector("#app"));
