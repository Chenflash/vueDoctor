<template>
  <div class="doctorDetail">
     
  

          <div v-if="!noFetch"  v-show="!isloading" >
       
        <div class="doctorContainer">
        <ul class="doctorList">
           <li class="Infos">
             <img :src="has_fav==0?require('../../assets/noAttion.png'):require('../../assets/attiontion.png')" class="acctions"   @click="attectionDoctor"/>       
           <p><img :src="member_avatar" class="avatar" :onerror="logo"/></p>
           <p style="padding-top:10px;"><span>{{member_name==''?'未填写':member_name}}</span></p>
            <p class="doctorWork"><span class="doctorname">{{employer==null?'未填写':employer}}</span><span class="doctorAddress">{{function_name==null?'未填写':function_name}}</span></p>
           
         </li>   
          <li class="doctorInfo"> 
            <span class="freeNumber">诊费:{{registered_fee==null?'0':registered_fee}}元</span>
            <span class="workNew">工龄：{{seniority==null?'0':seniority}}年</span> 
          </li>  
          <li class="doctorSpe"> 
            <span class="freeNumber">擅长领域：{{speciality==null?'未填写':speciality}}</span>
          
          </li>  
           <li class="doctorInfo"> 
             <span class="freeNumber">联系地址：{{member_address==null?'未填写':member_address}}</span>
          </li> 
          <li class="doctorInfo"> 
            <h3>个人简介</h3>
          </li>  
          <div class="infoContent"> 
            <p class="doctorAbout">{{personal_desc==null?'未填写':personal_desc}}</p>
          </div>  
          <li class="doctorInfo"> 
            <h3>学习经历</h3>
          </li> 
            <div class="tableBody">
               <ul class="Tabletitle">
                <li>毕业时间</li>
                <li>专业名称</li>
                <li>学历</li>
                <li>学校</li>
               </ul> 
               <ul class="tabli" style="border-bottom:1px solid #ddd;">
                 
                 <li v-for="(item,i) in education_list" :key="i" v-if="education_list.length>0" >
                  <span class="textEdu">{{item.end_time}}</span>
                  <span class="textEdu">{{item.course}}</span>
                  <span class="textEdu">{{item.education}}</span>
                  <span class="textEdu">{{item.institution}}</span>
                 </li> 
                 <li class="noli" v-if="education_list.length==0">
                   <p>还没有添加学历信息</p>     
                 </li>
               </ul>
            </div>
          <li class="doctorInfo"> 
            <h3>培训经历</h3>
          </li> 
           <div class="tableBody" style="margin-bottom:50px">
           <ul class="Tabletitle">
                <li>培训机构</li>
                <li>课程</li>
                <li>培训讲师</li>
                <li>时间</li>
               </ul> 
               <ul class="tabli">
                 <li v-for="(item,i) in train_list" :key="i" v-if="train_list.length>0">
                  <span class="textEdu">{{item.institution}}</span>
                  <span class="textEdu">{{item.course}}</span>
                  <span class="textEdu">{{item.lectuer}}</span>
                  <span class="textEdu">{{item.start_time}}<br/>到<br/>{{item.end_time}}</span>
                 </li> 
                 <li class="noli" v-if="train_list.length==0">
                   <p>还没有添加培训信息</p>     
                 </li>
               </ul>
          </div> 
        </ul>  

 
        </div>  
     
     <ul class="footer">
       <li @click="toAppointment(member_name,registered_fee)">预约</li>
       <li @click="shareTitle">分享</li>
     </ul>  
 </div>
          <!--没网络状态-->
           <!--没有网络的状态-->
  <div class="noFetch" v-else>
         <img src="../../assets/noFetch.png" />
         <p>网络无法连接</p>
         <p  @click="loadFetch()"  class="btnFetch">刷新</p>
  </div>

        
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
import { Toast ,MessageBox,Loadmore,Indicator} from 'mint-ui';
export default {
  name: 'doctorDetail',
  data () {
    return {
     isDisable:true,
     noFetch:false,
     member_avatar:null,
     member_name:'',
     has_fav:0,
     member_address:null,
     employer:null, //雇佣者
     function_name:null, 
     seniority:null,  //工作资历
     speciality:null,
     registered_fee:null, //出诊费
     member_type:"",
     personal_desc:null,  //个人简介
     education_list:[], //学习经历
     train_list:[],     //培训经历
      logo:'this.src="' + require('../../assets/defaultAvatar.png') + '"' 
    }
  },
  computed: {
    
   isloading(){
      return this.$store.state.isloading;
    },
    isCount(){  //统计加载次数
      return this.$store.state.isCount;
    }
  },
  mounted(){
    if(navigator.onLine){   //有网络状态
      this.$store.commit("increatement");
      this.fetchDoctor();
    }else{   //无网络状态
       this.noFetch=true;
       this.showMore=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }
  },
  methods:{
    fetchDoctor(){  //获取医生详情
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=doctor',
                    data:{
                       key:that.$route.query.key,
                       store_id:that.$route.params.storeId,
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
              var res=response.data.datas;
               that.$store.commit("decrement");
              if(response.data.code==200){
                that.$store.commit('iscreateCount');
                that.member_name=res.member_name;
                that.member_avatar=res.member_avatar;
                that.employer=res.employer;
                that.function_name=res.function_name;
                that.has_fav=res.has_fav;
                that.seniority=res.seniority;
                that.speciality=res.speciality;
                that.registered_fee=res.registered_fee;
                that.personal_desc=res.personal_desc;
                that.education_list=res.education_list;
                that.train_list=res.train_list;
                that.member_address=res.member_address;
                that.member_type=res.member_type;
              }else{
                Toast(response.data.datas.error)
              }


            },(err)=>{
                Toast('网络超时，请稍后重试');
            });   
     
    },
    toAppointment(member_name,registered_fee){  //预约
       if(registered_fee==null){
         registered_fee=0;
       }
       if(this.member_type==2 || this.member_type==3){
         Toast("在线问诊只对普通用户开放");
         setTimeout(()=>{
           app.back();
         },2000);
       }else{
          var that=this;
      MessageBox.confirm('<span style="color:#00BCD4 !important;font-size:1.6rem">确定预约？</span>','').then(action => {
          if (action == 'confirm') {
           
            var domains = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host+"/wap/dist/";
            window.location.href=domains+"#/InquisitonDetail/"+that.$route.params.storeId+"?key="+that.$route.query.key+"&memberTruename="+member_name+"&registeredFee="+registered_fee;
            //  const {href} = this.$router.resolve({ name: "InquisitonDetail",params:{storeId:that.$route.params.storeId},
            //  query:{key:this.$route.query.key,memberTruename:member_name,registeredFee:registered_fee}});
            //  window.open(href, '_blank');
          }else if(action=='cancel'){
            console.log("取消了");
          }  
      });
       }
    },

    attectionDoctor(){   //医生收藏
         if(this.$route.query.key=='""' || this.$route.query.key=="undefined" || this.$route.query.key=='null'){
         Toast("账号没有登录，无法收藏！");
         return;
       }else{
          if(this.has_fav==0){  //未收藏
          if(this.isDisable){
            this.isDisable=false;
         var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
         var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_favorites_store&op=favorites_add',
                    data:{
                       key:that.$route.query.key,
                       store_id:that.$route.params.storeId,
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
              setTimeout(()=>{
                that.isDisable=true;
              },1500);
              var res=response.data.datas;
              if(response.data.code==200){
                     that.has_fav=1;
                       Toast("收藏成功"); 
              }else{
                Toast(response.data.datas.error)
              }
            },(err)=>{
                Toast('网络超时，请稍后重试');
            });   
          }


      }else if(this.has_fav==1){  //取消收藏
           if(this.isDisable){
             this.isDisable=false;
             var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
            var that=this;
                axios({
                        method: 'Post',
                        url:domain+'/mobile/index.php?act=member_favorites_store&op=favorites_del',
                        data:{
                          key:that.$route.query.key,
                          store_id:that.$route.params.storeId,
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
                   setTimeout(()=>{
                    that.isDisable=true;
                  },1500);
                  var res=response.data.datas;
                  if(response.data.code==200){
                        that.has_fav=0;                    
                        Toast("取消收藏成功");
                  }else{
                    Toast(response.data.datas.error)
                  }
                },(err)=>{
                    Toast('网络超时，请稍后重试');
                });  
           }

        }
        
     }
 
        
       
    },
    shareTitle(){
      var that=this;
      var title="旭日康";
      var text="";
      var url="http://gzxurikang.com/wap/dist/#/doctorDetail/"+that.$route.params.storeId+"?key="+that.$route.query.key;
      var icon="http://xiaomiwg.oss-cn-beijing.aliyuncs.com/shop/common/05830130675623949.png";
      app.share("旭日康",text,url,icon);
    },
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
  display: inline-block;
}
a {
  color: #42b983;
}
.doctorContainer{
    height: auto;
    background-color: #fff;
}
/*
*医生详情
*/
.doctorList{
    background-color: #fff;
    width: 100%;
}
.Infos{
   position: relative;
    display: block;
    width: 100%;
    border-bottom: 1px solid #d9d9d9;
    font-size:1.4rem;

}
.doctorSpe{
  display: -webkit-flex;/*新版本语法：chrome 21+*/
		display: flex;/*新版本语法:opera 12.1,Firefox 22+*/
		display: -webkit-box;/*老版本语法：Safari,iOS,Android browser,old Webkit browser*/
		display: -moz-box;/*老版本语法：Firefox(buggy)*/
		display: -ms-flexbox;/*混合版本语法：IE 10*/
   align-items: center;
    border-bottom: 1px solid #d9d9d9;
    font-size: 1.4rem;
    text-align: left;
    height: 48px;
    vertical-align: middle;
    position: relative;
    color: #333;
    overflow: scroll;
}
.doctorInfo{
    border-bottom: 1px solid #d9d9d9;
    font-size: 1.4rem;
    text-align: left;
    height: 48px;
    line-height: 48px;
    vertical-align: middle;
    position: relative;
    color: #333;
    display: block;
}
.acctions{
    position: absolute;
    right: 5px;
    top: 5px;
    width: 2.4rem;
    height: 2.4rem;
}
.avatar{
   border: 2px solid #eee;
    width: 6.4rem;
    height: 6.4rem;
    border-radius: 50%;
    overflow: hidden;
    margin-top:10px;
}
.doctorInfo p{
 line-height: 32px;
 padding-top: 10px;
}
.doctorInfo h3{
  font-size: 1.6rem;
  padding-left:10px;
}
.doctorWork{
  height: 48px;
}
.doctorname{
  float: left;
  margin-left: 25%;
}
.doctorAddress{

}
.freeNumber{
  margin-left:10px;

}
.workNew{
 position: absolute;
 right: 25%;
}
.doctorAbout{

}
.infoContent{
  height: 150px;
  color: #999999;
  text-align: left;
  border-bottom: 1px solid #d9d9d9;
  padding-left: 10px;
  line-height: 24px;
  font-size: 1.4rem;
  overflow: scroll;
}
infoContent:last-of-type{
  border-bottom: 0 none;
}

