$(function() {
    // 绑定点击事件
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 绑定点击事件
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    var form = layui.form
    var layer = layui.layer
        // console.log(layui);

    // 通过layui.verify()函数自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须为6-12位，且不能包含空格'],

        // 校验两次密码是否一致
        repwd: function(value) {
            // 通过形参拿到的是确认密码的值
            // 还要拿到密码框中的值，然后进行比较判断
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);

            }
            layer.msg('注册成功，请登录');
            // 模拟人的点击行为，自动跳转到登录界面
            $('#link_login').click()

        })

    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止表单的默认行为
        e.preventDefault()
            // 发起ajax请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败！')
                }
                layer.msg('登陆成功！')
                    // console.log(res.token);
                    // 将登陆成功得到的token存储到localStorage中
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})