/*
* 用户列表
* */

(function() {
    var username = '',
        phone = '',
        page = 1;
    //点击用户列菜单并获取用户列表数据;
    $('#userList').click(function() {
        var url = $(this).attr('id');
        $('.content .page').hide();
        $('#' + url + '_page').show();
    });

    //用户列表的关键词搜索;
    $('#key_btn').click(function() {
        var val = $('#key_content').val();
        if($('#key_type').val() == 1) {
            username = val;
        }else {
            phone = val;
        }
        page = 1;
        getUserListData()
    });

    function getUserListData() {
        $.ajax({
            type: 'get',
            url: '/lhj/admin/api/user/',
            data: 's=userList&page='+page+'&size=40&username='+username+'&phone='+phone,
            success: function(res) {
                console.log(res);
            }
        })
    }
})();