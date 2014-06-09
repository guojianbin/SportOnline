
/*
 * GET home page.
 */
 var Club = require('../models/Club.js'); //自定义模块
// 移动文件需要使用fs模块
var fs = require('fs');

//图片插件
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });
var util = require('util');

module.exports = function(app){

  app.get('/',function(req,res){
    res.render('index', {  
            title:"首页",channel:"Sport Online"
            
        });
	});
  //测试地址
	app.get('/test/:league',function(req,res){
		res.render('test', { title: 'test', league: req.params.league  });
    });
	
	//http://localhost:3000/info/CBA 
    app.get('/info/:sport/:league',function(req,res){
		var channel = '',
		clubs ;
		switch(req.params.league.toLowerCase())
		{
			case 'cba':channel = 'CBA';
			// clubs = ['东莞','北京','新疆'];
			break;
			case 'nba':channel = 'NBA';
			// clubs = ['火箭','爵士','湖人'];
			break;
			case 'ger':channel = '德甲';break;
			case 'chn':channel = '中超';break;
			case 'eng':channel = '英超';break;
			case 'spn':channel = '西甲';break;
			case 'pingpang':channel = '乒乓球';break;
		}
		Club.findOnlyClubsByLeague(req.params.sport, req.params.league, function(items){
			clubs = items;
			res.render('info', { title: '详细信息', channel: channel,sport: req.params.sport,league: req.params.league ,clubs:clubs });
		}
		);
		
    });
	
	app.get('/ranking/:sport/:league',function(req,res){
		var channel = '',
		rankdata ;
		switch(req.params.league.toLowerCase())
		{
			case 'cba':channel = 'CBA';
			//rankdata = '[{"rankid": "1","name": "Edith Welch","winning": "52","id": "86e81430-194f-4472-9fd3-7649ddbad82d"},{"rankid": "2","name": "Alex Goodman","winning": "43","id": "9a2777f2-5a76-49f6-a39e-19136a993500"},{"rankid": "3","name": "Inez Bennett","winning": "36","id": "49201c10-b3a4-4973-89c2-7a241f74a50b"}]';
			break;
			case 'nba':channel = 'NBA';
			//rankdata = '[{"rankid": "1","name": "Francis Bennett","winning": "30","id": "318c5514-d6b1-45be-a2f6-bddb3ad0e8d1"},{"rankid": "2","name": "Cora Marshall","winning": "27","id": "fb54d513-361e-436b-bf42-e6d950f15e2f"},{"rankid": "3","name": "Minnie Armstrong","winning": "10","id": "cdaa9da6-bac3-44e9-8f95-4102246ab80e"}]';
			break;
			case 'ger':channel = '德甲';break;
			case 'chn':channel = '中超';break;
			case 'eng':channel = '英超';break;
			case 'spn':channel = '西甲';break;
			case 'pingpang':channel = '乒乓球';break;
		}
		
		Club.findAllByLeague(req.params.sport, req.params.league, function(items){
			rankdata = items;
			console.log(rankdata);
			res.render('ranking', { title: '详细信息', channel: channel,sport: req.params.sport,league: req.params.league ,rankdata:rankdata });
		});
		
		
		
    });
	
	//编辑页面
	app.get('/edit/:sport/:league/:clubid',function(req,res){
		var clubid = req.params.clubid;

		 //Club.js中的Club.get() 函数来读取信息
        Club.get(clubid, function(err, club){ 
            
            if(err){
              //如果报错，记录错误信息和页面跳转
              console.log('读取积分出错'); 
              return res.redirect('/'); 
            } 
			var name = club.name;
            res.render('edit', { title: '后台编辑', channel: name,sport: req.params.sport,league: req.params.league, id:clubid, name:name, winning:club.winning  });
        });

    });
	
	//新增页面
	app.get('/insert/:sport/:league',function(req,res){
		res.render('insert', { title: '后台编辑', channel:req.params.league+'新增球队',sport: req.params.sport,league: req.params.league  });

    });
	
	//直接删除
	app.get('/delete/:sport/:league/:id',function(req,res){
	
		Club.Delete(req.params.id, function(err, reuslt)
		{
			res.redirect('/ranking/'+req.params.sport+'/'+req.params.league);
		});
		
    });
	
	
	  //更新
  app.post('/saveclub/:sport/:league',function(req,res){
		Club.get(req.body.txtid, function(err, club){
			if(club != null)
			{
				club.winning = req.body.txtwinning;
				
				club.SaveEdit(function(err){
				  if(err){
					  console.log(err);
					  return res.redirect('/');
				  }
				  console.log('保存成功');
				  res.redirect('/ranking/'+req.params.sport+'/'+req.params.league);
			  });
	  
			}
		});
	});
  
function newGuid()
{
    var guid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      if((i==8)||(i==12)||(i==16)||(i==20))
        guid += "-";
    }
    return guid;    
}



  //新增
    app.post('/insertclub',function(req,res){
	   
		var club = new Club({ 
        clubid:newGuid(),
		winning:req.body.txtwinning,
		sport:req.body.txtsport,
		league:req.body.txtleague,
        name: req.body.txtname 
      }); 
	    
		
		//处理图片上传
    console.log(req.files);
      //上传文件模块
      var tmp_path,target_path;
      if(req.files.thumbnail.size>0){ //表示有图片文件上传
           tmp_path = req.files.thumbnail.path;
          // 指定文件上传后的目录 - 示例为"images"目录。
          // 重命名图片名字
          var picType=req.files.thumbnail.name.split(".");
          picType=picType[1];
          target_path = './public/images/' + club.name+'_'+club.clubid+"."+picType;
          // 移动文件
          fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
           //修改图片
            imageMagick(target_path)
            .resize(150, 150, '!') //加('!')强行把图片缩放成对应尺寸150*150！
            .autoOrient()
            .write(target_path, function(err){
              if (err) {
                console.log(err);
              }
            });
          });
      } 
	  //结束上传文件模块
	  
	     
		 club.imgurl = target_path;
		
		club.Insert(function(err){
          if(err){
              console.log(err);
              return res.redirect('/');
          }
          console.log('新增成功');
          res.redirect('/ranking/'+req.params.sport+'/'+req.params.league);
      });
		 
	});
  
};