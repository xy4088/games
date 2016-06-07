<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/2
 * Time: 14:11
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