
export const timeidToDate = idToken => {
  const milisecons = getDateObj(idToken)
  return milisecons.toString().split(' ')[2] + '-' + milisecons.toString().split(' ')[1] + '-' + milisecons.toString().split(' ')[3]
}
// en cuanto se pueda cambiar esto por codigo completamente legible
const getTimeInt = (uuidStr) => {
  const uuidArr = uuidStr.split('-')
  const timeStr = [
    uuidArr[ 2 ].substring(1),
    uuidArr[ 1 ],
    uuidArr[ 0 ]].join('')
  return parseInt(timeStr, 16)
}

const getDateObj = (uuidStr) => {
  const inttime = getTimeInt(uuidStr) - 122192928000000000
  const intmillisec = Math.floor(inttime / 10000)
  return new Date(intmillisec)
}
