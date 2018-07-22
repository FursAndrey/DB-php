'use strict';
$(document).ready(function(){
    $(document).on('click', '#reg', startModal);                    //открыть модальное окно для добавления
    $(document).on('click', '#auth', startModal);                   //открыть модальное окно для редактирования
    function startModal(){                                          //открыть модальное окно для добавления/редактирования
        let x = $('<div class="modal"><div class="modalMain"><p>Логин: <input id="login" type="text" name="login"/></p>' +
            '<p>Пароль: <input id="pass" type="password" name="pass"/></p><div id="sendRA">Отправить</div><div id="closeModal">X</div></div></div>');
        $('#box').before(x);                                        //создание модального окна
        let modal = $('.modal');                                    //выбор елемента, который будет удален
        closeModal.onclick = function (){							//функция "скрыть модальное окно"
            modal.remove()											//скрываем модальное окно
        };
        let type = $(this).attr('dataType');
        $('.modal').attr('dataType',type);
    }
    $(document).on('click', '#sendRA', function(){                        //отправить результат редактирования/добавления на сервер
        let type = $('.modal').attr('dataType');
        let buffLogin = $("#login").val();
        let buffPass = $("#pass").val();
        if(buffLogin != '' && buffPass != ''){
            console.log(111);
            var obj;
            if(type ==1){
                obj = new Object({                                      //подготовить запрос на сервер на добавление
                    "operation": 'auth',
                    "login": buffLogin,
                    "pass": buffPass
                });
            }
            if(type == 2){
                obj = new Object({                                      //подготовить запрос на сервер на редактирование
                    "operation": 'reg',
                    "login": buffLogin,
                    "pass": buffPass
                });
            }
            console.log(obj);
            $.ajax({                                                    //отправка асинхронного запроса на сервер
                url: "registr.php",                                     //адрес обработчика
                type: "POST",                                           //метод отправки
                data: obj,                                              //само сообщение
                success: function(data){                                //выполнить если придет ответ
                    let obj = JSON.parse(data);                         //преобразование ответа в объект
                    let y = $('.modal > .modalMain > h6');              //если ранее выводилась ошибка - удалить ее
                    if(y.length == 1){
                        y.remove()
                    }
                    if(obj.status == 0){
                        let x = $('<h6></h6>');
                        x.text(obj.errorText);
                        $('#sendRA').before(x);
                        $("#pass").val('');
                    }
                    else if(obj.status == 'reg' || obj.status == 'auth'){
                        $('#box2').html('');
                        let z = $('<p></p>');
                        z.text('Привет, ' + buffLogin);
                        $('#box2').append(z);
                        z = $('<div id="addTask" dataType="1">Добавить</div><div id="sortTask">Сортировать</div><div id="logOut">Выход</div>' +
                            '<script src="js/task.js"></script>');
                        $('#box2').append(z);
                        $('#closeModal').trigger("click");
                    }
                }
            });
        }
    });
    $(document).on('click', '#logOut', logOut);
    function logOut(){
        let obj = new Object({                                      //подготовить запрос на сервер на добавление
            "operation": 'out'
        });
        $.ajax({
            url: "registr.php",
            type: "POST",
            data: obj,
            success: function(data){
                let obj = JSON.parse(data);
                if(obj.status == 'out'){
                    $('#box2').html('');
                    let z = $('<p>Выполните <span id="auth" dataType = "1">Авторизацию</span> / <span id="reg" dataType = "2">Регистрацию</span></p>');
                    $('#box2').append(z);
                    $('#box1').remove();
                }
            }                                           //
        });
    }
});