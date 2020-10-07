import { createMachine, assign, spawn } from "xstate";
import uuid from "uuid-v4";
import { createTodoMachine } from "./todoMachine";

const createTodo = (title) => {
  return {
    id: uuid(),
    title,
    completed: false
  };
};

export const todosMachine = createMachine({
  id: "todos",
  context: {
    todo: "", // new todo
    todos: [],
    filter: "all"
  },
  initial: "loading",
  states: {
    loading: {
      entry: assign({
        todos: (context) => {
          // "Rehydrate" persisted todos
          return context.todos.map((todo) => ({
            ...todo,
            ref: spawn(createTodoMachine(todo))
          }));
        }
      }),
      always: "ready"
    },
    ready: {}
  },
  on: {
    "NEWTODO.CHANGE": {
      actions: assign({
        todo: (_, event) => event.value
      })
    },
    "NEWTODO.COMMIT": {
      actions: [
        assign({
          todo: "", // clear todo
          todos: (context, event) => {
            const newTodo = createTodo(event.value.trim());
            return context.todos.concat({
              ...newTodo,
              ref: spawn(createTodoMachine(newTodo))
            });
          }
        }),
        "persist"
      ],
      cond: (_, event) => event.value.trim().length
    },
    "TODO.COMMIT": {
      actions: [
        assign({
          todos: (context, event) =>
            context.todos.map((todo) => {
              return todo.id === event.todo.id
                ? { ...todo, ...event.todo, ref: todo.ref }
                : todo;
            })
        }),
        "persist"
      ]
    },
    "TODO.DELETE": {
      actions: [
        assign({
          todos: (context, event) =>
            context.todos.filter((todo) => todo.id !== event.id)
        }),
        "persist"
      ]
    },
    SHOW: {
      actions: assign({
        filter: (_, event) => event.filter
      })
    },
    "MARK.completed": {
      actions: (context) => {
        context.todos.forEach((todo) => todo.ref.send("SET_COMPLETED"));
      }
    },
    "MARK.active": {
      actions: (context) => {
        context.todos.forEach((todo) => todo.ref.send("SET_ACTIVE"));
      }
    },
    CLEAR_COMPLETED: {
      actions: assign({
        todos: (context) => context.todos.filter((todo) => !todo.completed)
      })
    }
  }
});
