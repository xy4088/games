<?php
/**
 * H5小游戏定制，网站开发.
 * QQ: 33675050
 * 淘宝ID：xy408800
 * 该文件连接数据库的类
 * Date: 2016/8/18
 * Time: 14:43
 */


class db_connect
{
    public function __construct(){
        $host = 'localhost';
        $username = 'root';
        $password = 'a8857124.';
        $dbname = 'games';

        try {
            $this->con = "mysql:host=".$host.";dbname=".$dbname;
            $this->db = new PDO($this->con, $username, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "set names utf8"));  //使用PDO连接数据库;
        } catch (PDOException $e) {
            $this->outputError($e->getMessage());
        }
    }

}