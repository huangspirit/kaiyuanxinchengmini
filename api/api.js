const app = getApp()

const request = (url, options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.host}${url}`,
      method: options.method,
      data: options.data ,
      header: options.header,
      success(request) {
        if (request.statusCode === 200) {
          resolve(request.data)
        } else if (request.statusCode === 400){
          if (url =="/api-order/customerCenter/queryOrderInfo"){
            resolve(request.data)
          }else{
            wx.showToast({
              title: request.data.message,
              icon: 'none',
              duration: 2000
            })
          }
          
        } else if (request.statusCode === 401) {
          // 401 说明 token 验证失败
          // 可以直接跳转到登录页面，重新登录获取 token
          wx: wx.removeStorageSync('token')
          wx: wx.removeStorageSync('refreshToken')
          wx: wx.navigateTo({
            url: '/pages/index/index',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
        else {
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

const get = (url, options) => {
  if (wx.getStorageSync('token') != "") {
    return request(url, {
      method: 'GET',
      data: options,
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        "Authorization": "Bearer " + wx.getStorageSync('token')
      }
    })
  } else {
    return request(url, {
      method: 'GET',
      data: options,
      header: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
  }
}
const post = (url, options,header) => {
  if (wx.getStorageSync('token') != "") {
    if(header){
      header={
        ...header,
        'Content-Type': 'application/json; charset=UTF-8',
        "Authorization": "Bearer " + wx.getStorageSync('token')
      }
    }else{
      header={
        'Content-Type': 'application/json; charset=UTF-8',
        "Authorization": "Bearer " + wx.getStorageSync('token')
      }
    }
    return request(url, {
      method: 'POST',
      data: options,
      header: header
    })
  } else {
    return request(url, {
      method: 'POST',
      data: options,
      header: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
  }
}
const postForm = (url, options, header) => {
  console.log(options)
  if (wx.getStorageSync('token') != "") {
    if (header) {
      header = {
        ...header,
        'Content-Type': 'application/x-www-form-urlencoded',
        "Authorization": "Bearer " + wx.getStorageSync('token')
      }
    } else {
      header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Authorization": "Bearer " + wx.getStorageSync('token')
      }
    }
    return request(url, {
      method: 'POST',
      data: options,
      header: header
    })
  } else {
    return request(url, {
      method: 'POST',
      data: options,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
}
const put = (url, options) => {
  return request(url, {
    method: 'PUT',
    data: options,
    header: {
      'Content-Type': 'application/json; charset=UTF-8',
      "Authorization": "Bearer " + wx.getStorageSync('token')
    }
  })
}
module.exports = {
  get,
  post,
  postForm,
  put
}