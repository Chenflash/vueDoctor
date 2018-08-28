<template>
  <div class="addIntelligen">
  
          <div class="addIntelligenContainer">
            <div class="intelligenTitle">
              温馨提示：真实姓名和资质证书的姓名必须一致，一经认证无法修改。请您认证核对！
            </div>
            <ul class="formAddIntell">
                <li class="itemsIntell"><span class="letText">真实姓名：</span><input type="text" v-model="truename"  placeholder="填写真实姓名" class="rightInput"/></li>  
                <li class="itemsIntell" @click="openPick()"> <span class="letText">证书类型: </span>
                   <span class="rightPicker" >{{certificate_type==1?'医师许可证':certificate_type==2?'营养师许可证':'请选择'}}</span>
                    <img src="../../assets/icon_left_arrow.png" class="areaPicker" />
                   </li> 
                <li class="itemsIntell"><span class="letText">证书编号：</span><input type="text" v-model="certificate_num" placeholder="填写证书编号" class="rightInput"/></li>  
                <li class="itemsIntell" @click="openDate()"><span class="letText">发证日期：</span><span class="rightInput">{{myEndtTime==''?'选择发证日期':myEndtTime}}</span></li>  
                


            </ul>
            <div class="uploadPic">
               <h3>请点击上传资质证书图片</h3>
               <div class="bottomPic">
                   <p class="avatarImg" v-show="pic!=''"> <img alt="" v-bind:src="pic" class=""/></p> 
                    <input type="file" class="upload" @change="triggerFile($event)" accept="image/jpeg,image/x-png,image/gif" />  
                   <p class="pics" v-show="pic==''">
                   <img src="../../assets/upload.png"/></p>  
               </div> 

            </div>
            <div id="Pickervalue"  v-if="showPicker" >
                   <p class="btnOk" @click="changePicker">确定</p><p class="btnCancel" @click="clickCancel">取消</p>
              
                    <mt-picker  id="slotPicker" :slots="slots" @change="onValuesChange" ></mt-picker>
                    </mt-picker>
                    
           </div>
            <!--时间选择器-->
        <div class="showDates" v-if="showDate">
            <mt-datetime-picker refs="picker" 
            type="date"
            v-model="issue_date"
            :startDate="startDate"
            :endDate="new Date()"
            year-format="{value}年"
            month-format="{value}月"
            date-format="{value}日"
            confirm="handleConfirm"  @cancel="checkinCancel" 
            style="display:block" @confirm="handleConfirm">
        </mt-datetime-picker>
        </div>
           
              
         </div>  
       
           <div class="addIntell" @click="addIntelligen">确定添加</div> 
          

         
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast,Indicator } from 'mint-ui';
export default {
  name: 'addIntelligen',
  data () {
    return {  
      noFetch:false, 
     intellList:[],
     showPicker:false,
     truename:"",
     certificate_type:"",
     certificate_num:"",
     startDate:new Date('1960-01-01'),
     issue_date:"",
     pic:"",
     showDate:false,
     myEndtTime:"",
      slots:[{
             flex: 1,
            values: ['医师许可证','营养师许可证'],
            className: 'slot1',
            textAlign: 'center'
        }],
     

     
    }
  
  
  },
  mounted(){
     
  },
  methods:{
    
    addIntelligen(){  //添加资质证书
          if(this.truename==""|| this.certificate_type=="" || this.certificate_num ==""  || this.pic==""){
             Toast("请填写完整的证书资料！"); 
             return;
          }
          Indicator.open();
          var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
          var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=intelligence&op=add',
                    data:{
                       key:that.$route.query.key,
                       truename:that.truename,
                       certificate_type:that.certificate_type,
                       certificate_num:that.certificate_num,
                       issue_date:that.myEndtTime,
                       pic:that.pic,

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
                  setTimeout(()=>{
                       Indicator.close();
                       that.$router.push({name:"intelligenManList",query:{key:that.$route.query.key}}); 
                  },1000);
              }else{
                  setTimeout(()=>{
                       Indicator.close();
                       Toast(response.data.datas.error)
                  },1000); 
               
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });
    },
      formatDate(date) {  //转化时间格式
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        return y + '-' + m + '-' + d
    },
    openDate(){  //打开时间组件
      this.myEndtTime="";
       this.showDate=true;
    
    },
    checkinCancel(){ //取消
      this.myEndtTime="";
      this.showDate=false;
    
    },
    handleConfirm(){  //确定选择格式后
          this.showDate=false;
         this.myEndtTime=this.formatDate(this.issue_date);

       
    },
    openPick(){
       this.showPicker=true; 
    },
    changePicker(){
      this.showPicker=false; 
    },
    clickCancel(){
        this.certificate_type=0; 
        this.showPicker=false;  
    },
    triggerFile(event){
         var that=this;
         var file= event.target.files[0];
         that.file = file;     
          var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host; 
         let da=new FormData();
         da.append("cover_image",that.file);
         var imgSize=parseFloat(file.size)/1024;
         if(imgSize>10000){
           Toast({message: '请上传不要超过10M的图片',position: 'bottom',duration: 2000});
         }else{
            let config = {
            headers:{'Content-Type':'multipart/form-data'}
            };  //添加请求头
            axios.post(domain+'/mobile/index.php?act=index&op=image_upload',da,config)
            .then(response=>{
              if(response.data.code==200){
                that.pic=response.data.datas.file_path;
              }else{
                Toast(response.data.datas.error);
              }
            }) 

             
         }
        
        
      },
    onValuesChange(picker, values) {
      var that=this;
        if(values[0]=='医师许可证'){
          that.certificate_type=1;
        }else if(values[0]=='营养师许可证'){
          that.certificate_type=2;
        }else if(values[0]="请选择"){
          that.certificate_type=0;  
        }
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
input::-webkit-input-placeholder{

  background-color:#ffffff;
}
textarea::-webkit-input-placeholder{
  
  font-size:16px;
  background-color:#ffffff;
  text-align: left !important;
}
#Pickervalue{
   width: 100%;
    position: fixed;
    background-color:#eee !important;
    bottom: 0px;
    z-index: 996;
}
#slotPicker{
    z-index:1000; 
}

