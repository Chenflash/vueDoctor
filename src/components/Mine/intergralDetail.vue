<template>
  <div class="intergralDetail">
      
          <div v-if="!noFetch" v-show="!isloading">

            <div class="intergralDetailContainer">
              <h3 class="points">{{pl_points}}</h3>
              <p class="changeStatus">交易成功</p>
              <ul class="lists">
                <li class="items">
                  <span class="leftName">类型</span>
                  <span class="rightName">{{stagetext}}</span>
                </li>
                <li class="items">
                  <span class="leftName">地址</span>
                  <span class="rightName">{{address_area}}</span>
                </li>
                  <li class="items">
                  <span class="leftName">可用积分</span>
                  <span class="rightName">{{pl_changeafter}}</span>
                </li>
                  <li class="items">
                  <span class="leftName">时间</span>
                  <span class="rightName">{{addtimetext}}</span>
                </li>
                  <li class="items" style="border-bottom:0 none">
                  <span class="leftName">详情</span>
                </li>
                <p class="top_desc">{{pl_desc}}</p>


              </ul>
            </div> 
          </div>
           <ul class="noFetch" v-else>
        <img src="../../assets/noFetch.png" />
        <p>网络无法连接</p>
        <p  @click="loadFetch()"  class="btnFetch">刷新</p>
      </ul>  
            
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast,Loadmore,Indicator} from 'mint-ui';
export default {
  name: 'intergralDetail',
  data () {
    return {
      noFetch:false,
      pl_id: "",
      pl_points: "",//影响
      pl_changeafter: "",//可用积分
      pl_desc: "",//详情
      stagetext: "",//类型
      address_area:"",
      addtimetext: ""//时间
     
    }
  },
    computed:{
   isloading(){
      return this.$store.state.isloading;
    },
    isCount(){  //统计加载次数
      return this.$store.state.isCount;
    }
    
  },
  mounted(){
    if(navigator.onLine){   //有网络状态
      this.fetchDetail();
       if(this.$store.state.isCount==0){     //第一次加载
        this.$store.commit('increatement');     
       }else if(this.$store.state.isCount==1){  //已经加载过
         this.$store.commit('decrement');
         return ; 
       }
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
    fetchDetail(){
           var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
           var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_points&op=points_detail',
                    data:{
                       key:that.$route.query.key,
                       pl_id:that.$route.params.pl_id
                    },
                   transformRequest: [function (data) {
                      let ret = ''
                      for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                      }
                      return ret
                    }],
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(function(response){ 
              console.log(response);
              that.$store.commit("decrement");
              if(response.data.code==200){
                that.$store.commit('iscreateCount');
                that.pl_points=response.data.datas.pl_points;
                that.pl_changeafter=response.data.datas.pl_changeafter;
                that.pl_desc=response.data.datas.pl_desc;
                that.stagetext=response.data.datas.member_type;
                that.addtimetext=response.data.datas.addtimetext;
                that.address_area=response.data.datas.address_area;

              }else{
                Toast(response.data.datas.error)
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });
    },
   
      loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
           this.fetchDetail();
         }else{   //无网络状态
            this.noFetch=true;
              Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {

}
a {
  color: #42b983;
}


/*
*暂无数据
*/
.noNull{
    display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
    justify-content:center;
    flex-direction: column;
    align-items:center;
    width:100%;
    background-color: #fff;
}
.noMessage{
    width: 8rem;
    height: 8rem;
    margin-top: 100px;

}
.noNull p{
  font-size: 14px;
  color: #999999;
  line-height: 60px;
}
/*网络状态*/
.noFetch{
    padding: 100px auto;
    color: #999999;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
}
.noFetch img{
    width: 94px;
    height: 94px;
}
.noFetch p{
    line-height: 36px;
}
.btnFetch{
    width: 82px;
    height: 36px;
    background-color: #00BCD4;
    color: #ffffff;
    font-size: 16px;
    letter-spacing: 4px;
    border-radius: 5px;
}

.intergralDetail{
  height: 100%;
}
.intergralDetailContainer{ 
  background-color: #fff;
  height:100vh;
}
.points{
    font-size: 2rem;
    line-height: 30px;
    padding-top: 20px;
}
.changeStatus{
      font-size: 1.5rem;
    color: #999;
    font-family: sans-serif;
}
.lists{
   margin-top: 30px;
   width: 100%;
}
.items{
    display: block;
    text-align: left;
    line-height: 36px;
    height: 36px;
    border-bottom: 1px dashed #eee;
    font-size: 1.4rem;
    color: #999; 
    padding-left:10px;
}
.leftName{

}
.rightName{
  float: right;
  margin-right:10px;
}

.top_desc{
     color: #999;
    text-align: left;
    margin-left: 10px;
    margin-top: 10px;
    font-size:14px;
}
</style>
