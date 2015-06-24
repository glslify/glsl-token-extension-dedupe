# glsl-token-extension-dedupe

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Given a series of GLSL tokens, dedupes any extension declarations and places them at the top of the shader source.

## Usage

[![NPM](https://nodei.co/npm/glsl-token-extension-dedupe.png)](https://nodei.co/npm/glsl-token-extension-dedupe/)

### `dedupe(tokens)`

Modifies `tokens` in place to remove duplicate extension declarations.
Declarations take the following priority from lowest to highest:

* `disable`
* `enable`
* `warn`
* `require`

If a declaration of higher priority in the list exists it will
replace any other declarations. This can cause issues,
for example, if both `disable` and `enable` are used for the
same extension. As such it's recommended that you avoid using
`disable` at all in
[glslify](https://github.com/stackgl/glslify) packages
published to npm.

## Contributing

See [stackgl/contributing](https://github.com/stackgl/contributing) for details.

## License

MIT. See [LICENSE.md](http://github.com/stackgl/glsl-token-extension-dedupe/blob/master/LICENSE.md) for details.
