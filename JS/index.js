var love_news = angular.module("love_news",['ngRoute']);
love_news.config(["$routeProvider",function($routeProvider){
    $routeProvider.when("/",{
        templateUrl:'TPL/index_page.html',
        controller:'index_news'
    }).when('/home',{
        templateUrl:"TPL/home.html",
        controller:'home_ctrl'
    }).when("/search_news/:flag",{
        templateUrl:"TPL/search_news.html",
        controller:'search_news'
    }).when("/news_detail/:index/:flag",{
        templateUrl:"TPL/news_detail.html",
        controller:'news_detail'
    }).when("/management/:flag",{
        templateUrl:"TPL/management.html",
        controller:'manage'
    }).when("/selection",{
        templateUrl:"TPL/selection.html",
        controller:'selection'
    }).otherwise("/")
}])
    .constant("my_URL",{
        list_url:{
            "data":[
                {"id":"T1348647909107","name":"头条","URL":"TPL/toutiao.json"},
                {"id":"T1348648037603","name":"社会","URL":"TPL/shehui.json"},
                {"id":"T1368497029546", "name":"历史","URL":"TPL/lishi.json"},
                {"id":"T1379038288239","name":"电台","URL":"TPL/diantai.json"},
                {"id":"T1348648141035","name":"军事","URL":"TPL/junshi.json"},
                {"id":"T1474271789612","name":"航空","URL":"TPL/hangkong.json"},
                {"id":"T1467284926140","name":"要闻","URL":"TPL/yaowen.json"},
                {"id":"T1348648517839","name":"娱乐","URL":"TPL/yule.json"},
                {"id":"T1348648756099","name":"财经","URL":"TPL/caijing.json"},
                {"id":"T1473054348939","name":"股票","URL":"TPL/gupiao.json"},
                {"id":"T1356600029035","name":"彩票","URL":"TPL/caipiao.json"},
                {"id":"T1348649079062","name":"体育","URL":"TPL/tiyu.json"},
                {"id":"T1348649145984","name":"NBA","URL":"TPL/NBA.json"},
                {"id":"T1411113472760","name":"跑步","URL":"TPL/paobu.json"},
                {"id":"T1348649580692","name":"科技","URL":"TPL/keji.json"},
                {"id":"T1348649654285","name":"手机","URL":"TPL/shouji.json"}
            ]
        },
        list_url_two:{
            "data":[]
        },
        flag:0,
        selection_flag:[],
        selection_index:[],
        selection_id:[],
        selection:[]
    })

    //index_news
    .controller("index_news",["$scope","$http","my_URL",function($scope,$http,my_URL){
        $scope.lunbo_image = [];
        $scope.flag = my_URL.flag
        //获取轮播图片
        $scope.getImage = function(){
            for(var i=0;i<5;i++){
                $scope.lunbo_image[i]=$scope.news_data[i].imgsrc;
            }
        }
        //获取新闻列表
        $scope.getNewList = function(e){
                $scope.news_list = my_URL.list_url.data;
                $scope.news_id = my_URL.list_url.data[e].id;
                $scope.news_URL = my_URL.list_url.data[e].URL;
                $scope.getNew(e)
        }
        //获取新闻
        $scope.getNew = function(e){
            $http({
                method:"GET",
                url:$scope.news_URL
            }).then(function(res){
                $scope.news_data = res.data[$scope.news_id];
                $scope.getImage();
            },function (res){
                console.log(res)
            })
        }
        $scope.getNewList($scope.flag);
        //切换新闻
        $scope.change_news = function(e){
            $scope.flag = e;
            my_URL.flag = e;
            $scope.getNewList($scope.flag);
        }
    }])



    //home
    .controller("home_ctrl",["$scope",function($scope){

    }])
    //search_news
    .controller("search_news",["$scope","$routeParams","my_URL","$http",function($scope,$routeParams,my_URL,$http){
        $scope.search_flag = $routeParams.flag;
        console.log($scope.search_flag)
        //获取地址
        $scope.getURL=function(){
                $scope.resURL=my_URL.list_url.data[$scope.search_flag].URL;
                $scope.resTplId = my_URL.list_url.data[$scope.search_flag].id;
                $scope.getResData();
        }
        //获取地址数据
        $scope.getResData = function(){
            $http({
                method:"GET",
                url:$scope.resURL
            }).then(function(res){
                $scope.news_item = res.data;
                $scope.news_data = $scope.news_item[$scope.resTplId];
            },function (err) {
                console.log(err)
            })
        }
        $scope.getURL()
    }])
    //事件过滤
    .filter("my_date",function(){
        return function(data,xincan){
            var myData =  new Date(data)
            return myData
        }
    })


    //management
    .controller("manage",["$scope","my_URL","$routeParams",function($scope,my_URL,$routeParams){
        $scope.flag = $routeParams.flag
        $scope.list = my_URL.list_url.data
        $scope.list_two = my_URL.list_url_two.data;

        $scope.delete_news = function(e){
            if(my_URL.list_url.data.length>1){
                $scope.list_two.push($scope.list[e])
                $scope.list.splice(e,1)
                if(e<$scope.flag){
                    $scope.flag--;
                    my_URL.flag = $scope.flag
                }else{
                    $scope.flag = $scope.flag
                    my_URL.flag = $scope.flag
                }
            }else{
                console.log("最后一个")
            }
        }
        $scope.add_news = function(e){
            $scope.list.push($scope.list_two[e]);
            $scope.list_two.splice(e,1);
        }
    }])




    //news_detail
    .controller("news_detail",["$scope","$routeParams","my_URL","$http",function($scope,$routeParams,my_URL,$http){
            $scope.detial_url = my_URL.list_url.data[$routeParams.flag].URL;
            $scope.detail_id = my_URL.list_url.data[$routeParams.flag].id;
            console.log($routeParams.flag,$routeParams.index)
            $http({
                method:"GET",
                url:$scope.detial_url
            }).then(function(res){
                $scope.detail_data = res.data[$scope.detail_id][$routeParams.index]
                $scope.title =  $scope.detail_data.title;
                $scope.ptime = $scope.detail_data.ptime;
                $scope.imgsrc = $scope.detail_data.imgsrc;
                $scope.digest = $scope.detail_data.digest;
            },function(err){
                console.log(err)
            })
            $scope.clect_flag = -1
            $scope.clect = function(){
                $scope.clect_flag = -$scope.clect_flag;
                $scope.clect_news()
            }
            //点击收藏
            $scope.clect_news = function(){
                if($scope.clect_flag ==1) {
                    my_URL.selection_flag.push($routeParams.flag)
                    my_URL.selection_index.push($routeParams.index)
                    my_URL.selection.push($scope.detail_data)
                }
                if($scope.clect_flag == -1){
                    var flag_bottom = my_URL.selection_flag.indexOf($routeParams.flag);
                    var index_bottom = my_URL.selection_index.indexOf($routeParams.index);
                    my_URL.selection_index.splice(flag_bottom,1)
                    my_URL.selection_flag.splice(index_bottom,1)
                    my_URL.selection.splice(my_URL.selection.length-1,1)
                }
            }
    }])
    //selection
    .controller("selection",["$scope","$http","my_URL","$http",function($scope,$http,my_URL,$http){
            $scope.selection =my_URL.selection;
    }])

