const stringify  = require('glsl-token-string')
const tokenize   = require('glsl-tokenizer')
const test       = require('tape')
const path       = require('path')
const fs         = require('fs')
const extensions = require('./')

const fixtures = {}

fixtures.single = `
#extension GL_OES_standard_derivatives : enable
`

test('glsl-token-extensions: single', t => {
  const processed = stringify(extensions(tokenize(fixtures.single)))
  t.equal(processed.trim(), fixtures.single.trim(), 'extension unmodified')
  t.end()
})

fixtures.duplicate = `
#extension GL_OES_standard_derivatives : enable
#extension GL_OES_standard_derivatives : enable
#extension GL_OES_standard_derivatives : enable
`

test('glsl-token-extensions: duplicate', t => {
  const processed = stringify(extensions(tokenize(fixtures.duplicate)))
  t.equal(processed.trim(), fixtures.single.trim(), 'extension duplicates removed')
  t.end()
})

fixtures.postfix = `
const float a;
#extension GL_OES_standard_derivatives : enable
#extension GL_OES_standard_derivatives : enable
#extension GL_OES_standard_derivatives : enable
`

fixtures.postfixGoal = `
#extension GL_OES_standard_derivatives : enable
const float a;
`

test('glsl-token-extensions: postfix', t => {
  const processed = stringify(extensions(tokenize(fixtures.postfix)))
  t.equal(processed.trim(), fixtures.postfixGoal.trim(), 'extensions should be moved to the top of the file')
  t.end()
})

fixtures.version = `
#version 150
#define PI 3.14
#extension GL_OES_standard_derivatives : enable
const float a;
#extension GL_OES_standard_derivatives : enable
#extension GL_OES_standard_derivatives : enable
const float b;
#extension GL_OES_standard_derivatives : enable
`

fixtures.versionGoal = `
#version 150
#extension GL_OES_standard_derivatives : enable
#define PI 3.14
const float a;
const float b;
`

test('glsl-token-extensions: version', t => {
  const processed = stringify(extensions(tokenize(fixtures.version)))
  t.equal(processed.trim(), fixtures.versionGoal.trim(), 'extensions should still remain below #version declarations')
  t.end()
})

fixtures.multiple = `
#extension first_extension : enable
#extension second_extension : enable
#extension first_extension : enable
#extension third_extension : enable
#extension third_extension : enable
#extension first_extension : enable
`

fixtures.multipleGoal = `
#extension first_extension : enable
#extension second_extension : enable
#extension third_extension : enable
`

test('glsl-token-extensions: multiple extensions', t => {
  const processed = stringify(extensions(tokenize(fixtures.version)))
  t.equal(processed.trim(), fixtures.versionGoal.trim(), 'duplicates removed, order preserved')
  t.end()
})

fixtures.priority = `
#extension should_warn : enable
#extension should_warn : warn
#extension should_warn : disable
#extension should_warn : enable

#extension should_enable : disable
#extension should_enable : enable

#extension should_disable : disable
#extension should_disable : disable

#extension should_require : disable
#extension should_require : require
#extension should_require : warn
#extension should_require : enable
`

fixtures.priorityGoal = `
#extension should_warn : warn
#extension should_enable : enable
#extension should_disable : disable
#extension should_require : require
`

test('glsl-token-extensions: extension priority', t => {
  const processed = stringify(extensions(tokenize(fixtures.priority)))
  t.equal(processed.trim(), fixtures.priorityGoal.trim(), 'extension states are as expected')
  t.end()
})
