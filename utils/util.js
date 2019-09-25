const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getFormat = msec => {
  let ss = parseInt(msec / 1000);
  let ms = parseInt(msec % 1000);
  let mm = 0;
  let hh = 0;
  let day = 0;
  if (ss > 60) {
    mm = parseInt(ss / 60);
    ss = parseInt(ss % 60);
    if (mm > 60) {
      hh = parseInt(mm / 60);
      mm = parseInt(mm % 60);
      if (hh > 24) {
        day = parseInt(hh / 24)
        hh = parseInt(hh % 24)
      }
    }
  }
  ss = ss > 9 ? ss : `0${ss}`;
  mm = mm > 9 ? mm : `0${mm}`;
  hh = hh > 9 ? hh : `0${hh}`;
  day = day > 9 ? day : `0${day}`;
  return day + "天" + hh + "时" + mm + "分" + ss + "秒"
}
module.exports = {
  formatTime: formatTime,
  getFormat: getFormat
}