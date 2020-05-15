import bunyan from 'bunyan'
import { DateTime } from 'luxon'
import colors from 'colors'

const levelColor = (level) => {
  return {
    10: colors.white,
    20: colors.yellow,
    30: colors.cyan,
    40: colors.magenta,
    50: colors.red
  }[level] || colors.white
}
const levelString = (level) => {
  let name = bunyan.nameFromLevel[level].toUpperCase()
  name = new Array(6 - name.length).join(' ') + name
  return levelColor(level)(name)
}

function MyRawStream () {}
MyRawStream.prototype.write = function (rec) {
  console.log('%s %s %s: %s',
    colors.gray(DateTime.local().setZone('America/Mexico_City').setLocale('es').toFormat('HH:MM:ss.SSS')),
    levelString(rec.level),
    rec.name,
    colors.cyan(rec.msg)
  )
}

export default (config) => {
  return bunyan.createLogger({
    name: config.NAME,
    level: 0,
    streams: [
      {
        level: 'trace',
        stream: new MyRawStream(),
        type: 'raw'
      }
    ]
  })
}
