
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

// 根据搜索字分割字符
const hilight_word=(key, word) => {
    let idx = word.indexOf(key.toUpperCase()),
      t = [];
    if (idx > -1) {
      if (idx == 0) {
        t = hilight_word(key, word.substr(key.length));
        t.unshift({
          key: true,
          str: key
        });
        return t;
      }

      if (idx > 0) {
        t = hilight_word(key, word.substr(idx));
        t.unshift({
          key: false,
          str: word.substring(0, idx)
        });
        return t;
      }
    }
    return [{
      key: false,
      str: word
    }];
  }
  module.exports = {
    formatTime: formatTime,
    getFormat: getFormat,
    hilightWord: hilight_word
  }