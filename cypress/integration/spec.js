/// <reference types="cypress" />
import { inspect } from "@xstate/inspect";

describe('TodoMVC', () => {
  beforeEach(() => {
    // let xstateFrame = Cypress.$('<iframe data-xstate></iframe>')
    const thisFrame = window.parent.document.querySelector('.spec-iframe')
    inspect({
      // opens another Cypress browser window
      // with state machine visualization
      iframe: false
      // iframe: thisFrame,
      // url: ''
      // iframe: xstateFrame[0]
    });
  })

  it('works', () => {
    cy.visit('/', {
      // onBeforeLoad(win) {
      //   const iframe = Cypress.$('<iframe data-xstate></iframe>')
      //   const inspectXState = inspect
      //   debugger
      //   win.eval(`inspectXState({iframe})`)
      // }
    })
  })
})
