<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/18
 * Time: 11:38
 */

require 'sql_connect.php';
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $method = $_POST;
}else{
    $method = $_GET;
}

if(isset($_POST['queryUserList'])){
    queryUserList();
}

function queryUserList(){
    $con = sql_connent();
    mysqli_select_db($con, 'games');
    $result = mysqli_query($con, 'select * from users');
//    while($row = mysqli_fetch_array($result)) {
//        echo 1;
//    }
    echo $result;
}

include_once "index.html";

?>