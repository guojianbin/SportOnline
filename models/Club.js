var mongodb = require('./db');
function Club(club){
this.clubid = club.clubid;
  this.name = club.name; 
  this.winning = club.winning; 
  this.league = club.league;
  this.sport = club.sport;
  this.imgurl = club.imgurl;
}; 
module.exports = Club; 

Club.prototype.Insert=function(callback){ 
 //callback 是执行玩保存后的回调函数
  var club = {
      clubid:this.clubid,
      name: this.name, 
      winning: this.winning,
	  league: this.league,
	  sport: this.sport,
	  imgurl: this.imgurl
  }; 
  //打开数据库
  mongodb.open(function(err,db){ 
    //如果打开出错，err会有出错信息，否则为null
    if(err){ 
      //将注册信息错误信息作为参数返回给回调函数
      return callback(err); 
    } 
    //连接数据库中的名为user的表，没有就创建
    db.collection('club',function(err,collection){ 
      //连接失败会将错误信息返回给回调函数，并且关闭数据库连接
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
       //插入新的数据
      collection.insert(club,{safe: true},function(err,result){ 
        //不管是否成功都关闭数据库
        mongodb.close(); 
        //如果错误err有错误信息
        callback(err, club);//成功！返回插入的用户信息 
      }); 
    }); 
  }) 
}

Club.prototype.SaveEdit=function(callback){ 
 //callback 是执行玩保存后的回调函数
  var club = {
      clubid:this.clubid,
      name: this.name, 
      winning: this.winning,
	  league: this.league,
	  sport: this.sport,
	  imgurl:this.imgurl
  }; 
  //打开数据库
  mongodb.open(function(err,db){ 
    //如果打开出错，err会有出错信息，否则为null
    if(err){ 
      //将注册信息错误信息作为参数返回给回调函数
      return callback(err); 
    } 
    //连接数据库中的名为user的表，没有就创建
    db.collection('club',function(err,collection){ 
      //连接失败会将错误信息返回给回调函数，并且关闭数据库连接
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 

	  collection.update({'clubid':club.clubid},{$set:club},function(err,result){
        mongodb.close();
		console.log('更新成功');
        callback(err, club);//成功！返回插入的用户信息
      });

    }); 
  }) 
}


Club.Delete=function(clubid, callback){ 
  //打开数据库
  mongodb.open(function(err,db){ 
    //如果打开出错，err会有出错信息，否则为null
    if(err){ 
      //将注册信息错误信息作为参数返回给回调函数
      return callback(err); 
    } 
    //连接数据库中的名为user的表，没有就创建
    db.collection('club',function(err,collection){ 
      //连接失败会将错误信息返回给回调函数，并且关闭数据库连接
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 

	  collection.remove({'clubid':clubid},{safe:true},function(err,result){
        mongodb.close();
		console.log('删除成功');
        callback(err, result);//成功！
      });

    }); 
  }) 
}

//读取信息 
Club.get = function(clubid, callback){ 
  //打开数据库 
  mongodb.open(function(err, db){ 
    if(err){ 
      return callback(err); 
    } 
    //读取 集合 
    db.collection('club', function(err, collection){ 
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
      //查找用户名 clubid 值为 clubid 
      collection.findOne({clubid: clubid},function(err, doc){ 
        mongodb.close(); 
        if(doc){ 
          var club = new Club(doc); 
          callback(err, club);//成功！返回查询信息 
        } else { 
          callback(err, null);//失败！返回null 
        } 
      }); 
    }); 
  }); 
};

Club.findAllByLeague = function(sport, league, callback){ 
  //打开数据库 
  mongodb.open(function(err, db){ 
    if(err){ 
      return callback(err); 
    } 
    //读取 集合 
    db.collection('club', function(err, collection){ 
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
	  
	    collection.find({sport: sport, league:league}).sort({winning:-1}).toArray(function(err,items){ 
        if(err) throw err; 
        mongodb.close(); 
        //遍历数据 
        return callback(items); 
      }); 
	  
    }); 
  }); 
};


Club.findOnlyClubsByLeague = function(sport, league, callback){ 
  //打开数据库 
  mongodb.open(function(err, db){ 
    if(err){ 
      return callback(err); 
    } 
    //读取 集合 
    db.collection('club', function(err, collection){ 
      if(err){ 
        mongodb.close(); 
        return callback(err); 
      } 
	  
	    collection.find({sport: sport, league:league}).toArray(function(err,items){ 
        if(err) throw err; 
        mongodb.close(); 
		var arr = [];
		for(var i = 0;i < items.length; i++ )
		{
			arr[i] = items[i].name;
		}
        //遍历数据 
        return callback(arr); 
      }); 
	  
    }); 
  }); 
};
