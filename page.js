const h = require('flimflam/h')
const render = require('flimflam/render')
const scaffold = require('./index.js')

const init = () => {
  return { 
    scaffold: scaffold.init()
  } 
}

const dictionary = {
  'about': h('h1', 'This is the about section')
, 'cool stuff': h('h2', 'xzcv')
, 'dsftuff': h('h2', 'xzcv')
, 'dxcvxcvsftuff': h('h2', 'xzcv')
, 'dxflkajsdlfkjatuff': h('h2', 'xzcv')
}

const view = function(state) {
  return h('div', [
    scaffold.view(state.scaffold, dictionary)
  ])
}

const container = document.getElementById('container')

render(view, init(), container)
