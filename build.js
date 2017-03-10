var h = require('flimflam/h');
var flyd = require('flimflam/flyd');
var url$ = require('flyd-url');
var splitEvery = require('ramda/src/splitEvery');
var map = require('ramda/src/map');
var keys = require('ramda/src/keys');
var addIndex = require('ramda/src/addIndex');
var length = require('ramda/src/length');
var loaded = require('imagesloaded');

var upper = function (txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
};

var hyph = function (txt) {
  return txt.replace(/ /g, '-');
};

var link = function (txt) {
  return h('a.text-decoration-none', { props: { href: '#' + hyph(txt) } }, upper(txt));
};

var navLi = function (id$) {
  return function (txt) {
    return h('li.truncate', { class: { 'is-selected': hyph(txt) === id$() } }, [link(txt)]);
  };
};

var menuLi = function (txt) {
  return h('li.break-word', [link(txt)]);
};

var title = function (txt) {
  return h('h3.mb-3.mt-0.break-word', [h('span.opacity-025', '#'), h('span.pl-1', [link(txt)])]);
};

var nav = function (id$, dict, title) {
  return h('nav.bg-white.sh-1.p-2.sm-hide', [title ? h('h5.p-1.m-0.break-word', title) : '', h('ul.tabs--v', map(navLi(id$), keys(dict)))]);
};

var half = function (arr) {
  var div = Math.ceil(length(arr) / 2);
  return splitEvery(div, arr);
};

var menu = function (id$, dict) {
  var halves = half(keys(dict));
  return h('div.md-hide.lg-hide', [section(h('div.clearfix', [h('ul.col.col-6.mt-0', map(menuLi, halves[0])), halves[1] ? h('ul.col.col-6.mt-0', map(menuLi, halves[1])) : '']), 'menu')]);
};

var toMenu = h('a.small.bg-white.md-hide.lg-hide.sh-2.z-1.fixed.text-decoration-none.center.circle', {
  props: { href: '#menu' },
  style: {
    'bottom': '1rem',
    'right': '1rem',
    'width': '3rem',
    'line-height': '3rem' }
}, 'Menu');

var section = function (content, key) {
  return h('section.bg-white.mb-5.sm-mb-3', { props: { id: hyph(key) } }, [h('div.sh-1.p-2', [title(key), content])]);
};

var init = function () {
  return {
    id$: flyd.map(function (x) {
      return x.hash && x.hash.replace('#', '');
    }, url$)
  };
};

var mapWithIndex = addIndex(map);

var scroll = function (id$) {
  return function (v) {
    var body = document.body;
    loaded(body, function () {
      var sections = v.elm.querySelectorAll('section');

      var inRange = function (scrollTop, ID$) {
        return function (x) {
          if (scrollTop >= x.top && scrollTop <= x.bottom && id$ != x.id) id$(x.id);
        };
      };

      window.addEventListener('scroll', function (_) {

        // breakPoint is 30 rems (root font size * 30)
        var breakPoint = Number(window.getComputedStyle(document.body).getPropertyValue('font-size').replace(/\D/g, '')) * 30;

        // nav is hidden when screen is <= 30rem 
        // so we don't need the scrolling logic 
        if (window.innerWidth <= breakPoint) return;

        var data = mapWithIndex(function (elm, i) {
          return {
            top: elm.offsetTop,
            bottom: sections[i + 1] ? sections[i + 1].offsetTop : body.scrollHeight,
            id: elm.id };
        }, sections);

        map(inRange(body.scrollTop, id$), data);
      });
    });
  };
};

var view = function (state, obj) {
  return h('div.pb-5', { hook: { insert: scroll(state.id$) } }, [nav(state.id$, obj.dictionary$(), obj.title), h('main.sm-p-0', [h('div.max-width-4.px-3.sm-p-0', [obj.header ? h('div.sm-px-2', [obj.header]) : '', menu(state.id$, obj.dictionary$()), h('div', map(function (key) {
    return section(obj.dictionary$()[key], key);
  }, keys(obj.dictionary$())))])]), toMenu]);
};

module.exports = { init: init, view: view };

