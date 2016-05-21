<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/5/18
 * Time: 11:36
 */

function sql_connent() {
    $con = mysqli_connect('127.0.0.1', 'admin', '');
    return $con;
}