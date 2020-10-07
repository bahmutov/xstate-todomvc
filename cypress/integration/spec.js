/// <reference types="cypress" />
import { inspect } from '@xstate/inspect'

describe('TodoMVC', () => {
  // beforeEach(() => {
  //   // let xstateFrame = Cypress.$('<iframe data-xstate></iframe>')
  //   const thisFrame = window.parent.document.querySelector('.spec-iframe')
  //   inspect({
  //     // opens another Cypress browser window
  //     // with state machine visualization
  //     iframe: false
  //     // iframe: thisFrame,
  //     // url: ''
  //     // iframe: xstateFrame[0]
  //   });
  // })

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
