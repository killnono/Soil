/**
 * Created by killnono on 15/12/15.
 */

var onionBook = angular.module('onionBook', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.updateData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/books')
        .success(function (data) {
            $scope.books = data;
            console.log(data);
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    // 添加一本书
    $scope.createBook = function () {

        if ($scope.formData.length() < 1) {
            alert("请输入书名 ")
        } else {
            $http.post('/api/book/create', $scope.formData)
                .success(function (data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    $scope.books = data
                })
                .error(function (data) {
                    $scope.formData = {}
                });
        }
    };


    //更新一本书
    $scope.updateBook = function (book) {
        $http.post('/api/book/update', book)
            .succees(function (data) {
                alert('修改成功');
            })
            .error(function (data) {
                alert('修改失败');
            });
    };

    // 删除一本书
    $scope.deleteBook = function (id) {
        $http.delete('/api/book/' + id)
            .success(function (data) {
                $scope.books = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    //添加一个打包渠道
    $scope.addChannel = function (channel) {
        if (channel == null || channel.length == 0) {
            alert('请输入渠道号!')
        } else {
            $http.get('/api/channel/' + channel)
                .success(function (data) {
                    alert(data);
                })
                .error(function (data) {
                    alert(data);
                });
        }
    };

    // init socket
    $scope.socketInit = function () {
        //1为本地,0为线上
        var env = 0;
        var socketHost = 'http://localhost:3000';
        if (env == 0) {
            socketHost = 'http://ronfe.net:3000';
        }
        var socket = io.connect(socketHost);
        //发送登录消息
        socket.emit('login', {userid: '3232131', username: 'test'});
        //监听消息⌚️
        socket.on('message', function (msg) {
            alert(msg);
        });
        //监听打包完成事件
        socket.on('packageDone', function (url) {
            var result = confirm("apk 已生成完成,是否要下载")
            if (result) {
                window.location.href = url;
            }
        });
    }
}