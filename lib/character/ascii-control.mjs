export default asciiControl

import * as codes from './codes.mjs'

// Note: EOF is seen as ASCII control here, because `null < 32 == true`.
function asciiControl(code) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code < codes.space || code === codes.del
  )
}
