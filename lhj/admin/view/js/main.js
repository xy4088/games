//页码;
function paging(options) {
    var total = options.total,
        page = options.page,
        box = options.box,
        handler = options.handler,
        str = '';
    if(page == 1) {
        str += '<ul class="page-number"><li class="disabled"><a>首页</a></li><li class="disabled"><a><<</a></li>';
    }else {
        str += '<ul class="page-number"><li data-page="1"><a>首页</a></li><li data-page="1"><a><<</a></li>';
    }
    for(var i = 1 ; i <= total ; i++) {
        if( i == page ) {
            str += '<li data-page="'+i+'" class="active"><a>'+i+'</a></li>';
        }else {
            str += '<li data-page="'+i+'"><a>'+i+'</a></li>';
        }
    }
    if(page == total) {
        str += '<li class="disabled"><a>>></a></li><li class="disabled"><a>尾页</a></li></ul>';
    }else {
        str += '<li data-page="'+total+'"><a>>></a></li><li data-page="'+total+'"><a>尾页</a></li></ul>';
    }
    $(box).html(str);
    $(box + ' li').click(function() {
        var page = $(this).attr('data-page');
        if(page) {
            handler(page);
        }
    })
}

/*
 * 首页
 * */
(function() {
    $('#index').click(function() {
        $('.content .page').hide();
        $('#index_page').show();
        $('.nav').removeClass('active');
        $(this).addClass('active');
    });
})();

/*
 * 用户列表
 * */
(function() {
    var username = '',
        phone = '';
    //点击用户列菜单并获取用户列表数据;
    $('#userList').click(function() {
        $('.content .page').hide();
        $('#userList_page').show();
        $('.nav').removeClass('active');
        $(this).addClass('active');
    });

    //用户列表的关键词搜索;
    $('#key_btn').click(function() {
        var val = $('#key_content').val();
        if($('#key_type').val() == 1) {
            username = val;
        }else {
            phone = val;
        }
        getUserListData(1);
    });

    //获取用户列表数据;
    function getUserListData(page) {
        $.ajax({
            type: 'get',
            url: '/lhj/admin/api/user/',
            data: 's=userList&page='+page+'&size=40&username='+username+'&phone='+phone,
            success: function(data) {
                var res = JSON.parse(data);
                if(res.code == 0) {
                    paging({
                        total: Math.floor(res.data.total/40) + 1,
                        page: res.data.page,
                        box: '#userPaging',
                        handler: getUserListData
                    });
                    var list = res.data.list,
                        str = '<tr><th>排名</th><th>姓名</th><th>电话</th><th>分数</th><th>第一次登录时间</th></tr>';
                    for(var i = 0 ; i < list.length ; i++) {
                        str += '<tr><td>'+(i+1)+'</td><td>'+list[i].name+'</td><td>'+list[i].phone+'</td><td>'+list[i].score+'</td><td>'+list[i].time+'</td></tr>'
                    }
                    $('#user_list').html(str);
                }else {
                    alert(res.message);
                }
            }
        })
    }
})();

/*
 * 游戏记录;
 * */
(function() {
    var username = '',
        phone = '';
    //点击用户列菜单并获取用户列表数据;
    $('#logList').click(function() {
        $('.content .page').hide();
        $('#logList_page').show();
        $('.nav').removeClass('active');
        $(this).addClass('active');
    });

    //用户列表的关键词搜索;
    $('#log_key_btn').click(function() {
        var val = $('#log_key_content').val();
        if($('#log_key_type').val() == 1) {
            username = val;
        }else {
            phone = val;
        }
        getLogListData(1);
    });

    //获取用户列表数据;
    function getLogListData(page) {
        $.ajax({
            type: 'get',
            url: '/lhj/admin/api/user/',
            data: 's=userList&page='+page+'&size=40&username='+username+'&phone='+phone,
            success: function(data) {
                var res = JSON.parse(data);
                if(res.code == 0) {
                    paging({
                        total: Math.floor(res.data.total/40) + 1,
                        page: res.data.page,
                        box: '#logPaging',
                        handler: getLogListData
                    });
                    var list = res.data.list,
                        str = '<tr><th>排名</th><th>姓名</th><th>电话</th><th>分数</th><th>第一次登录时间</th></tr>';
                    for(var i = 0 ; i < list.length ; i++) {
                        str += '<tr><td>'+(i+1)+'</td><td>'+list[i].name+'</td><td>'+list[i].phone+'</td><td>'+list[i].score+'</td><td>'+list[i].time+'</td></tr>'
                    }
                    $('#log_list').html(str);
                }else {
                    alert(res.message);
                }
            }
        })
    }
})();