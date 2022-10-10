$(function () {
    const layer = layui.layer
    const form = layui.form
    loadCateList()

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    function loadCateList() {
        $.ajax({
            method: 'GET',
            url: `http://big-event-vue-api-t.itheima.net/my/cate/list`,
            headers: {
                Authorization: localStorage.getItem('big_news_token')
            },
            success: res => {
                // console.log(res)
                if (res.code !== 0) return layer.msg('获取文章列表失败')
                const htmlStr = template('tpl-cate', res)
                $('[name ="cate_id"]').html(htmlStr)
                // layui 本身的特性 需要多走一步 form.render()
                form.render()
            }
        })
    }

    $('#btnChoose').on('click', function () {
        $('#file').click()
    })

    $('#file').on('change', function (e) {
        const fileList = e.target.files
        if (fileList.length === 0) return layer.msg('请选择文件')
        // console.log(fileList)
        const imgUrl = URL.createObjectURL(fileList[0])
        // console.log(imgUrl)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgUrl)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域



        let state = '已发布'
        $('#btnSave2').on('click', function () {
            state = '草稿'
        })

        $('#formPub').on('submit', function (e) {
            e.preventDefault()
            // 将数据都收集到 formData 里面去
            let fd = new FormData($(this)[0])
            fd.append('state', state)
            // console.log(fd)
            // console.log($(this))

            // 获取裁剪区域的图片
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    fd.append('cover_img', blob)
                    // console.log(blob)

                    $.ajax({
                        method: 'POST',
                        url: 'http://big-event-vue-api-t.itheima.net/my/article/add',
                        data: fd,
                        headers: {
                            Authorization: localStorage.getItem('big_news_token')
                        },
                        contentType: false,
                        processData: false,
                        success: res => {
                            if (res.code !== 0) return layer.msg('发表文章失败')
                            layer.msg('发表文章成功')
                            location.href = '/cate/article_list.html'
                        }
                    })
                })

        })
    })


})