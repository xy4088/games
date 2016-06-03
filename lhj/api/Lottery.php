<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/6/3
 * Time: 11:56
 */
include_once "db_connect.php";

class Lottery
{
    /*
     *单位分数表
     */
    public $scoreTable=array(
        array(5,2,10,20,10,0,5,2,5,10,10,20,5,5,10,20,10,0,5,5,5,10,50,100)
    );

    /**
     * 总中奖几率（所有几率加起来）万分之几；
     * @var array
     */
    public $pre=array(5000);

    /**
     * 几率表；二维数组
     * @var array[array] 二维数组-数字代表几等奖，1=一等，2=二等，类推。
     */
    public $preTable=array(
        array(1,1,1,1,1
            )
    );

    public function __construct($o) {
        $this -> zhu = $o;
    }

    public function go(){
        $connect = new db_connect();
        session_start();
        $id=$_SESSION['id'];
        $phone=$_SESSION['phone'];
        $sql = "SELECT * FROM lhj_users WHERE id=".$id." AND phone=".$phone;
        $result = $connect->db->query($sql);
        $result->execute();
        $result->setFetchMode(PDO::FETCH_ASSOC);
        if($n = $result->fetch()){
            $score = $n['score'];
            $ranNum=rand(0,10000);
            if($score < 200){
                if($ranNum < 2500){
                    $weizhi = 23;
                }elseif($ranNum >= 2500 && $ranNum < 5000){
                    $weizhi = 24;
                }else{
                    $weizhi = rand(1,24);
                }
            }elseif($score >= 200 && $score <500){
                if($ranNum<1500){
                    $weizhi = 23;
                }elseif($ranNum >= 1500 && $ranNum < 2500){
                    $weizhi = 24;
                }else{
                    $weizhi = rand(1,24);
                }
            }elseif($score >= 500 && $score < 2000){
                if($ranNum < 500){
                    $weizhi = 23;
                }elseif($ranNum >= 500 && $ranNum < 1000){
                    $weizhi = 24;
                }else{
                    $weizhi = rand(1,22);
                }
            }elseif($score >=2000 && $score < 5000){
                if($ranNum < 300){
                    $weizhi = 23;
                }elseif($ranNum >= 300 && $ranNum < 500){
                    $weizhi = 24;
                }elseif($ranNum >= 500 && $ranNum < 1000){
                    $weizhi = 6;
                }elseif($ranNum >= 1000 && $ranNum < 1500){
                    $weizhi = 18;
                }else{
                    $weizhi = rand(1,22);
                }
            }else{
                if($ranNum < 300){
                    $weizhi = 23;
                }elseif($ranNum >= 300 && $ranNum < 500){
                    $weizhi = 24;
                }elseif($ranNum >= 500 && $ranNum < 2500){
                    $weizhi = 6;
                }elseif($ranNum >= 2500 && $ranNum < 5000){
                    $weizhi = 18;
                }else{
                    $weizhi = rand(1,22);
                }
            }

//          本次应该扣除的分数;
            $reduceScore = 0;
            foreach($this->zhu as $k=>$v){
                $reduceScore+=$v;
            }
            print_r($this->scoreTable[$weizhi]);
            print_r($this->zhu[$weizhi]);
            $score = $this->scoreTable[$weizhi]*$this->zhu[$weizhi];

        }
    }
}