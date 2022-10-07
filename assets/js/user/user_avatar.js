$(function () {
    const layer = layui.layer


    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 上传文件按钮
    $('#btnChoose').on('click', function () {
        // $('#file').click() // 模拟点击 trigger
        $('#file').trigger('click')
    })

    $('#file').on('change', function (e) {
        const fileList = e.target.files  // 伪数组
        if (fileList.length === 0) return layer.msg('请选择图片')

        // 需要转成 blob 格式的图片对象
        const blobUrl = URL.createObjectURL(fileList[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', blobUrl)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
})


        $('#btnUpload').on('click', function () {
            let dataURL = $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 100,
                    height: 100
                })
                .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

            $.ajax({
                method: 'PATCH',
                url: '/my/update/avatar',
                data: {
                    avatar: dataURL
                },
                success(res) {
                    console.log(res)
                    if (res.code !== 0) return layer.msg('更换头像失败')
                    layer.msg('更换头像成功')
                    //  调用父窗口中的渲染页面函数 重新渲染页面
                    window.parent.getUserInfo()
                }
            })

        })
    
})