<?php
/**
 * H5小游戏定制，网站开发.
 * QQ: 33675050
 * 淘宝ID：xy408800
 *
 * 接口处理;
 */

header("Content-Type:application/x-www-form-urlencoded;charset=utf-8");
include_once '../db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $data = $_POST;
}else{
    $data = $_GET;
}
$p_type=$data['s'];

if($p_type == 'userList') {
    $page = $data['page'];
    $size = $data['size'];
    $username = strval($data['username']);
    $phone = $data['phone'];
    userList($page, $size, $username, $phone);
}

function userList($page, $size, $username, $phone) {
    $where = '';
    if($username != '' && $username) {
        $where += 'WHERE name = '.$username;
    }
    if($phone && $phone != '') {
        $where += ' AND phone = '.$phone.' ';
    }
    $connect = new db_connect();
    $sql = "SELECT COUNT(*) FROM lhj_users";
    $result = $connect->db->query($sql);
    $total = $result->fetch()[0];
    $sql = 'SELECT * FROM lhj_users '.$where.'ORDER BY score DESC LIMIT '.($page-1).','.$size;
    $result = $connect->db->query($sql);
//    $result->setFetchMode(PDO::FETCH_ASSOC);
    if($result){
        $row = $result->fetchAll();
        echo json_encode(array(
            'code' => 0,
            'data' => array(
                'total' => (int)$total,
                'page' => (int)$page,
                'list' => $row
            ),
            'message' => 'ok'
        ));
    }else{
        echo json_encode(
            $data = array(
                'code' => 0,
                'data' => [],
                'message' => 'ok'
            )
        );

    }
}