$(function(){
    // 点击去注册
    $('#go2Reg').on('click',function(){
        $('.login-wrap').hide()
        $('.reg-wrap').show()
    })
    // 点击去登录
    $('#go2Login').on('click',function(){
        $('.login-wrap').show()
        $('.reg-wrap').hide()
    })
})