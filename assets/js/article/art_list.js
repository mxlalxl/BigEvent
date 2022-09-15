$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的·过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Data(data)

        var y = dt.getFullYear()
        var m = padZero(dt.getFullMonth() + 1)
        var d = padZero(dt.getData())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + 'd' + ' ' + hh + ':' + mm + ':' + ss

    }

    // 补零
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象，将来请求数据的时候，需要把这个参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示两条
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }
    initTable()
    initCate()
        // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化分类数据
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                var htmlStr = template('tpl-cate', res)
                console.log(htmlStr);

                $('[name=cate_id]').html(htmlStr)
                    // 通知layui重新渲染表单
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取分类和状态表单的值
        // console.log('okk');

        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 把得到的值赋值给q
        q.cate_id = cate_id
        q.state = state
            // 根据筛选条件重新渲染表单
        initTable()
    })

    // 定义渲染分页的数据
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器的Id
            count: total, //总数居的条数
            limit: q.pagesize, //每页显示的数据数
            curr: q.pagenum, //默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 8],

            // 分页发生切换时，出发jump回调
            jump: function(obj, first) {
                // console.log(obj);

                // 把最新的页码值，赋值给q的查询参数
                q.pagenum = obj.curr

                // 把最新的条目数赋值到q的pagesize属性中
                q.pagesize = obj.limit
                    // 根据最新的参数值，渲染表格
                if (!first) {
                    initTable()
                }
            }
        })

    }

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', 'btn-delete', function() {
        // 获取文章的id
        var id = $(this).attr('data-id')
            // 获取删除按钮的数量
        var len = $('.btn-delete').length
            // 删除事件处理
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                        // 删除之后需要判断一下这页是否还有数据
                        // 如果没有数据了，则让页码值-1之后，在调用initTable方法
                    if (len === 1) {
                        // 如果此时len=1，则证明再删除之后，这页就没有数据了
                        // 注意，页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})