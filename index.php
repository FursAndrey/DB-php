<?
    ini_set('display_errors', 1);	//1 - показывать ошибки, 0 - скрывать
    error_reporting(E_ALL);
    require_once ('LogIn.php');                     //подключить проверку авторизации
?>
<!DOCTYPE html>
<html>
    <head>
        <title class="super">php файлы</title>
        <meta charset="utf-8" />
        <link href="css/style.css" type="text/css" rel="stylesheet"/>
        <script src="js/jquery-3.3.1.min.js"></script>
    </head>
    <body>
        <p><a href="ind2.php">Ссылка на 2-ю страницу</a></p>
        <div id="box2">
        <?if($auth == 0){?>                         <?//если не авторизован - выполнить?>
            <p>Выполните <span id="auth" dataType = "1">Авторизацию</span> / <span id="reg" dataType = "2">Регистрацию</span></p>
        <?}else if($auth == 1){?>                    <?//если авторизован - выполнить?>
            <p>Привет, <?=$login?></p>
            <div id="addTask" dataType="1">Добавить</div>
            <div id="sortTask">Сортировать</div>
            <div id="logOut">Выход</div>
            <script src="js/task.js"></script>
        <?}?>
        </div>
        <script src="js/regAuth.js" id="box"></script>
    </body>
</html>