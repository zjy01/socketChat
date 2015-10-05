/**
 * Created by zjy on 2015/10/2.
 */
var io=require('socket.io')();
exports.listen= function (_server) {
    return io.listen(_server);
};
var chat={
  users:[],
    usersLen:0,
    //删除用户
    deleteUser:function(nickname){
        var self=this;
        for(var i=0;i<self.usersLen;i++){
            if(self.users[i]==nickname){
                self.users.splice(i,1);
                self.usersLen--;
            }
        }
    },
    //添加用户
    addUser: function (_socket,nickname) {
        var self=this;
        var re=self.checkName(_socket,nickname);
        if(re===true){
            self.users.push(nickname);
            _socket.nickname=nickname;
            self.usersLen++;
            return 1;
        }
        else{
            return 0;
        }
    },
    changeName: function (_socket,oldname,nickname) {
        var self=this;
        var re=self.checkName(_socket,nickname);
        if(re===true){
            for(var i=0;i<self.usersLen;i++){
                if(self.users[i]==oldname){
                    self.users[i]=nickname;
                    _socket.nickname=nickname;
                    self.usersLen++;
                    return 1;
                }
            }
        }
        else{
            return 0;
        }
    },
    //检查昵称
    checkName: function (_socket,nickname) {
        var self=this;
        nickname=nickname.trim();
        var nameLen=nickname.length;
        if(nameLen<4 || nameLen>16){
            return _socket.emit('name-error','昵称长度要求在4-16之间');
        }
        if(_socket.nickname==nickname){
            return _socket.emit('name-error','你的名字并未更改');
        }
        for(var i=0;i<self.usersLen;i++){
            if(self.users[i]==nickname){
                return _socket.emit('name-error','此昵称已被占用');
            }
        }
        return true;
    }
};
io.on('connection', function (_socket) {
    console.log(_socket.id+': connection');
    //触发客户端请求用户列表
    _socket.emit('user-list',chat.users);
    //触发客户端提示起聊天昵称
    _socket.emit('set-name');
    //发送服务器信息
    _socket.emit('server-msg',"欢迎来到Quanta聊天室");
    //断开连接
    _socket.on('disconnect', function () {
        console.log(_socket.id+': disconnect');
        if(_socket.nickname != null && _socket.nickname!=''){
            //通知所有_socket触发user-quit
            _socket.broadcast.emit('user-quit',_socket.nickname);
            chat.deleteUser(_socket.nickname);
        }
    });
    //用户加入
    _socket.on('join', function (nickname) {
        var re=chat.addUser(_socket,nickname);
        if(re){
            //通知自己
            _socket.emit('join-done',nickname);
            //通知所有人
            _socket.broadcast.emit('user-join',nickname);
        }
    });
    //修改昵称
    _socket.on('change-name',function(newName){
        var oldName=_socket.nickname;
        var re=chat.changeName(_socket,oldName,newName);
        if(re){
            //通知所有人
            _socket.emit('change-name-done',oldName,newName);
            //通知所有人
            _socket.broadcast.emit('user-change-name',oldName,newName);
        }
    });

    _socket.on('say', function (content) {
        if(!_socket.nickname){
            return _socket.emit('set-name');
        }
        content=content.trim();
        //发送给所有人
        _socket.broadcast.emit('user-say',_socket.nickname,content);
        //通知自己
        return _socket.emit('say-done', _socket.nickname,content);
    });
});