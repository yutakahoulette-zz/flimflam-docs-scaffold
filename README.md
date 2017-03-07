
```js
const h = require('flimflam/h')
const times = require('ramda/src/times')
const identity = require('ramda/src/identity')
const reduce = require('ramda/src/reduce')
const flyd = require('flimflam/flyd')
const render = require('flimflam/render')
const scaffold = require('flimflam-docs-scaffold')

const init = () => ({ scaffold: scaffold.init() }) 

const lorem = "Lorem ipsum dolor sit amet, a cras mauris ut rhoncus vitae, nunc ullamco, eu scelerisque aliquam vivamus, eget vitae penatibus vivamus. Scelerisque velit felis suspendisse quam eu, mauris lacus lectus leo enim facilisis, etiam vel. Lacinia tincidunt nunc dolores. Nascetur turpis, a fusce imperdiet, urna integer ipsa laoreet, viverra dolor vel libero. Quam lacinia aliquam eu, mi eu nulla diam erat amet. Varius montes purus mauris nulla wisi, adipiscing ut. Duis justo mi cras nec voluptatibus, sunt gravida donec sed."

// returns an object like:
//  {
//    'section 1' : h('p', lorem)
//  , 'section 2' : h('p', lorem)
//  , etc...
//  }
const dictionary = reduce((a, b) => {
    a[`section ${b+=1}`] = h('p', lorem)
    return a
  }, {}, times(identity, 20))

const view = function(state) {
  return h('div', [
  , scaffold.view(state.scaffold, {
      dictionary$: flyd.stream(dictionary)
    , title: 'Demo'
    , header: h('h1.pb-5', 'Demo header')
    })
  ])
}

const container = document.getElementById('container')

render(view, init(), container)
```

