layer = layui.layer
$(function() {
    getUserInfo()
}

)


// var const 的区别？
// 由 var 声明或者 function 关键字声明的变量会默认存在 window 全局变量上
// 但是 let / const 不会
// 如 const getUserInfo = () =

function getUserInfo() {
    $.ajax({
        method : 'GET',
        url : '/my/userinfo',
        headers : {
            Authorization : localStorage.getItem('big_news_token')

        },
        success(res) {
            if(res.code !== 0) return layer.msg(res.message)
            // 按需渲染头像
            renderAvatar(res)
        }
    })
}

function renderAvatar(res) {
    if (res.data.user_pic ) {
        $('.text-avatar').hide()
        $('.user-box img').attr('src',res.data.user_pic).show()
    }else {
        $('.layui-nav-img').hide()
        // 显示文字头像，取 username 属性的第一个字母
        // 取 nickname 和 username
        const name = res.data.nickname  || res.data.username
        // const char = res.data.username.charAt(0).toUpperCase()
        const char = name[0].toUpperCase()
        $('.text-avatar').css('display','flex').html(char).show()
    }
    $('.text').html(`欢迎  ${res.data.username}`)
}

// 实现退出操作
$('#btnLogout').on('click', function () {
    // layer.confirm
    // const result = confirm('您确认要退出吗？')
    // if (result) {
    //   // 1、token 需要移除
    //   localStorage.removeItem('big_news_token')
    //   // localStorage.clear()
    //   // 2、页面需要跳转到登录页
    //   location.href = '/login.html'
    // }
    layer.confirm(
      '您确认要退出吗？',
      { icon: 3, title: '提示' },
      function (index) {
        // 1、token 需要移除
        localStorage.removeItem('big_news_token')
        // localStorage.clear()
        // 2、页面需要跳转到登录页
        location.href = '/login.html'
        // close 是固定写法，关闭弹框的时候
        layer.close(index)
      }
    )
  })