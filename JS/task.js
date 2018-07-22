'use strict';
$(document).ready(function(){
    var thisElem;                                       //
    $(document).on('click', '.del', function(){         //установка события на класс "дел" - запрос на удаление
        let elem = $(this).parent();                    //получить родителя елемента
        let taskID = elem.attr('dataID');               //получить его идентификатор
        let obj = new Object({                          //подготовить запрос на сервер
                "operation": 'delete',                  //
                "taskID": taskID                        //
        });                                             //
        $.ajax({                                        //отправка асинхронного запроса на сервер
            url: "task.php",                            //адрес обработчика
            type: "POST",                               //метод отправки
            data: obj,                                  //само сообщение
            success: function(data){                    //выполнить если придет ответ
                let obj = JSON.parse(data);             //преобразование ответа в объект
                if(obj.delete == 1){                    //проверка ответа: выплнено ли удаление
                    elem.remove();                      //если выполнено - удалить со страницы
                }                                       //
            }                                           //
        });                                             //
    });                                                 //
    $(document).on('click', '#addTask', startModal);                //открыть модальное окно для добавления
    $(document).on('click', '.red', startModal);                    //открыть модальное окно для редактирования
    function startModal(){                                          //открыть модальное окно для добавления/редактирования
        // let x = $('<div class="modal"><div class="modalMain">Тема: <input id="themeTask" type="text" name="theme"/><br/>' +
        //     '<textarea id="taskText" name="taskText" placeholder="Введите задачу" rows="5" cols="50"/></textarea><br/>' +
        //     '<p>Срок: <input id="deadLine" type="text" name="deadLine" placeholder="число-месяц-год"/><br/></p>' +
        //     '<div id="send">Отправить</div><div id="closeModal">X</div></div></div>');

        let x = $('<div class="modal"><div class="modalMain">Тема: <input id="themeTask" type="text" name="theme"/><br/>' +
            '<textarea id="taskText" name="taskText" placeholder="Введите задачу" rows="5" cols="50"/></textarea><br/>' +
            '<p>Срок: <input type="date" id="deadLine" name="deadLine" max="2038-01-19" min="2018-01-01" /><br/></p>' +
            '<div id="send">Отправить</div><div id="closeModal">X</div></div></div>');
        $('#box').before(x);                                        //создание модального окна
        let modal = $('.modal');                                    //выбор елемента, который будет удален
        closeModal.onclick = function (){							//функция "скрыть модальное окно"
            modal.remove()											//скрываем модальное окно
        };                                                          //
        let type = $(this).attr('dataType');                        //
        $('.modal').attr('dataType',type);                          //todo дата устанавливается не более 19-01-2038;
        if(type == 2){                                              //
            let taskID = $(this).parent().attr('dataID');           //получить родителя елемента
            let buff = $(this).parent();                            //получить элемент содержащий искомую задачу
            let buffThemeTask = buff.children('h2').text();         //получить и вставить в формы текст редактируемой задачи
            let buffTaskText = buff.children('p').text();           //
            let buffDeadLine = buff.children('time').text();        //
            buffDeadLine = buffDeadLine.split(' ');                 //
            $("#themeTask").attr("value", buffThemeTask);           //
            $("#taskText").text(buffTaskText);                      //
            $("#themeTask").attr("dataTaskID", taskID);             //установка ИД редактируемой задачи
            $("#deadLine").attr("value", buffDeadLine[1]);          //
            thisElem = $(this);                                     //
        }                                                           //
    }                                                               //
    $(document).on('click', '#send', function(){                        //отправить результат редактирования/добавления на сервер
        let type = $('.modal').attr('dataType');                        //
        let buffThemeTask = $("#themeTask").val();                      //
        let buffTaskText = $("#taskText").val();                        //
        let buffDeadLine =  $("#deadLine").val();                       //
        if(buffThemeTask != '' && buffTaskText != '' && (buffDeadLine.length == 10 || buffDeadLine == 'Неограничено')){
            if(buffDeadLine == 'Неограничено'){                         //
                buffDeadLine = 0;                                       //
            }                                                           //
            var obj;                                                    //
            if(type ==1){                                               //
                obj = new Object({                                      //подготовить запрос на сервер на добавление
                    "operation": 'insertInto',                          //
                    "themeTask": buffThemeTask,                         //
                    "taskText": buffTaskText,                           //
                    "deadLine": buffDeadLine                            //
                });                                                     //
            }                                                           //
            if(type == 2){                                              //
                var taskID = $("#themeTask").attr("dataTaskID");        //
                obj = new Object({                                      //подготовить запрос на сервер на редактирование
                    "operation": 'update',                              //
                    "taskID": taskID,                                   //
                    "themeTask": buffThemeTask,                         //
                    "taskText": buffTaskText,                           //
                    "deadLine": buffDeadLine                            //
                });                                                     //
            }                                                           //
            $.ajax({                                                    //отправка асинхронного запроса на сервер
                url: "task.php",                                        //адрес обработчика
                type: "POST",                                           //метод отправки
                data: obj,                                              //само сообщение
                success: function(data){                                //выполнить если придет ответ
                    let obj = JSON.parse(data);                         //преобразование ответа в объект
                    var elem;                                           //
                    if(obj.update == 1){                                //проверка ответа: выплнено ли редактирование
                        elem = $(thisElem);                             //получить блок редактируемой задачи
                        let buffDeadLine = $("#deadLine").val();        //подготовка и запись даты
                        buffDeadLine = 'Срок: ' + buffDeadLine;         //
                        elem.parent().children('time').text(buffDeadLine);
                    }                                                   //
                    if(obj.insertInto == 1){                            //проверка ответа: выплнено ли добавление
                        elem = $('<div><h2></h2><time></time><p></p><div class="red" dataType="2">Редактировать</div><div class="del">Х</div></div>');
                        $('#box1').prepend(elem);                       //создание модального окна
                        elem.attr('dataID',obj.taskID);                 //
                        let buffDeadLine = $("#deadLine").val();        //
                        buffDeadLine = 'Срок: ' + buffDeadLine;         //
                        elem.children('time').text(buffDeadLine);       //переписать дату
                    }                                                   //
                    let buffThemeTask = $("#themeTask").val();          //
                    elem.children('h2').text(buffThemeTask);            //переписать заголовок
                    let buffTaskText = $("#taskText").val();            //
                    elem.children('p').text(buffTaskText);              //переписать тело задачи
                    $('#closeModal').trigger("click");                  //закрыть модальное окно - имитация клика
                }                                                       //
            });                                                         //
        }                                                               //
    });                                                                 //
    loadPage();                                                     //отображение задач при загрузке страницы
    function loadPage() {                                           //
        let obj = new Object({                                      //подготовить запрос на сервер
            "operation": 'load'                                     //
        });                                                         //
        $.ajax({                                                    //отправка асинхронного запроса на сервер
            url: "task.php",                                        //адрес обработчика
            type: "POST",                                           //метод отправки
            data: obj,                                              //само сообщение
            success: function(data){                                //выполнить если придет ответ
                showTask(data);                                     //
            }                                                       //
        });                                                         //
    }                                                               //
    $(document).on('click', '#sortTask', startModalSort);           //открыть модальное окно для сортировки
    function startModalSort(){                                      //
        let x = $('<div class="modal"><div class="modalMain"><p><select name="test" id="sortElem"><option disabled>Выберите способ сортировки</option>' +
            '<option value="id">id</option><option value="deadLine">deadLine</option><option value="headTask">headTask</option>' +
            '<option value="textTask">textTask</option></select></p><div id="sendSort">Отправить</div><div id="closeModal">X</div></div></div>');
        $('#box').before(x);                                        //создание модального окна
        let modal = $('.modal');                                    //выбор елемента, который будет удален
        closeModal.onclick = function (){							//функция "скрыть модальное окно"
            modal.remove()											//скрываем модальное окно
        };                                                          //
    }                                                               //
    $(document).on('click', '#sendSort', function() {   //отправить результат редактирования/добавления на сервер
        let elem = $('#sortElem').val();                //
        let obj = new Object({                          //подготовить запрос на сервер
            "operation": 'sort',                        //
            "sortElem": elem                            //
        });                                             //
        $.ajax({                                        //отправка асинхронного запроса на сервер
            url: "task.php",                            //адрес обработчика
            type: "POST",                               //метод отправки
            data: obj,                                  //само сообщение
            success: function (data){                   //выполнить если придет ответ
                let box1 = $('#box1');                  //
                box1.remove();                          //
                showTask(data);                         //
                $('#closeModal').trigger("click");      //закрыть модальное окно - имитация клика
            }                                           //
        });                                             //
    });                                                 //
    function showTask(data){                                //
        let obj = JSON.parse(data);                         //преобразование ответа в объект
        let box1 = $('<div id="box1"></div>');              //
        $('#box').after(box1);                              //
        for(let i = obj.length-1; i > -1; i--){             //
            let elem = $('<div><h2></h2><time></time><p></p><div class="red" dataType="2">Редактировать</div><div class="del">Х</div></div>');
            $('#box1').prepend(elem);                       //создание модального окна
            elem.attr('dataID',obj[i].id);                  //
            elem.children('h2').text(obj[i].headTask);      //
            elem.children('p').text(obj[i].textTask);       //
            let date = new Date(obj[i].deadLine * 1000);    //перевести дату в нормальный формат
            let strDate;                                    //
            let strMount;                                   //
            if(date.getDate() == "1" || date.getDate() == "2" || date.getDate() == "3" || date.getDate() == "4" || date.getDate() == "5" ||
                date.getDate() == "6" || date.getDate() == "7" || date.getDate() == "8" || date.getDate() == "9"){
                strDate = "0" + date.getDate();             //
            }else{                                          //
                strDate = date.getDate();                   //
            }                                               //
            if(date.getMonth() == "1" || date.getMonth() == "2" || date.getMonth() == "3" || date.getMonth() == "4" || date.getMonth() == "5" ||
                date.getMonth() == "6" || date.getMonth() == "7" || date.getMonth() == "8"){
                strMount = "0" + (date.getMonth() + 1);     //
            }else{                                          //
                strMount = (date.getMonth() + 1);           //
            }                                               //
            let buffDeadLine = 'Срок: ' + strDate + "-" + strMount + "-" + date.getFullYear();
            elem.children('time').text(buffDeadLine);       //
        }                                                   //
    }                                                       //
});