.btnOk{
    position: absolute;
    right: 30px;
    font-size: 16px;
    z-index:1200;
}
.btnCancel{
    position: absolute;
    left: 30px;
    font-size: 16px;
    color:#f44336;
    z-index:1200;
}
.iconleft{
  
}
.rightPicker{
  margin-left:5px;
  color:#666;
}

.addIntelligen{
      
}
.addIntelligenContainer{
        height: auto;
    margin-bottom: 50px;
}
.intelligenTitle{
  height:48px;
  line-height:22px;
  background-color:#333;
  color:#ff8800;
  text-align:left;
  padding-left:10px;
  font-size:14px;
}
/*
*上传资料
*/
.formAddIntell{
      text-align: left;
    background-color: #fff;
    font-size: 10px;
    margin-bottom: 10px;
}
.formAddIntell li{
      width: 100%;
    display: block;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #ddd;
    font-size: 1.4rem;
    color: #666;
    position: relative;
}

.letText{
    margin-right: 10px;
    margin-left: 10px;
}
.rightInput{
   height: 46px;
    border: 0 none;
    width: 65%;
}
.areaPicker{
    position: absolute;
    right: 5%;
    top: 10px;
    width: 28px;
    height: 28px;
}
.uploadPic{
       background-color: #fff;
    text-align: left;
    margin-bottom: 50px;
}
.uploadPic h3{
    height: 36px;
    line-height: 36px;
    border-bottom: 1px solid #ddd;
    padding-left: 10px;
    font-size: 1.4rem;
    color: #666;
    font-weight: normal
}
.avatarImg{
   overflow: hidden;
    width: 15rem;
    height: 15rem;
    margin: 0 auto;
    margin-top: 35px;
    
}
.avatarImg img{
    width:100%;
    height:100%;

}
.upload{
    position: absolute;
    opacity: 0;
    top: 0px;
    left: 30%;
    width: 15rem;
    height: 15rem;
}
.bottomPic{
   text-align: center;
    margin-bottom: 50px;
    height: auto;
    position:relative;
}
.pics{
    height: 10rem;
    width:10rem;
    margin:0 auto;
    margin-top: 30px;
    
}
.pics img{
    width: 10rem;
    height: 10rem;
}
.addIntell{
     position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 46px;
    line-height: 46px;
    background-color: #ff8800;
    color: #fff;
    font-size: 1.6rem;
    letter-spacing: 2px;
    z-index: 993;
}
.showDates{
   position: fixed;
    z-index: 1000;
    bottom: 0px;
}
</style>