/*
*脚步
*/
.footer{
    display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
  flex:1;
  height:48px;
  border-top:1px solid #d9d9d9;
  background-color: #f4f4f4;
  justify-content:center;
  align-items:center;
  bottom:0px;
  position:fixed;
  width:100%;
  z-index: 998;
  background-color: #fff;
  font-size: 1.4rem;
}
.footer li{
  display: inline-block;
  flex: 0.5;
  line-height: 48px;
  border-right: 1px solid #d9d9d9;
}
.footer li:last-of-type{
  border-right: 0 none;
}

/*网络状态*/
.noFetch{
   height: 100vh;
    color: #999999;
    font-size: 14px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
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

/*学习和培训经历*/
.tableBody{
      width: 100%;
    text-align: left;
    min-height: 150px;
    height: auto;
}
.Tabletitle{
        height: 36px;
    line-height: 36px;
    background-color: bisque;
    width: 100%;
    font-size: 1.4rem;
}
.Tabletitle li{
    width: 24%;
    text-align:left;
}
.tabli{
   min-width: 100%;
    min-height: 120px;
}
.tabli li{
    width: 100%;
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    display: flex;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
    justify-content: center;
    align-items: center;
    text-align:left;
}
.textEdu{
    align-items: center;
    justify-content: center;
    flex: 0.4;
    -moz-box-flex: 0.4;
    -webkit-box-flex:0.4;
    box-flex:0.4;
    color:#999;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.noli{
      text-align: center;
    height: 100%;
    display: block;
    padding-top: 40px;
    border-bottom:0 none !important;
    color:#999;
}
</style>
