<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/18
 * Time: 11:38
 */
header("Content-Type:text/html;charset=utf-8");
session_start();
include_once 'api/db_connect.php';
if(isset($_SESSION['id'])){
    $cookie = $_SESSION['id'];
    setcookie("id", $cookie);
//    setcookie("id", $cookie, time()+3600, "games.com/lhj");
}
include_once "laohujigame.html";
