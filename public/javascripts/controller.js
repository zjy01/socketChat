/**
 * Created by zjy on 2015/10/4.
 */
$(function () {
    //初始化，连接服务端
    chat.init(function (socket) {
        //socket client响应系列
        //服务端要求起名字
        socket.on('set-name', function () {
            $('#login-modal').modal('show');
        });
        //加载用户列表
        socket.on('user-list', function (users) {
            var userList=$("#user-list");
            var len=users.length;
            var lis='';
            for(var i=0;i<len;i++){
                lis+='<li value="'+users[i]+'">'+users[i]+'</li>';
            }
            userList.html(lis);
            $("#online-num").text(len);
        });
        //加载自己的名字
        socket.on('join-done', function (nickname) {
            var li=$("<li>").attr('value',nickname).text(nickname);
            $("#user-list").append(li);
            $("#username").text(nickname).attr('value',nickname);
            var on=$("#online-num");
            on.text(parseInt(on.text())+1);
            $('#login-modal').modal('hide');

            var msg='<div class="clearfix text-center">'+
                '<div class="msg-server">'+
                '<span>'+nickname+'</span> 加入群聊'+
                '</div></div>';
            var msgList=$(".msg-list-body");
            msgList.append(msg);
            if(2*msgList.height()+msgList[0].scrollTop>=msgList[0].scrollHeight){
                msgList.scrollTop(msgList[0].scrollHeight);
            }
        });

        //有人加入聊天室
        socket.on('user-join', function (nickname) {
            var li=$("<li>").attr('value',nickname).text(nickname);
            $("#user-list").append(li);
            var on=$("#online-num");
            on.text(parseInt(on.text())+1);

            var msg='<div class="clearfix text-center">'+
                    '<div class="msg-server">'+
                    '<span>'+nickname+'</span> 加入群聊'+
                    '</div></div>';
            var msgList=$(".msg-list-body");
            msgList.append(msg);
            if(2*msgList.height()+msgList[0].scrollTop>=msgList[0].scrollHeight){
                msgList.scrollTop(msgList[0].scrollHeight);
            }
        });
        //修改名字的回应
        socket.on('change-name-done', function (oldName,newName) {
            $("#username").text(newName).attr('value',newName);
            var userList=$("#user-list");
            userList.children("li[value='"+oldName+"']").text(newName).attr('value',newName);
            $('#login-modal').modal('hide');

            var msg='<div class="clearfix text-center">'+
                '<div class="msg-server">'+
                '<span>'+oldName+'</span> 修改昵称为 <span>'+newName+'</span>'+
                '</div></div>';
            var msgList=$(".msg-list-body");
            msgList.append(msg);
            if(2*msgList.height()+msgList[0].scrollTop>=msgList[0].scrollHeight){
                msgList.scrollTop(msgList[0].scrollHeight);
            }
        });

        //其他人修改名字
        socket.on('user-change-name', function (oldName,newName) {
            var userList=$("#user-list");
            userList.children("li[value='"+oldName+"']").text(newName).attr('value',newName);

            var msg='<div class="clearfix text-center">'+
                '<div class="msg-server">'+
                '<span>'+oldName+'</span> 修改名字为 <span>'+newName+'</span>'+
                '</div></div>';
            var msgList=$(".msg-list-body");
            msgList.append(msg);
            if(2*msgList.height()+msgList[0].scrollTop>=msgList[0].scrollHeight){
                msgList.scrollTop(msgList[0].scrollHeight);
            }
        });

        //名字设置有问题
        socket.on('name-error', function (msgError) {
            $("#error-msg").text(msgError);
            $("#nickname-error").show();
            $('#nickname-edit').focus();
        });

        //有人退出群聊
        socket.on("user-quit", function (nickname) {
            var userList=$("#user-list");
            userList.children("li[value='"+nickname+"']").remove();
            var on=$("#online-num");
            on.text(parseInt(on.text())-1);

            var msg='<div class="clearfix text-center">'+
                '<div class="msg-server">'+
                '<span>'+nickname+'</span> 退出群聊'+
                '</div></div>';
            var msgList=$(".msg-list-body");
            msgList.append(msg);
            if(2*msgList.height()+msgList[0].scrollTop>=msgList[0].scrollHeight){
                msgList.scrollTop(msgList[0].scrollHeight);
            }
        });
        
        //有人发消息
        socket.on('user-say', function (username,content) {
            var myDate = new Date();
            var mytime=myDate.toLocaleTimeString();

            var msg='<div class="clearfix msg-wrap">'+
                    '<div class="msg-head">'+
                    '<span class="msg-name label label-primary pull-left">'+
                    '<span class="glyphicon glyphicon-user"></span>'+
                    username+ '</span>'+
                    '<span class="msg-time label label-default pull-left">'+
                    '<span class="glyphicon glyphicon-time"></span>'+
                    mytime+'</span>'+'</div>'+
                    '<div class="msg-content well-sm label-info col-lg-7 pull-left">'+
                    content+
                    '</div></div>';
            var msgList=$(".msg-list-body");
            msgList.append(msg);
            if(2*msgList.height()+msgList[0].scrollTop>=msgList[0].scrollHeight){
                msgList.scrollTop(msgList[0].scrollHeight);
            }
        });
        //自己发消息成功
        socket.on('say-done', function (username,content) {
            var myDate = new Date();
            var mytime=myDate.toLocaleTimeString();

            var msg='<div class="clearfix msg-wrap">'+
                '<div class="msg-head">'+
                '<span class="msg-name label label-primary pull-right">'+
                '<span class="glyphicon glyphicon-user"></span>'+
                username+ '</span>'+
                '<span class="msg-time label label-default pull-right">'+
                '<span class="glyphicon glyphicon-time"></span>'+
                mytime+'</span>'+'</div>'+
                '<div class="msg-content well-sm label-success col-lg-7 pull-right text-right">'+
                content+
                '</div></div>';
            var msgList=$(".msg-list-body");
            msgList.append(msg);
            if(2*msgList.height()+msgList[0].scrollTop>=msgList[0].scrollHeight){
                msgList.scrollTop(msgList[0].scrollHeight);
            }
        });

        //页面事件触发区
        //改名字
        $("#nickname-btn").on('click', function () {
           var value= $.trim($("#nickname-edit").val());
            if(!value){
                $("#error-msg").text("请填写昵称");
                $("#nickname-error").show();
                $('#nickname-edit').focus();
                return false;
            }
            if($("#username").attr('value')=='0'){
                chat.setName(value);
            }
            else{
                chat.changeName(value);
            }
        });
        //打开改名字窗口
        $("#username").on('click', function () {
            $("#nickname-error").hide();
            $('#login-modal').modal('show');
        });
        //发送消息
        $("#send-btn").on('click', function () {
            var value= $.trim($("#msg-content").val());
            if(!value){
                alert('不能发送空消息');
                return false;
            }
            $("#msg-content").val('');
            chat.say(value);
        });
    });
});