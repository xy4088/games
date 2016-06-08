<?php
date_default_timezone_set('prc');
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
        1 => array("u" => 5, "index" => 1),
        2 => array("u" => 2, "index" => 1),
        3 => array("u" => 10, "index" => 3),
        4 => array("u" => 20, "index" => 5),
        5 => array("u" => 10, "index" => 5),
        6 => array("u" => 0, "index" => 0),
        7 => array("u" => 5, "index" => 1),
        8 => array("u" => 2, "index" => 2),
        9 => array("u" => 5, "index" => 2),
        10 => array("u" => 10, "index" => 4),
        11 => array("u" => 10, "index" => 7),
        12 => array("u" => 20, "index" => 7),
        13 => array("u" => 5, "index" => 1),
        14 => array("u" => 5, "index" => 3),
        15 => array("u" => 10, "index" => 3),
        16 => array("u" => 20, "index" => 6),
        17 => array("u" => 10, "index" => 6),
        18 => array("u" => 0, "index" => 0),
        19 => array("u" => 5, "index" => 1),
        20 => array("u" => 5, "index" => 4),
        21 => array("u" => 5, "index" => 2),
        22 => array("u" => 10, "index" => 4),
        23 => array("u" => 50, "index" => 8),
        24 => array("u" => 100, "index" => 8)
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

            //本次应该扣除的分数;
            $reduceScore = 0;
            $newArr=array();
            foreach($this->zhu as $k=>$v){
                if($v > 99){
                    $d = array(
                        "code" => 1005,
                        "message" => "禁止用户作弊，请自觉遵守游戏规则"
                    );
                    echo json_encode($d);
                    return;
                }
                $newArr[$k] = $v;
                $reduceScore+=$v;
            }
            if($reduceScore > $score) {
                $d = array(
                    "code" => 1005,
                    "message" => "积分不足，禁止用户作弊，请自觉遵守游戏规则"
                );
                echo json_encode($d);
                return;
            }

            $ranNum=rand(0,10000);
            if($score < 200){
                if($ranNum < 1500){
                    $weizhi = 23;
                }elseif($ranNum >= 1500 && $ranNum < 2500){
                    $weizhi = 24;
                }else{
                    $weizhi = rand(1,22);
                }
            }elseif($score >= 200 && $score <500){
                if($ranNum<1000 && $newArr[8]<70){
                    $weizhi = 23;
                }elseif($ranNum >= 1000 && $ranNum < 1800 && $newArr[8]<70){
                    $weizhi = 24;
                }else{
                    $weizhi = rand(1,22);
                }
            }elseif($score >= 500 && $score < 1000){
                if($ranNum < 500 && $newArr[8]<60){
                    $weizhi = 23;
                }elseif($ranNum >= 500 && $ranNum < 800 && $newArr[8]<60){
                    $weizhi = 24;
                }else{
                    $weizhi = rand(1,22);
                }
            }elseif($score >=2000 && $score < 5000){
                if($ranNum < 300 && $newArr[8]<50){
                    $weizhi = 23;
                }elseif($ranNum >= 300 && $ranNum < 500 && $newArr[8]<50){
                    $weizhi = 24;
                }elseif($ranNum >= 500 && $ranNum < 1800){
                    $weizhi = 6;
                }elseif($ranNum >= 1800 && $ranNum < 2800){
                    $weizhi = 18;
                }else{
                    $weizhi = rand(1,22);
                }
            }else {
                if ($ranNum < 100  && $newArr[8]<40) {
                    $weizhi = 23;
                } elseif ($ranNum >= 100 && $ranNum < 150 && $newArr[8]<40) {
                    $weizhi = 24;
                } elseif ($ranNum >= 150 && $ranNum < 2500) {
                    $weizhi = 6;
                } elseif ($ranNum >= 2500 && $ranNum < 5000) {
                    $weizhi = 18;
                } else {
                    $weizhi = rand(1, 22);
                }

            }

            $unit = $this->scoreTable[$weizhi]["u"];
            if($weizhi == 6 || $weizhi == 18){
                $theScore = 0;  //本次得分;
            }else{
                $theScore = $unit * $newArr[$this->scoreTable[$weizhi]["index"]]; //本次得分;
            }
            $endScore = $score-$reduceScore+$theScore;  //最后分数;
            $sql = "UPDATE `lhj_users` SET score = ".$endScore." WHERE id = ".$n['id'];
            $result = $connect->db->exec($sql);
            if($result){
//                $time = date('Y-m-d H:i:s',time());
                $sql = "INSERT INTO `lhj_log` VALUES (NULL, ".$n['id'].", ".$theScore.", ".$reduceScore.", ".$endScore.", ".time().")";
                $result = $connect->db->exec($sql);
                if($result){
                    $d = array(
                        "code" => 0,
                        "data" => array(
                            "weizhi" => $weizhi,
                            "defen" => $theScore,
                            "zongFen" => $endScore
                        ),
                        "message" => "ok"
                    );
                    echo json_encode($d);
                }
            }
        }
    }
}