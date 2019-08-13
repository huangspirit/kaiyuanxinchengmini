const app = getApp()

const request = (url, options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.host}${url}`,
      method: options.method,
      data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
      header: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      success(request) {
        console.log(request,'22222')
        if (request.statusCode === 200) {
          resolve(request.data)
        } else {
          reject(request.data)
        }
      },
      fail(error) {
        console.log(error)
        reject(error.data)
      }
    })
  })
}

const get = (url, options = {}) => {
  return request(url, { method: 'GET', data: options })
}

const post = (url, options) => {
  return request(url, { method: 'POST', data: options })
}
module.exports = {
  get,
  post
}