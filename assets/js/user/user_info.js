$(function() {
    const form = layui.form
    const layer = layui.layer 
    form.verify({
        nickname : function(value) {
            if (value.length > 6) {
                return '昵称必须是 1-6 位非空格'
            }
        }
    })
    // 获取用户相关信息
    const initInfo = () => {
        $.ajax ({
            // method : 'GET',
            url : '/my/userinfo',
            success (res) {
                if(res.code !== 0) return layer.msg('请求用户信息失败')
                // console.log(res)
                // 1、给表单进行回显数据
                // form.val('你要指定给哪个表单'，'你要指定的那个值')
                form.val('userForm',res.data)
            }
            
        })
    }
    initInfo()
    // 给重置按钮添加点击事件
    $('#btnReset').on('click',function(e){
    //    阻止默认的重置行为
        e.preventDefault()
        // 重新加载用户信息
        initInfo()
    })


    // 把表单数据打印出来（快速获取表单数据）
    // $(this).serialize() ——> key=value&key=value
    // form.val('userForm') ——> {key : value , key : value}
    // 监听表单的提交行为
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method: 'PUT',
            url : '/my/userinfo',
            data : form.val('userForm'),
            success(res) {
                console.log(res)
                if(res.code !== 0) return layer.msg('更新用户信息失败')
                layer.msg('更新用户信息成功')
                // 刷新一下整体页面
                window.parent.getUserInfo()
            }
        })
        
    })
})