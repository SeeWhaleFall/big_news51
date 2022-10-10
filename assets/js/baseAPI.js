// 每次发起请求之前都会真正经过的地方

$.ajaxPrefilter(function(config){
    // 将 key = value 形式的数据，转成 json 格式的字符串
    const format2Json = (source) => {
        let target = {}
        source.split('&').forEach((el )=> {
            let kv = el.split('=')
            // 需要对 value 进行解码操作 因为浏览器会把 @ ——> %40  需要把它转换回来
            target[kv[0]] = decodeURIComponent(kv[1])
        })
        return JSON.stringify(target)
    }

    // if (config.url.indexOf('/my/' !== -1)) {
    //     config.headers = {
    //         Authorization: localStorage.getItem('token') || ''
    //     }
    // }
    // 统一设置基准地址
    config.url = 'http://big-event-vue-api-t.itheima.net' + config.url
//    统一设置请求头 Content-Type 值
    config.contentType = 'application/json'
    // 统一设置请求的参数 - post 请求
    config.data =  config.data && format2Json(config.data) 



     // 统一设置请求头（有条件的添加）
  // 请求路径中有 /my 这样字符串的需要添加
  // indexOf startsWith endsWith includes 包含，包括的意思
  if (config.url.includes('/my')) {
    // 经过调试，headers 属性是自定义的属性
    config.headers = {
      Authorization: localStorage.getItem('big_news_token') || ''
    }
  }

  // 统一添加错误回调  或 complete 回调
  config.error = function (err) {
    if (
      err.responseJSON?.code === 1 &&
      err.responseJSON?.message === '身份认证失败！'
    ) {
      // 进次处的话，可以认为请求有误了
      localStorage.clear()
      location.href = '/login.html'
      
    }
  }
  
})

