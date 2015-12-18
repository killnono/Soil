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

    // when submitting the add form, send the text to the node API
    $scope.createBook = function () {
        console.log('createBook---');
        if ($scope.formData.length == 0) {
            alert("qingshuru ")
        } else {
            $http.post('/api/book/create', $scope.formData)
                .success(function (data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another

                    console.log('success');
                })
                .error(function (data) {
                    $scope.formData = {}
                    console.log('Error: ' + data);
                });
        }
    };


    $scope.updateBook = function (book) {
        $http.post('/api/book/update', book)
            .succees(function (data) {
                alert('修改成功');
            })
            .error(function (data) {
                alert('修改失败');
            });
    };

    // delete a todo after checking it
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

    $scope.addChannel = function (channel) {
        $http.get('/api/channel/' + channel)
            .success(function (data) {

            })
            .error(function (data) {

            });
    };

}