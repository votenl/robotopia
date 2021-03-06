const _ = require('lodash')
const effects = require('./effects')
const reducers = require('./reducers')
const p2pPresenter = require('./p2p-presenter')
const Clock = require('@robotopia/clock')

module.exports = ({ hubUrl }) => {
  const presenter = p2pPresenter({
    hubUrl
  })

  const timer = new Clock(1000)

  return {
    namespace: 'presenter',

    state: {
      groupId: null,
      clients: {}, // clients [{ id, code, username }] mapped to their id
      playerNumbers: {}, // maps playerNumbers to Client. eg.: 1->eflajsnf1248dsnf
      displayPlayerPickScreen: false,
      displayWinDialog: false,
      playerCount: 0,
      time: 0
    },

    reducers,

    effects: effects({presenter, timer}),

    subscriptions: {
      p2pConnection: (send) => {
        presenter.onAddClient(({ id }) => send('presenter:addClient', { id }, _.noop))
        presenter.onRemoveClient(({ id }) => send('presenter:removeClient', { id }, _.noop))
        presenter.onMessage((id, { type, data }) =>
          send('presenter:handleMessage', { id, message: { type, data } }, _.noop))
      }
    }
  }
}
