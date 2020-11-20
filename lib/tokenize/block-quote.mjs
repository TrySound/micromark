var blockQuote = {
  tokenize: tokenizeBlockQuoteStart,
  continuation: {tokenize: tokenizeBlockQuoteContinuation},
  exit: exit
}
export default blockQuote

import * as codes from '../character/codes.mjs'
import markdownSpace from '../character/markdown-space.mjs'
import * as constants from '../constant/constants.mjs'
import * as types from '../constant/types.mjs'
import spaceFactory from './factory-space.mjs'

function tokenizeBlockQuoteStart(effects, ok, nok) {
  var self = this

  return start

  function start(code) {
    if (code === codes.greaterThan) {
      if (!self.containerState.open) {
        effects.enter(types.blockQuote, {_container: true})
        self.containerState.open = true
      }

      effects.enter(types.blockQuotePrefix)
      effects.enter(types.blockQuoteMarker)
      effects.consume(code)
      effects.exit(types.blockQuoteMarker)
      return after
    }

    return nok(code)
  }

  function after(code) {
    if (markdownSpace(code)) {
      effects.enter(types.blockQuotePrefixWhitespace)
      effects.consume(code)
      effects.exit(types.blockQuotePrefixWhitespace)
      effects.exit(types.blockQuotePrefix)
      return ok
    }

    effects.exit(types.blockQuotePrefix)
    return ok(code)
  }
}

function tokenizeBlockQuoteContinuation(effects, ok, nok) {
  return spaceFactory(
    effects,
    effects.attempt(blockQuote, ok, nok),
    types.linePrefix,
    constants.tabSize
  )
}

function exit(effects) {
  effects.exit(types.blockQuote)
}
