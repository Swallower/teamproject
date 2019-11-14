//vue_server_000/app.js
//功能：服务器端程序
//1:下载四个模块
//  express			web服务器
//  mysql				mysql驱动
//  cors				处理跨域
//  express-session	会话session对象
//2:vue_server_000/进入命令行
//  npm i mysql express express-session cors
//3:加载四个第三方模块
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const session = require("express-session");

//4:配置数据库连接池:基本效率高保证
var pool = mysql.createPool({
   host:"127.0.0.1",
   user:"root",
   password:"",
   database:"cjz1",
   port:3306,
   connectionLimit:20
})
//5:创建web服务器
var server = express();
//6:配置跨域  允许程序列表
//  http://127.0.0.1:8080
//  http://localhost:8080
server.use(cors({
   origin:["http://127.0.0.1:8080","http://localhost:8080"],
   credentials:true  //每次请求验证
}))
//7:配置session环境
server.use(session({
   secret:"128位安全字符串",
   resave:true,         //请求更新数据 
   saveUninitialized:true//保存初始数据
}));
//8:配置静态目录 pubic
//8.1:创建public
server.use(express.static("public"))
//9:启动监听端口  3000
server.listen(3000);

// server.get("/says/sayhi",(req,res)=>{
//     var sql = "select*from cjz_forums";
//     console.log("请求成功")
// })

// 设置分页功能
server.get("/says/sayhi",(req,res)=>{
    // 获取点击的页码
    // 设置起始,结束数据
    var page = req.query.page;
    var start = (page-1)*6;
    // var old = start+6;
    console.log("点击的页码"+page)
    var sql = "SELECT fid,uid,uname,nickname,title,time FROM cjz_forums LIMIT ?,?";
    // 接受前端点击的页码，查询后6位数据
    pool.query(sql,[start,6],(err,result)=>{
        if(err) throw err;
        console.log(result);
        // res.send(result);
        // 将查询的数据保存
        var data = result;
        // 查询数据总数
        var sqlC = "SELECT count(fid) as c FROM cjz_forums";
        pool.query(sqlC,(err,result)=>{
            if(err) throw err;
            console.log(result[0].c)
            // 计算总页数
            var pageC = Math.ceil(result[0].c/6)
            res.send({data,pageC})
        })
    })
})

