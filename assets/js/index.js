$(function() {
    // 调用getUserInfo获取用户信息
    getUserInfo()
    var layer = layui.layer
        // 实现退出功能
    $('#btnLogout').on('click', function() {
        // 提示用户是否退出登录
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            // 只有点击了确定才会调用这个回调函数，点取消没有任何操作
            // 1.清空本地的token
            localStorage.removeItem('token')
                // 2.重新跳转到登录页面
            location.href = '/login.html'
        })
    })
})

// 获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败')
                }
                // 调用renderAvatar渲染用户的头像
                renderAvatar(res.data)
            }
            // complete: function(res) {
            //     // console.log('comp');
            //     // console.log(res);
            //     // 通过res.responseJSON拿到服务器响应回来的数据
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 1.强制清空token
            //         localStorage.removeItem('token')
            //             // 2.跳转到登录界面
            //         location.href = '/login.html'

        //     }


        // }
    })

}

// 渲染用户头像函数
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username
        // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 3.渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()

    } else {
        // 3.2渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }

}