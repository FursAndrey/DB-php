<?php
    session_start();
    ini_set('display_errors', 1);	                            //1 - показывать ошибки, 0 - скрывать
    error_reporting(E_ALL);
    if($_POST != []){
        if($_POST['operation'] == 'out'){
            if(!empty($_SESSION['userID'])){   //если сессия установлена - убиваем ее
                session_destroy();
                session_abort();
            }
            $mas = [
                "status" => 'out',
            ];
            $json_data = json_encode($mas);
            echo $json_data;
        }
        else if($_POST['operation'] != '' && $_POST['login'] != '' && $_POST['pass'] != ''){
            require_once ('dbm.php');
            $db = new dataBase();
            if ($_POST['operation'] == 'auth') {                                      //если получена задача удалить запись
                $buff = $_POST;
                $login = $buff['login'];
                if (myFormValid($login, 10)) {                                  //проверка длинны логина
                    $rez = $db -> selectWhereSort('users','login',$login);
                    $pass = $buff['pass'];                                           //получение пароля из базы
                    if (myFormValid($pass, 10)){                              //если введенный пользователем пароль короче 10 символов - продолжаем
                        $pass = md5($pass);                                         //хеш пароля
                        if ($pass != $rez[0]['password']){                            //сравниваем пароль от пользователя и из базы
                            $errorText = "Данные введены не верно";
                            $mas = [
                                "status" => 0,
                                "errorCode" => 4,
                                "errorText" => $errorText,
                            ];
                        } else {
                            $_SESSION['userID'] = $rez[0]['id'];                       //если все верно - устанавливаем авторизацию
                            $mas = [
                                "status" => 'auth',
                            ];
                        }
                    }
                    else{
                        $errorText = 'Пароль слишком длинный';
                        $mas = [
                            "status" => 0,
                            "errorCode" => 2,
                            "errorText" => $errorText,
                        ];
                    }
                } else {
                    $errorText = 'Логин слишком длинный';
                    $mas = [
                        "status" => 0,
                        "errorCode" => 3,
                        "errorText" => $errorText,
                    ];
                }
                $json_data = json_encode($mas);
            }
            else if ($_POST['operation'] == 'reg'){
                $login = $_POST['login'];
                $pass = $_POST['pass'];
                if(myFormValid($login, 10)){                                    //если логин не более 10 символов - продолжаем регистрацию
                    $rez = $db -> selectWhereSort('users','login',$login);
                    if($rez != []){                                                    //если логин в базе есть - выводим ошибку
                        $errorText = "Данный логин уже используется!!!!";
                        $mas = [
                            "status" => 0,
                            "errorCode" => 1,
                            "errorText" => $errorText,
                        ];
                    }
                    else{
                        if(myFormValid($pass, 10)){                             //если пароль не более 10 символов - продолжаем
                            $pass = md5($pass);                                        //хеш пароля
                            $rez = $db -> insertUs($login,$pass);
                            $_SESSION['userID'] = $rez['usID'];
                            $mas = [
                                "status" => 'reg',
                            ];
                        }
                        else {                                                         //если пароль длиннее 10 символов - выводим ошибку
                            $errorText = 'Пароль слишком длинный';
                            $mas = [
                                "status" => 0,
                                "errorCode" => 2,
                                "errorText" => $errorText,
                            ];
                        }
                    }
                }
                else{                                                                  //если логин длиннее 10 символов - выводим ошибку
                    $errorText = 'Логин слишком длинный';
                    $mas = [
                        "status" => 0,
                        "errorCode" => 3,
                        "errorText" => $errorText,
                    ];
                }
                $json_data = json_encode($mas);
            }
            echo $json_data;                                                        //отправка ответа клиенту
        }
    }
    else{                                                                       //
        echo '{"error" : 1}';
    }
    function myFormValid($text, $lenCtrl){                                      //проверка длины логина и пароля
        $textLen = strlen($text);
        if($textLen <= $lenCtrl){
            return true;
        }
        else{
            return false;
        }
    }
?>