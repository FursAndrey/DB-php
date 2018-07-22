<?
    ini_set('display_errors', 1);	//1 - показывать ошибки, 0 - скрывать
    error_reporting(E_ALL);
    require_once ('LogIn.php');
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
        <p><a href="index.php">Ссылка на главную страницу</a></p>
        <div id="box2">
            <?if($auth == 0){?>
                <p>Выполните <span id="auth" dataType = "1">Авторизацию</span> / <span id="reg" dataType = "2">Регистрацию</span></p>
            <?}else if($auth == 1){?>
                <p>Привет, <?=$login?></p>
                <div id="logOut">Выход</div>
            <?}?>
        </div>
        <script src="js/regAuth.js" id="box"></script>
    </body>
</html>