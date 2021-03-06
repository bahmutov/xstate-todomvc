/// <reference types="cypress" />
describe('TodoMVC', () => {
  it('starts with todo text', () => {
    const state = {}
    cy.visit('/', {
      onBeforeLoad(win) {
        win.__xstate__ = {
          register: (x) => {
            state.xstate = x
          },
        }
      },
    })
    // initially
    cy.wrap(state).its('xstate.machine.context').should('deep.equal', {
      todo: 'Learn state machines',
      todos: [],
    })
  })

  it('hydrates from local storage', () => {
    const todos = [
      {
        id: '455de87d-bc9a-4849-b05f-767c5bef7c65',
        title: 'write state machine',
        completed: false,
        ref: { id: '1' },
      },
      {
        id: 'b62e163b-8f2f-4677-a228-9fd28a52a120',
        title: 'test using Cypress',
        completed: true,
        ref: { id: '2' },
        prevTitle: 'test using Cypress',
      },
    ]
    localStorage['todos-xstate'] = JSON.stringify(todos)

    const state = {}
    cy.visit('/', {
      onBeforeLoad(win) {
        win.__xstate__ = {
          register: (x) => {
            state.xstate = x
          },
        }
      },
    })
    // the context is set correctly
    cy.wrap(state).its('xstate.machine.context').should('deep.equal', {
      todo: 'Learn state machines',
      todos,
    })
    // check the DOM
    cy.get('.todo-list li').should('have.length', todos.length)
    todos.forEach((todo, k) => {
      cy.get('.todo-list li label').eq(k).should('have.text', todo.title)
      if (todo.completed) {
        cy.get('.todo-list li').eq(k).should('have.class', 'completed')
      } else {
        cy.get('.todo-list li').eq(k).should('not.have.class', 'completed')
      }
    })
    cy.contains('.todo-count', '1')
  })

  it('adds todos', () => {
    const state = {}
    cy.visit('/', {
      onBeforeLoad(win) {
        win.__xstate__ = {
          register: (x) => {
            state.xstate = x
          },
        }
      },
    })

    cy.wrap(state)
      .its('xstate')
      .invoke('send', { type: 'NEWTODO.COMMIT', value: 'first todo' })
    cy.get('.todo-list li').should('have.length', 1)
  })

  // the second todo never appears
  // NOTE: https://github.com/bahmutov/xstate-todomvc/issues/1
  it.skip('adds 2 todos', () => {
    const state = {}
    cy.visit('/', {
      onBeforeLoad(win) {
        win.__xstate__ = {
          register: (x) => {
            state.xstate = x
          },
        }
      },
    })

    cy.wrap(state)
      .its('xstate')
      .invoke('send', { type: 'NEWTODO.COMMIT', value: 'first todo' })
    cy.get('.todo-list li').should('have.length', 1)

    // hmm, why isn't the second todo added?
    cy.wrap(state)
      .its('xstate')
      .invoke('send', { type: 'NEWTODO.COMMIT', value: 'second todo' })
    cy.get('.todo-list li').should('have.length', 2)
  })

  it('listens to events', () => {
    const state = {}
    cy.visit('/', {
      onBeforeLoad(win) {
        win.__xstate__ = {
          register: (x) => {
            state.xstate = x
          },
        }
      },
    })
    // start listening to xstate events
    cy.wrap(state)
      .its('xstate')
      .invoke('subscribe', (state, event) => cy.stub().as('events')(event))

    // if we add the todo via DOM
    cy.get('.new-todo').clear().type('write better tests{enter}')

    // then we will have the event in the state machine
    cy.get('@events').should('have.been.calledWith', {
      type: 'NEWTODO.COMMIT',
      value: 'write better tests',
    })
  })

  it('works', () => {
    const state = {}
    cy.visit('/', {
      onBeforeLoad(win) {
        win.__xstate__ = {
          register: (x) => {
            state.xstate = x
          },
        }
      },
    })
    // initially
    cy.wrap(state)
      .its('xstate.machine.context')
      .should('deep.equal', {
        todo: 'Learn state machines',
        todos: [],
      })
      .wait(1000) // pause for demo

    // set a different todo text
    cy.wrap(state)
      .its('xstate')
      .invoke('send', { type: 'NEWTODO.CHANGE', value: 'Test using model' })
      .wait(1000) // pause for demo

    // and see it reflected in the DOM
    cy.get('.new-todo')
      .should('have.value', 'Test using model')
      .then(() => {
        cy.wrap(state)
          .its('xstate')
          .invoke('subscribe', (state, event) => cy.stub().as('events')(event))
      })

    // if we add the todo via DOM
    cy.get('.new-todo').type('{enter}').wait(1000) // pause for demo
    // then we will have the event in the state machine
    cy.get('@events').should('have.been.calledWith', {
      type: 'NEWTODO.COMMIT',
      value: 'Test using model',
    })
  })
})
