import React from 'react'
import ReactDOM from 'react-dom'
import 'todomvc-app-css/index.css'
import { Todos } from './Todos'
// import { inspect } from '@xstate/inspect'

// inspect({
// 	iframe: false,
// })

ReactDOM.render(<Todos />, document.querySelector('#app'))
