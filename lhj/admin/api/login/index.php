<?php
/**
 * H5小游戏定制，网站开发.
 * QQ: 33675050
 * 淘宝ID：xy408800
 *
 * 后台管理登录的接口文件
 */

header("Content-Type:application/x-www-form-urlencoded;charset=utf-8");
include_once '../db_connect.php';

$user = $_POST['user'];
$password = $_POST['password'];

$connect = new db_connect();
$sql = "SELECT * FROM lhj_admin WHERE username='".$user."' AND password='".$password."'";
$result = $connect->db->query($sql);
$data = null;
if($result->fetchColumn()) {
    $data = array(
        'code' => 0,
        'data' => [],
        'message' => '登录成功'
    );
}else{
    $data = array(
        'code' => 102,
        'data' => [],
        'message' => '登录失败'
    );
}
echo json_encode($data);