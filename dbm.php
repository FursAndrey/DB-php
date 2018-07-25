<?php
ini_set('display_errors', 1);	                            //1 - показывать ошибки, 0 - скрывать
error_reporting(E_ALL);
    class dataBase{
        protected $result;
        public function selectAll($tabName){
            $sql = "SELECT * FROM $tabName";
            $this -> result = $this -> mysqli -> query($sql);
            $mas = [];
            do{
                $rez1 = $this -> result -> fetch_assoc();
                if($rez1['id'] != ''){
                    $mas[] = $rez1;
                }
            }while($rez1);
            return $mas;
        }
        public function selectWhereSort($tabName, $whereElem, $whereVal, $sortElem = 'id', $trend = 'ASC'){
            $sql = "SELECT * FROM $tabName WHERE $whereElem = '$whereVal' ORDER BY $sortElem $trend";
            $this -> result = $this -> mysqli -> query($sql);
            $mas = [];
            do{
                $rez = $this -> result -> fetch_assoc();
                if($rez['id'] != ''){
                    $mas[] = $rez;
                }
            }while($rez);
            return $mas;
        }
        public function deleteWhere($tabName, $whereElem, $whereVal, $userId){
            $sql = "DELETE FROM $tabName WHERE $whereElem = $whereVal AND userId = $userId";
            $this -> result = $this -> mysqli -> query($sql);
            $mas = [
                "delete"=> $this -> mysqli -> affected_rows,
            ];
            return $mas;
        }
        public function insertUs($login,$pass){
            $sql = "INSERT INTO `users`(`login`, `password`) VALUES ('$login', '$pass')";
            $this -> result = $this -> mysqli -> query($sql);
            $mas = [
                "status" => 'reg',
                'usID' => $this -> mysqli -> insert_id,
            ];
            return $mas;
        }
        public function updateTs($taskID,$themeTask,$taskText,$deadLine,$userId){
            $dL = strtotime($deadLine);
            $sql = "UPDATE `task` SET `headTask` = '" . $themeTask . "', `deadLine` = '" . $dL . "', `textTask` = '" . $taskText . "' WHERE `id` = $taskID  AND userId = $userId";
            $this -> result = $this -> mysqli -> query($sql);
            $mas = [
                'update' => $this -> mysqli -> affected_rows,
            ];
            return $mas;
        }
        public function insertTs($userID,$themeTask,$taskText,$deadLine){
            $dL = strtotime($deadLine);
            $sql = "INSERT INTO `task`(`headTask`, `textTask`, `deadLine`, `userID`) VALUES ('" . $themeTask . "','" . $taskText . "','" . $dL . "',$userID)";
            $this -> result = $this -> mysqli -> query($sql);
            $mas = [
                "insertInto" => $this -> mysqli -> affected_rows,
                "taskID" => $this -> mysqli -> insert_id,
            ];
            return $mas;
        }
        public function __construct()
        {
            $this -> mysqli = new Mysqli('localhost', 'root', '', 'testDB');
        }
        public function __destruct()
        {
            $this -> mysqli -> close();
        }
    }
?>