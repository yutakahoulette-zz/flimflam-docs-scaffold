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

const link = txt => h('a.text-decoration-none', {props: {href: '#' + hyph(txt)}}, upper(txt))

const navLi = id$ => txt => 
  h('li.truncate', {class: {'is-selected': hyph(txt) === id$()}}, [
    link(txt)
  ])

const menuLi = txt => h('li.break-word', [link(txt)])

const title = txt => 
  h('h3.mb-3.mt-0.break-word', [
    h('span.opacity-025', '#')
  , h('span.pl-1', [link(txt)])
  ])

const nav = (id$, dict, title) => 
  h('nav.bg-white.sh-1.p-2.sm-hide', [
    title ? h('h5.p-1.m-0.break-word', title) : ''
  , h('ul.tabs--v', 
      map(navLi(id$), keys(dict))
    )
  ])

const half = arr => {
  const div = Math.ceil(length(arr) / 2)
  return splitEvery(div, arr)
}

const menu = (id$, dict) => {
  const halves = half(keys(dict)) 
  return h('div.md-hide.lg-hide', [
      section(
        h('div.clearfix', [
          h('ul.col.col-6.mt-0', map(menuLi, halves[0]))
        , halves[1] ? h('ul.col.col-6.mt-0', map(menuLi, halves[1])) : ''
        ])
      , 'menu')
    ])
}

const toMenu = 
  h('a.small.bg-white.md-hide.lg-hide.sh-2.z-1.fixed.text-decoration-none.center.circle', {
    props: {href: '#menu'}
  , style: {
    'bottom': '1rem'
  , 'right' : '1rem'
  , 'width' : '3rem'
  , 'line-height' : '3rem'}
  }, 'Menu')

const section = (content, key) => 
  h('section.bg-white.mb-5.sm-mb-3', {props: {id: hyph(key)}}, [
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

      const data = mapWithIndex((elm, i) => ({
          top: elm.offsetTop
        , bottom: sections[i+1] ? sections[i+1].offsetTop : body.scrollHeight 
        , id: elm.id}), sections)

      map(inRange(body.scrollTop, id$), data)
    })
  })
}

const view = (state, obj) => 
  h('div.pb-5', {hook: {insert: scroll(state.id$)}}, [
    nav(state.id$, obj.dictionary$(), obj.title)
  , h('main.sm-p-0', [
      h('div.max-width-4.px-3.sm-p-0', [
        obj.header ? h('div.sm-px-2', [obj.header]) : ''
      , menu(state.id$, obj.dictionary$())
      , h('div', map(key => section(obj.dictionary$()[key], key), keys(obj.dictionary$())))
      ])
    ])
  , toMenu
  ])

module.exports = {init, view} 

