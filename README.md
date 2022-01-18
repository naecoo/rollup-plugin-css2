# rollup-plugin-css2

## Install

```bash
npm add rollup-plugin-css2 --save-dev
```

## Usage

```javascript
// rollup.config.js
import css from 'rollup-plugin-css2';

export default {
	// ... other option

	plugins: [
      css({ output: 'output.css' })
    ]
};
```

The configuration above will pack all CSS file and generate `output.css`


## Options

### `output`
Type: `String` | `Function`

if `output` is string, it represents the CSS file name.

if `output` is function, it will be called during the Rollup generate hook.

```javascript
{
  output(bundleCss, styles) {
    // first argument is CSS source code.
    // second argument is a Map object. The file name is used as `key`, and the corresponding css code is used as `value`
  }
}
```


### `include`

Type: `Array`

default: `['**/*.css']`

Filters files that **do not match** Glob expressions. By default all CSS files are matched.


### `exclude`

Type: `Array`

default: `[]`

Filters files that **do match** the `exclude` Glob expressions.


### `transformOptions`

Type: `Object`

default:
```javascript
{
  // Whether to enable minification 
  minify: false,
  // The browser targets for the generated code
  targets: {},
  // Whether to enable various draft syntax
  drafts: {
    nesting: false
  }
};
```

This plugin using [`@parcel-css`](https://github.com/parcel-bundler/parcel-css) as CSS parser. We can change the parser's options, but only three options are currently supported, with more to come.

Check out more details in @parcel-css [docs](https://github.com/parcel-bundler/parcel-css/blob/master/node/index.d.ts)

## Todo

- Support more `@parcel-css` option


## References

- [parcel-css](https://github.com/parcel-bundler/parcel-css)
- [rollup-plugin](https://rollupjs.org/guide/en/#using-plugins)
- [rollup-plugin-development](https://rollupjs.org/guide/en/#plugin-development)
