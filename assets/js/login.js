$(function(){
    // 从 layui 上面导入  form
    const form = layui.form
    const layer = layui.layer
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


    form.verify({
        pasd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
        repsd : function(value) {
            if($('#password').val() !== value)  {
                return '两次密码不一致'
            }
        }
    })

    // 将 key = value 形式的数据，转成 json 格式的字符串
    const format2Json = (source) => {
        let target = {}
        source.split('&').forEach((el )=> {
            let kv = el.split('=')
            target[kv[0]] = kv[1]
        })
        return JSON.stringify(target)
    }

    $('#formReg').on('submit',function(e) {
        e.preventDefault()
        $.ajax({
            method : 'POST',
            url : '/api/reg',
            // contentType : 'application/json' ,
            // data : JSON.stringify({
            //     username: $('#formReg [name=username]').val(),
            //     password : $('#formReg [name=password]').val(),
            //     repassword : $('#formReg [name=repassword]').val()
            // }),
            data : ($(this).serialize()),
            success(res) {
                if(res.code !== 0) return layer.msg(res.message)

                layer.msg(res.message)
                console.log(res)
                $('#go2Login').click()
            }
            
        })
    })


    $('#formLogin').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method : 'POST',
            url : '/api/login',
            // contentType : 'application/json' ,
            // data : JSON.stringify({
            //     username: $('#formReg [name=username]').val(),
            //     password : $('#formReg [name=password]').val(),
            //     repassword : $('#formReg [name=repassword]').val()
            // }),
            data : ($(this).serialize()),
            success(res) {
                if(res.code !== 0) return layer.msg(res.message)
                // console.log(res)
                localStorage.setItem('big_news_token',res.token)
                location.href = '/home.html'
            }
            
        })
    })
})