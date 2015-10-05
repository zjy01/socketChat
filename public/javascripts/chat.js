/**
 * Created by zjy on 2015/10/4.
 */
var chat={
    _socket:null,
    nickname:null,
    users:[],
    init: function (callback) {
        var self=this;
        var server='http://'+window.location.host;
        self._socket=io(server);
        callback(self._socket);
    },
    setName: function (nickname) {
        var self=this;
        self._socket.emit('join',nickname);
    },
    disconnect: function (nickname) {
        var self=this;
        self._socket.emit('disconnect',nickname);
    },
    changeName: function (nickname) {
        var self=this;
        self._socket.emit('change-name',nickname);
    },
    say: function (content) {
        var self=this;
        self._socket.emit('say',content);
    }
};