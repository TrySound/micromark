import test from 'tape'
import chunkedSplice from '../../dist/util/chunked-splice.mjs'

test('chunkedSplice', function (t) {
  var list = [5, 4, 3, 2, 1]
  var lots = [...new Array(140000).keys()]

  t.throws(
    () => [].splice(0, 0, ...lots),
    'baseline: `[].slice` should crash on lots of items'
  )

  chunkedSplice(list, 0, 0, [])

  t.deepEqual(
    list,
    [5, 4, 3, 2, 1],
    'should not mutate the array for no deletes, no inserts'
  )

  list = [5, 4, 3, 2, 1]

  chunkedSplice(list, 1, 2, [9, 99, 999])

  t.deepEqual(list, [5, 9, 99, 999, 2, 1], 'should mutatefor deletes, inserts')

  list = [5, 4, 3, 2, 1]

  chunkedSplice(list, -3, 2, [9, 99, 999])

  t.deepEqual(
    list,
    [5, 4, 9, 99, 999, 1],
    'should mutate the list w/ a negative start'
  )

  chunkedSplice(list, 100, 3, [10, 11, 12])

  t.deepEqual(
    list,
    [5, 4, 9, 99, 999, 1, 10, 11, 12],
    'should delete items for a too big start'
  )

  chunkedSplice(list, -100, 3, [6])

  t.deepEqual(
    list,
    [6, 99, 999, 1, 10, 11, 12],
    'should delete items w/ a negative start'
  )

  list = [42, 10, 11, 12, 13, 43]

  chunkedSplice(list, 1, 0, lots)

  t.deepEqual(
    list,
    [42, ...lots, 10, 11, 12, 13, 43],
    'should handle lots of inserts just fine'
  )

  list = [42, 10, 11, 12, 13, 43]

  chunkedSplice(list, 1, 4, lots)

  t.deepEqual(
    list,
    [42, ...lots, 43],
    'should remove and still handle lots of inserts just fine'
  )

  t.end()
})
