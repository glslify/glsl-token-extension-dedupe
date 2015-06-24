module.exports = extensions

var priority = {
  disable: 0,
  enable: 1,
  warn: 2,
  require: 3
}

function extensions(tokens) {
  var state = {}

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]
    if (token.type !== 'preprocessor') continue
    var data = parse(token.data)
    if (!data) continue

    tokens.splice(i--, 1)
    if (tokens[i+1].type === 'whitespace') {
      tokens[i+1].data = tokens[i+1].data.replace('\n', '')
    }

    if (!state[data.ext]) {
      state[data.ext] = data.state
      continue
    }

    var next = state[data.ext]
    var prev = data.state
    if (next === prev) continue

    state[data.ext] = priority[next] > priority[prev]
      ? next
      : prev
  }

  for (var i = 0; i < tokens.length; i++) {
    var type = tokens[i].type
    var data = tokens[i].data
    if (type === 'whitespace') continue
    if (type === 'preprocessor') {
      if (/^\s*?\#version/g.test(data)) continue
      if (/^\#define GLSLIFY \d/g.test(data)) continue
    }

    var keys = Object.keys(state)

    for (var j = keys.length - 1; j >= 0; j--) {
      var name = keys[j]

      tokens.splice(i, 0, {
        type: 'whitespace',
        data: '\n'
      })

      tokens.splice(i, 0, {
        data: '#extension ' + name + ' : ' + state[name],
        type: 'preprocessor'
      })
    }

    break
  }

  return tokens
}

function parse(data) {
  var matched = data.match(
    /^\#extension\s+([^:\s]+)\s+?:\s+?(enable|disable|warn|require)/
  )

  if (!matched) return false

  return {
    ext: matched[1],
    state: matched[2]
  }
}
