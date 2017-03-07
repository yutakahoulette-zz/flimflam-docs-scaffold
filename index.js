const h = require('flimflam/h')
const flyd = require('flimflam/flyd')
const url$ = require('flyd-url')
const splitEvery = require('ramda/src/splitEvery')
const map = require('ramda/src/map')
const keys = require('ramda/src/keys')
const addIndex = require('ramda/src/addIndex')
const length = require('ramda/src/length')
const loaded = require('imagesloaded')

const upper = txt => txt.charAt(0).toUpperCase() + txt.slice(1)

const hyph = txt => txt.replace(/ /g, '-')

const link = txt => h('a', {props: {href: '#' + hyph(txt)}}, upper(txt))

const navLi = id$ => txt => 
  h('li.truncate', {class: {'is-selected': hyph(txt) === id$()}}, [
    link(txt)
  ])

const contentLi = txt => h('li.break-word', [link(txt)])

const title = txt => 
  h('a.h3.mb-3.bold.break-word', {props: {href: '#' + hyph(txt)}}, [
    h('span.pr-1', upper(txt))
  , h('span.opacity-025', '#')
  ])

const nav = (id$, dict, title) => 
  h('nav.sh-1.p-2.sm-hide', [
    title ? h('h5.p-1.m-0.break-word', title) : ''
  , h('ul.tabs--v', 
      map(navLi(id$), keys(dict))
    )
  ])

const half = arr => {
  const div = Math.ceil(length(arr) / 2)
  return splitEvery(div, arr)
}

const contents = (id$, dict) => {
  const halves = half(keys(dict)) 
  return h('div.mb-5.sm-mb-3.lg-hide.md-hide.p-2', [
    h('h3.mt-0.mb-3', 'Contents')
  , h('div.clearfix', [
      h('ul.col.col-6.mt-0', map(contentLi, halves[0]))
    , halves[1] ? h('ul.col.col-6.mt-0', map(contentLi, halves[1])) : ''
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


const mapWithIndex = addIndex(map)

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
      // breakPoint is 30 rems (root font size * 30)
      const breakPoint = Number(window.getComputedStyle(document.body)
        .getPropertyValue('font-size')
        .replace(/\D/g,'')) * 30 
      // nav is hidden when screen is <= 30rem 
      // so we don't need the scrolling logic 
      if(window.innerWidth <= breakPoint) return 
      map(inRange(body.scrollTop, id$), data)
    })
  })
}

const view = (state, obj) => 
  h('div', {hook: {insert: scroll(state.id$)}}, [
    nav(state.id$, obj.dictionary$(), obj.title)
  , h('main.sm-p-0', [
      h('div.max-width-4.px-3.sm-p-0', [
        obj.header ? obj.header : ''
      , contents(state.id$, obj.dictionary$())
      , h('div', map(key => section(obj.dictionary$()[key], key), keys(obj.dictionary$())))
      ])
    ])
  ])

module.exports = {init, view} 

