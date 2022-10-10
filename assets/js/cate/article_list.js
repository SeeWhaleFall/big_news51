$(function () {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage

    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        let y = dt.getFullYear()
        let m = (dt.getMonth() + 1 + '').padStart(2, '0')
        let d = (dt.getDate() + '').padStart(2, '0')

        let hh = (dt.getHours() + '').padStart(2, '0')
        let mm = (dt.getMinutes() + '').padStart(2, '0')
        let ss = (dt.getSeconds() + '').padStart(2, '0')
        // console.log(`${y}-${m}-${d} ${hh}:${mm}:${ss}`)
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    let qs = {
        pagenum: 1,  // 当前页码值（表示当前是第几页）
        pagesize: 2,  // 当前每页显示多少条
        cate_id: '',   // 当前选择的文章分类
        state: '',      // 当前文章所处的状态，可选值： 已发布，操作都是字符串类型
    }

    // 加载文章列表
    loadArticleList()

    function loadArticleList() {

        $.ajax({
            method: 'GET',
            url: `/my/article/list/?pagenum=${qs.pagenum}&pagesize=${qs.pagesize}&cate_id=${qs.cate_id}&state=${qs.state}`,
            success: res => {
                // console.log(res)
                if (res.code !== 0) return layer.msg('获取文章列表失败')
                const htmlStr = template('tpl-list', res)
                $('tbody').empty().append(htmlStr)

                renderPage(res.total)
                // console.log(res.total)
            }
        })
    }

    loadCateList()

    function loadCateList() {
        $.ajax({
            method: 'GET',
            url: `/my/cate/list`,
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

    $('#form-search').on('submit', function (e) {
        e.preventDefault()

        const cate_id = $('[name = "cate_id"]').val()
        const state = $('[name ="state"]').val()
        qs.cate_id = cate_id
        qs.state = state

        loadArticleList()

    })

    // 渲染分页功能
    function renderPage(total) {
        laypage.render({
            elem: 'test1',//注意，这里的 test1 是 ID，不用加 # 号
            count: total , //数据总数，从服务端得到 
            limit: qs.pagesize,	// 每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            curr: qs.pagenum,  // 当前是第几页
            layout : ['count','limit','prev','page','next','skip' ] ,
            limits: [2, 3, 5, 10, 15,], //  每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框
            // 分页切换时，触发jump回调
            // 触发jump回调的两种方式，
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render()方法，就会触发 jump 回调
            jump(obj, first) {
                // 就是跳跃，跳转的意思
                // 最新的第几页和最新的每页显示多少条  curr limit
                // console.log(first)
                qs.pagenum = obj.curr
                qs.pagesize = obj.limit

                // 如果直接使用的话会出现死循环
                // 应该是用户主动切换页码值的时候去加载列表
                // loadArticleList()
                if(!first) {
                    loadArticleList()
                }
            }
        })
    }


    $('tbody').on('click','.btnDelete',function(){
        const id = $(this).attr('data-id')
        const len = $('.btnDelete').length
        console.log(id)
        layer.confirm('确定删除', {icon: 3, title:'提示'}, function(index){
           
            $.ajax({
                method : 'DELETE',
                url : `/my/article/info/?id=${id}`,
                success : res => {
                    console.log(res)
                    if(res.code !== 0) return layer.msg('删除失败')
                    layer.msg('删除成功')

                    if(len ==  1 ) {
                        qs.pagenum = qs.pagenum == 1 ? qs.pagenum = 1  : qs.pagenum =  qs.pagenum - 1  
                    }
                    loadArticleList()
                }
            })
            
            layer.close(index);
          });   
            
    })
})