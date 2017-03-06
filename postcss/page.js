module.exports = {
  use: [
    'postcss-import'
  , 'postcss-cssnext'
  , 'cssnano']
, 'local-plugins' : true
, input: 'page.css'
, output: 'page.min.css'
}

