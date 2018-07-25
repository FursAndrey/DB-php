<?
    session_start();
    ini_set('display_errors', 1);	                            //1 - показывать ошибки, 0 - скрывать
    error_reporting(E_ALL);
    if($_POST != [] && $_POST['operation'] != ''){
        require_once ('dbm.php');
        $db = new dataBase();
        if($_POST['operation'] == 'delete' && $_POST['taskID'] != ''){          //если получена задача удалить запись
            $taskID = $_POST['taskID'];                                         //получаем номер записи в базе
            $mas = $db -> deleteWhere('task','id',$taskID, $_SESSION['userID']);
            $json_data = json_encode($mas);
        }
        else if($_POST['operation'] == 'update' && $_POST['taskID'] != '' && $_POST['themeTask'] != '' && $_POST['taskText'] != '' && $_POST['deadLine'] != ''){
            $taskID = $_POST['taskID'];
            $mas = $db -> updateTs($taskID,$_POST['themeTask'],$_POST['taskText'],$_POST['deadLine'],$_SESSION['userID']);
            $json_data = json_encode($mas);
        }
        else if($_POST['operation'] == 'insertInto' && $_POST['themeTask'] != '' && $_POST['taskText'] != '' && $_POST['deadLine'] != ''){
            $userID = $_SESSION['userID'];                                      //получаем номер записи в базе
            $themeTask = $_POST["themeTask"];
            $taskText = $_POST["taskText"];
            $mas = $db -> insertTs($_SESSION['userID'],$_POST["themeTask"],$_POST["taskText"],$_POST['deadLine']);
            $json_data = json_encode($mas);
        }
        else if($_POST['operation'] == 'load'){
            $userID = $_SESSION['userID'];
            $mas2 = $db -> selectWhereSort('task','userID',$userID,'id','DESC');
            $json_data = json_encode($mas2);
        }
        else if($_POST['operation'] == 'sort' && $_POST['sortElem'] != ''){
            $userID = $_SESSION['userID'];
            $sortElem = $_POST['sortElem'];
            $mas2 = $db -> selectWhereSort('task','userID',$userID,$sortElem);
            $json_data = json_encode($mas2);
        }
        echo $json_data;                                                        //отправка ответа клиенту
    }
    else{                                                                       //
        echo '{"error" : 1}';
    }
?>