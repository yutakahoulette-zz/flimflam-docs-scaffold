const h = require('flimflam/h')
const url$ = require('flyd-url')
const ramda = require('ramda')
const render = require('flimflam/render')

const init = () => {
  return { } 
}

const view = function(state) {
  return h('h1', 'asdf')
}

const container = document.getElementById('container')

render(view, init(), container)
