<?
    session_start();
    ini_set('display_errors', 0);	                    //1 - показывать ошибки, 0 - скрывать
    error_reporting(E_ALL);
    $auth = 0;                                                          //сброс флага авторизации
    if($_SESSION != []){                   //если есть зарегистрированная сессия - продолжаем
        if($_SESSION['userID'] != '') {                   //если есть зарегистрированная сессия - продолжаем
            $id = $_SESSION['userID'];
            require_once ('dbm.php');
            $db = new dataBase();
            $rez = $db -> selectWhereSort('users','id',$id);
            $auth = 1;                                                      //установка флага авторизации
            $login = $rez[0]['login'];                                         //запись имени в переменную
        }
    }
?>