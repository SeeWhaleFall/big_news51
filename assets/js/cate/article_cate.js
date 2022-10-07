$(function() {
    const layer = layui.layer
    const form = layui.form

    loadCateList()

    function loadCateList() {
        $.ajax({
            method : 'GET',
            url : '/my/cate/list',
            success : (res) => {
                // console.log(res)
                if(res.code !== 0) return layer.msg('获取文章分类失败')
                // layer.msg('获取文章分类成功')
                const htmlStr = template('tpl-cate',res)
                $('tbody').empty().html(htmlStr)
            }
        })
    }

    $('#btnadd').on('click',function(){
        // 打开弹窗
        index =  layer.open({
            type : 1 ,
            title: '添加分类名称',
            area: ['500px', '300px'],
            content: $('#addDialog').html()
          });     
    })

    let Edit = false  // 用来记录当前是什么状态

    $('body').on('submit','#formAdd',function(e){
        e.preventDefault()
        // 区分状态 是修改还是添加
        if(Edit == true) {
        $.ajax({
            method : 'PUT' ,
            url : '/my/cate/info',
            // data : $(this).serialize(),
            data : form.val('formAddFilter'),
            success : res => {
                // console.log(res)
                if (res.code !== 0) return layer.msg('修改分类失败')
                layer.msg('修改分类成功')
                // 刷新列表
                loadCateList()
            }
        })
        }else {
            $.ajax({
                method : 'POST',
                url : '/my/cate/add',
                // data : form.val('formAddFilter'),
                data : $(this).serialize(),
                success : res => {
                    // console.log(res)
                    if (res.code !== 0) return layer.msg('新增分类失败')
                    layer.msg('新增分类成功')
                    // 刷新列表
                    loadCateList()
                }
            })
        }
        // 刷新列表
        // loadCateList()
        // 把状态初始化
        Edit = false
        // 关闭弹窗
        layer.close(index)

    })
    
    // 修改分类
    $('tbody').on('click','.btnEdit',function(){
        // console.log($(this).attr('data-id'))
        // 修改状态
        Edit = true
        index =  layer.open({
            type : 1 ,
            title: '修改分类名称',
            area: ['500px', '300px'],
            content: $('#addDialog').html()
        }); 
        
        const id = $(this).attr('data-id')
          $.ajax({
            method : 'GET',
            url : `/my/cate/info/?id=${id}`,
            success : res => {
                // console.log(res)
                if(res.code !==0 ) return layer.msg('获取分类详情失败')

            // 快速为表单进行赋值
            form.val('formAddFilter',res.data)
            }
          })
    })

    // 删除
    $('tbody').on('click','.btnDelete',function(){
        const result = confirm('确定删除该分类')
        const id = $(this).attr('data-id')
        if(result) {
            $.ajax({
                method : 'DELETE',
                url : `/my/cate/del/?id=${id}`,
                success : res => {
                    // console.log(res)
                    if(res.code !== 0) return layer.msg('删除分类失败')
                    layer.msg('删除分类成功')
                    // 刷新列表
                    loadCateList()                
                }
            })
        }
    })
})