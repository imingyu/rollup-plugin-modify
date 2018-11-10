const MagicString = require('magic-string')

const escapeRegExp = x => x.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')

module.exports = function modify({
  find,
  replace
}) {
  return {
    name: 'modify',
    transformChunk: (source, options) => {
      find = new RegExp(typeof find === 'string' ? escapeRegExp(find) : find, 'g')
      if (!find.test(source))
        return source

      const s = new MagicString(source)

      find.lastIndex = 0
      let match
      while ((match = find.exec(source)) !== null) {
        s.overwrite(
          match.index,
          match.index + match[0].length,
          typeof replace === 'string'
            ? replace
            : replace.apply(null, match)
        )
      }

      return {
        code: s.toString(),
        map: options.sourcemap ? s.generateMap() : null
      }
    }
  }
}
