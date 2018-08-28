<template>
  <div class="eduInfo">
          

         <!--有网络状态-->
       <div v-if="!noFetch"  v-show="!isloading">
            
        <div class="eduInfoContainer">
           <h3>温馨提示： 请确保你本人的信息真实有效！</h3>
           <div class="TrainList">
              <div class="trainTitle">旭日康培训信息列表</div>
              <ul class="TranItem">
                 <div class="itemTitle">培训时间</div>
                 <div class="itemTitle">培训课程</div>
                 <div class="itemTitle">培训讲师</div>
                 <div class="itemTitle">培训机构</div>
                 <li v-for="(list,i) of tranList" :key="i" >
                 <span style="width:26%;position:relative;"><input class="btncheckAgree"  type="checkbox" :value="isdel"   v-model="isdel" :data-id="list.id"/> {{list.start_time}}<br/>到<br/>{{list.end_time}}</span>
                  <span>{{list.course.length>10?list.course.slice(0,10)+"...":list.course}}</span>
                  <span>{{list.lectuer}}</span>
                  <span>{{list.institution.length>10?list.institution.slice(0,10)+"...":list.institution}}</span>
                 </li> 
                 <div v-if="noData" class="noData">
                    还没有添加学历信息
                 </div>
                <div class="bottom"></div>

              </ul>  
                
           </div>
             <div class="TrainList">
              <div class="trainTitle">个人教育信息列表</div>
              <ul class="TranItem">
                 <div class="itemTitle">毕业时间</div>
                 <div class="itemTitle">专业名称</div>
                 <div class="itemTitle">学习层次</div>
                 <div class="itemTitle">学校/机构</div>
                 <li v-for="(items,i) in edutrtionList" :key="i" >
                  <span style="width:25.2%"> <input class="checkAgree"  type="checkbox" :value="isdel"   v-model="isdel" :data-id="items.id"/> {{items.end_time}}</span>
                  <span>{{items.course.length>10?items.course.slice(0,10)+"...":items.course}}</span>
                  <span>{{items.education}}</span>
                  <span style="width:26%">{{items.institution.length>10?items.institution.slice(0,10)+"...":items.institution}}</span>
                 </li> 
                 <div v-if="noEduData" class="noData">
                    还没有添加学历信息
                 </div>
                <div class="bottom"></div>

              </ul>  
                
           </div>

           <div class="btnTranList" @click="btnTranList()">添加培训信息</div>
            <div class="btneduList" @click="btneduList()">添加学历信息</div>
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
axios.defaults.timeout = 3000
import { Toast,MessageBox,Indicator } from 'mint-ui';
export default {
  name: 'eduInfo',
  data () {
    return {
       noFetch:false,
        tranList:[],  //学历信息列表
        edutrtionList:[], //个人教育信息列表
        noData:false,
        noEduData:false,
        isdel:false,
      
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
     if (navigator.onLine) {
       this.fetchTran();
       this.fetchEdu();
    } else {
      //无网络状态
      this.noFetch = true;
      Toast({
        message: "当前网络不可用，请检查网络",
        position: "bottom",
        duration: 1500
      });
    } 
    var that=this;
     $(".TranItem").on('click','.checkAgree',function(e){   //学历
        this.isDel=$(e.target).attr('value');
        if(this.isDel=="true"){
            $(e.target).removeClass('disable');
             $(e.target).attr('value',false);
        }else if(this.isDel=="false"){
            $(e.target).addClass('disable');
            $(e.target).attr('value',true);
            console.log("删除的id"+ $(e.target).attr('data-id'));
             MessageBox.confirm('<span style="color:#f91 !important;font-size:1.6rem">是否删除选中信息？</span>','提示').then(action => {
          if (action == 'confirm') {
              that.fetchDelEdu($(e.target).attr('data-id'));
          }else if(action=='cancel'){
             $(e.target).removeClass('disable');
             $(e.target).attr('value',false);
          }  
      });
            
        }
     });
      $(".TranItem").on('click','.btncheckAgree',function(e){  //培训

        this.isDel=$(e.target).attr('value');
        if(this.isDel=="true"){
            $(e.target).removeClass('disable');
             $(e.target).attr('value',false);
        }else if(this.isDel=="false"){
            $(e.target).addClass('disable');
            $(e.target).attr('value',true);
            console.log("删除的id"+ $(e.target).attr('data-id'));
             MessageBox.confirm('<span style="color:#f91 !important;font-size:1.6rem">是否删除选中信息？</span>','提示').then(action => {
          if (action == 'confirm') {
              that.fetchDelTran($(e.target).attr('data-id'));
          }else if(action=='cancel'){
             $(e.target).removeClass('disable');
             $(e.target).attr('value',false);
          }  
      });
            
        }
     });
     

  },
  methods:{
    fetchTran(){ 
        var that=this;
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
      axios({
          method: 'POST',
           url:domain+'/mobile/index.php?act=training&op=list',
           data:{
              key:that.$route.query.key,  
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
              if(response.data.code==200){
              if(response.data.datas.length>0){
                  that.tranList=response.data.datas;
              }else{
                  that.noData=true;
              }
           }else{
                 that.noData=true;
               Toast(response.data.datas.error);
           }
          },(err)=>{
                Toast('网络超时，请稍后重试');
          });
    },
    fetchEdu(){
           var that=this;
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
      axios({
          method: 'POST',
           url:domain+'/mobile/index.php?act=education&op=list',
           data:{
              key:that.$route.query.key,  
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
             if(response.data.code==200){
              if(response.data.datas.length>0){
                  that.edutrtionList=response.data.datas;
              }else{
                  that.noEduData=true;
              }
           }else{
                that.noEduData=true;
               Toast(response.data.datas.error);
           }
          },(err)=>{
                Toast('网络超时，请稍后重试');
          });
       
    },
    fetchDelEdu(id){  //删除学历
        console.log(id+"===");
          var that=this;
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
      axios({
          method: 'POST',
           url:domain+'/mobile/index.php?act=education&op=del',
           data:{
              key:that.$route.query.key,
              id:id,  
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
              Indicator.open("删除中...")
             if(response.data.code==200){
                 setTimeout(()=>{
                      Indicator.close();
                      location.reload();
                 },1000);
             
           }else{
                setTimeout(()=>{
                      Indicator.close();
                       Toast(response.data.datas.error);
                 },1000);
           }
          },(err)=>{
                Toast('网络超时，请稍后重试');
          });
    },
    fetchDelTran(ids){  //删除培训
         console.log(ids+"===");
          var that=this;
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
      axios({
          method: 'POST',
           url:domain+'/mobile/index.php?act=training&op=del',
           data:{
              key:that.$route.query.key,
              id:ids,  
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
              Indicator.open("删除中...")
             if(response.data.code==200){
                 setTimeout(()=>{
                      Indicator.close();
                      location.reload();
                 },1000);
             
           }else{
                setTimeout(()=>{
                      Indicator.close();
                       Toast(response.data.datas.error);
                 },1000);
           }
          },(err)=>{
                Toast('网络超时，请稍后重试');
          });

    },
    btnTranList(){  //培训经历
       var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
       window.location.href=domain+"#/addTranList?key="+this.$route.query.key;
    },
    btneduList(){   //添加学历信息
       var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
       window.location.href=domain+"#/addEduInfo?key="+this.$route.query.key;
    },
     loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
            //有网络状态
            
         }else{   //无网络状态
            this.noFetch=true;
              Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
          }
      },
     goback(){

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
  display: inline-block;

}
a {
  color: #42b983;
}
.eduInfo{
    height: 100vh;
}
.eduInfoContainer{
          height: 100vh;
    margin-bottom: 75px;
    text-align: left;
}
.eduInfoContainer h3{
      font-size: 1.5rem;
    background-color: #25a7bb;
    height: 36px;
    line-height: 36px;
    padding-left: 10px;
    color: #fff;
}
.eduInfoContainer p{
   line-height: 24px;
    font-size: 1.4rem;

}
/*
*学历信息
*/
.TrainList{
    text-align: center;
    background-color: #fff;
}
.trainTitle{
    height: 36px;
    line-height: 36px;
    font-size: 1.4rem;
    color: #666;
}
.TranItem{
     width: 100%;
    height: auto;
    line-height: 36px;
    text-align: left;
    background-color: #ffe8c0;
    margin-bottom: 20px;
}
.TranItem li{
    width: 100%;
    display: block;
    text-align: left;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    font-size:1.4rem;
}
.checkAgree{
      width: 10px;
    height: 10px;
    border: 1px solid #ddd;
}
.btncheckAgree{
    width: 10px;
    height: 10px;
    border: 1px solid #ddd;
}
.TranItem li span{
    display: inline-block;
    width: 20%;
    line-height:22px;
    text-align: center;
    font-size: 12px;
    vertical-align: text-top;
}
.itemTitle{
      display: inline-block;
    width: 24%;
    text-align: center;
}
.bottom{
      width: 100%;
    height: 32px;
    display: block;
    background-color: #ffe8c0;
}
/*底部btn*/
.btnTranList{
   display: block;
    position: fixed;
    bottom: 60px;
    left: 0px;
    right: 0px;
    text-align: center;
    line-height: 46px;
    height: 46px;
    background-color: #f47731;
    font-size: 1.4rem;
    color: #fff;
    z-index: 1000;
    letter-spacing: 2px;
}
.btneduList{
    display: block;
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    text-align: center;
    line-height: 46px;
    height: 46px;
    background-color: #f47731;
    font-size: 1.4rem;
    color: #fff;
    letter-spacing: 2px;
    z-index: 1000;
}
.noData{
 background-color: #fff;
 text-align: center;
}
.disable{
    background: url("../../assets/checkbox-selected-o.png") no-repeat center center;
    width: 12px;
    height: 12px;
    margin-left: 5px;  
}

</style>

