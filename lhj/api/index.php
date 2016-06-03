<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/18
 * Time: 11:38
 */
header("Content-Type:text/html;charset=utf-8");
include_once 'db_connect.php';
include_once 'lottery.php';
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $data = $_POST;
}else{
    $data = $_GET;
}
$p_type=$data['s'];

if($p_type == 'login'){  //登录;
    $name = strval($data['name']);
    $phone = strval($data['phone']);
    login($name, $phone);
}elseif($p_type == 'gameStart'){ //计算分数;
    $xiazhu = json_decode($data['xiazhu']);
    $lottery=new Lottery($xiazhu);
    $lottery->go();
}elseif($p_type == 'countScore'){ //获取总分;
    getCountScore();
}

function login($name, $phone){
    $connect = new db_connect();
    $sql = "SELECT * FROM lhj_users WHERE phone=".$phone;
    $result = $connect->db->query($sql);
    $result->execute();
    $result->setFetchMode(PDO::FETCH_ASSOC);
    if($n = $result->fetch()){
        if($n['name'] == $name){
            session_start();
            $_SESSION['name']=$name;
            $_SESSION['phone']=$phone;
            $_SESSION['id']=$n['id'];
            echo json_encode(array(
                'code' => 0,
                'data' => $n['score'],
                'message' => '您当前积分'.$n['score']
            ));
        }else{
            echo json_encode(array(
                'code' => 1003,
                'message' => '手机已存在，但是名字和手机不匹配'
            ));
        }
    }else{
        $sql = "INSERT INTO `lhj_users`(`id`, `name`, `phone`, `score`) VALUES (NULL, '".$name."', '". $phone."', 200)";
        $result = $connect->db->exec($sql);
        if($result) {
            session_start();
            $_SESSION['name']=$name;
            $_SESSION['phone']=$phone;
            $_SESSION['id']=$connect->db->lastInsertId();
            $data = array(
                'code' => 0,
                'data' => 200,
                'session' => $_SESSION['id'],
                'message' => '送您200积分，您可以玩游戏了'
            );
            echo json_encode($data);
        }else {
            $data = array(
                'code' => 1001,
                'message' => '请重新提交'
            );
            echo json_encode($data);
        }
    }
}

function getCountScore() {
    $id = $_COOKIE['id'];
    session_start();
    if($_SESSION['id'] == $id){
        $connect = new db_connect();
        $sql = "SELECT * FROM lhj_users WHERE id=".$id;
        $result = $connect->db->query($sql);
        $result->execute();
        $result->setFetchMode(PDO::FETCH_ASSOC);
        if($n = $result->fetch()){
            $_SESSION['id']=$n['id'];
            echo json_encode(array(
                'code' => 0,
                'data' => $n['score'],
                'message' => '您当前积分'.$n['score']
            ));
        }
    }
}
?>