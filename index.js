const h = require('flimflam/h')
const flyd = require('flimflam/flyd')
const url$ = require('flyd-url')
const R = require('ramda')
const loaded = require('imagesloaded')

const upper = txt => txt.charAt(0).toUpperCase() + txt.slice(1)
const hyph = txt => txt.replace(/ /g, '-')

const link = id$ => txt => 
  h('li', {class: {'is-selected': hyph(txt) === id$()}}, [
    h('a.block', {props: {href: '#' + hyph(txt)}}, upper(txt))
  ])

const title = txt => 
  h('a.block.h3.mb-3.bold', {props: {href: '#' + hyph(txt)}}, [
    h('span.pr-1', upper(txt))
  , h('span.opacity-025', '#')
  ])

const nav = (id$, dict) => 
  h('nav.sh-1.p-2.sm-hide', [
    h('ul.tabs--v', 
      R.map(link(id$), R.keys(dict))
    )
  ])


const half = arr => {
  const div = Math.ceil(R.length(arr) / 2)
  return R.splitEvery(div, arr)
}

const contents = (id$, dict) => {
  const halves = half(R.keys(dict)) 
  return h('div.mb-5.sm-mb-3.lg-hide.md-hide.p-2', [
    h('h3.mt-0.mb-3', 'Contents')
  , h('div.clearfix', [
      h('ul.col.col-6.mt-0', R.map(link(id$), halves[0]))
    , h('ul.col.col-6.mt-0', R.map(link(id$), halves[1]))
    ])
  ])
}

const section = (content, key) => 
  h('section.mb-5.sm-mb-3', {props: {id: hyph(key)}}, [
    h('div.sh-1.p-2', [
      title(key)
    , content 
    ])
  ])

const init = () => ({
  id$: flyd.map(x => x.hash && x.hash.replace('#', ''), url$) 
})


const mapWithIndex = R.addIndex(R.map)

const scroll = id$ => v => {
  const body = document.body
  loaded(body, () => {
    const sections = v.elm.querySelectorAll('section') 

    const data = mapWithIndex((elm, i) => ({
        top: elm.offsetTop
      , bottom: sections[i+1] ? sections[i+1].offsetTop : body.scrollHeight 
      , id: elm.id}), sections)

    const inRange = (scrollTop, ID$) => x => {
      if(scrollTop >= x.top && scrollTop <= x.bottom && id$ != x.id)
      id$(x.id)
    }

    window.addEventListener('scroll', _ => {
      if(window.innerWidth <= 576) return 
      R.map(inRange(body.scrollTop, id$), data)
    })

    if(id$()) {
      window.location.hash = '' 
      window.location.hash = id$()
    }
  })
}

const view = (state, dict) => 
  h('div', {hook: {insert: scroll(state.id$)}}, [
    nav(state.id$, dict)
  , h('main.sm-p-0', [
      h('div.max-width-4.px-3.sm-p-0', [
        contents(state.id$, dict)
      , h('div', R.map(key => section(dict[key], key), R.keys(dict)))
      ])
    ])
  ])


module.exports = {init, view} 


