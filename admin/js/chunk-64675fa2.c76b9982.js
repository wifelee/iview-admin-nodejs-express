(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-64675fa2"],{1195:function(e,t,a){},"41f3":function(e,t,a){"use strict";var r=a("bd16"),n=a.n(r);n.a},"7e0a":function(e,t,a){"use strict";var r=a("1195"),n=a.n(r);n.a},b13f:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"order-wrapper"},[a("Button",{attrs:{type:"primary"},on:{click:e.addNewManger}},[e._v("新增广告图")]),a("div",{staticClass:"table",staticStyle:{"margin-top":"20px"}},[a("Table",{ref:"selection",attrs:{border:"",columns:e.columns4,data:e.data1}})],1),a("div",{staticClass:"page"},[a("Page",{attrs:{total:e.total,current:e.current}})],1),a("Modal",{attrs:{title:"新增广告图"},model:{value:e.modal1,callback:function(t){e.modal1=t},expression:"modal1"}},[a("Form",{ref:"formValidate",attrs:{model:e.formValidate,rules:e.ruleValidate,"label-width":80}},[a("Upload")],1),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{size:"large"},on:{click:e.cancel}},[e._v("取消")]),a("Button",{attrs:{type:"primary",size:"large"},on:{click:e.ok}},[e._v("提交")])],1)],1)],1)},n=[],i=(a("96cf"),a("3b8d")),s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[e._l(e.uploadList,(function(t){return a("div",{staticClass:"demo-upload-list"},["finished"===t.status?[a("img",{attrs:{src:t.url}}),a("div",{staticClass:"demo-upload-list-cover"},[a("Icon",{attrs:{type:"ios-eye-outline"},nativeOn:{click:function(a){return e.handleView(t.name)}}}),a("Icon",{attrs:{type:"ios-trash-outline"},nativeOn:{click:function(a){return e.handleRemove(t)}}})],1)]:[t.showProgress?a("Progress",{attrs:{percent:t.percentage,"hide-info":""}}):e._e()]],2)})),a("Upload",{ref:"upload",staticStyle:{display:"inline-block",width:"58px"},attrs:{"show-upload-list":!1,"default-file-list":e.defaultList,"on-success":e.handleSuccess,format:["jpg","jpeg","png"],"max-size":2048,"on-format-error":e.handleFormatError,"on-exceeded-size":e.handleMaxSize,"before-upload":e.handleBeforeUpload,multiple:"",type:"drag",action:"//jsonplaceholder.typicode.com/posts/"}},[a("div",{staticStyle:{width:"58px",height:"58px","line-height":"58px"}},[a("Icon",{attrs:{type:"ios-camera",size:"20"}})],1)]),a("Modal",{attrs:{title:"View Image"},model:{value:e.visible,callback:function(t){e.visible=t},expression:"visible"}},[e.visible?a("img",{staticStyle:{width:"100%"},attrs:{src:"https://o5wwk8baw.qnssl.com/"+e.imgName+"/large"}}):e._e()])],2)},o=[],c=(a("7f7f"),{data:function(){return{defaultList:[{name:"a42bdcc1178e62b4694c830f028db5c0",url:"https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar"},{name:"bc7521e033abdd1e92222d733590f104",url:"https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar"}],imgName:"",visible:!1,uploadList:[]}},methods:{handleView:function(e){this.imgName=e,this.visible=!0},handleRemove:function(e){var t=this.$refs.upload.fileList;this.$refs.upload.fileList.splice(t.indexOf(e),1)},handleSuccess:function(e,t){t.url="https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar",t.name="7eb99afb9d5f317c912f08b5212fd69a"},handleFormatError:function(e){this.$Notice.warning({title:"The file format is incorrect",desc:"File format of "+e.name+" is incorrect, please select jpg or png."})},handleMaxSize:function(e){this.$Notice.warning({title:"Exceeding file size limit",desc:"File  "+e.name+" is too large, no more than 2M."})},handleBeforeUpload:function(){var e=this.uploadList.length<5;return e||this.$Notice.warning({title:"Up to five pictures can be uploaded."}),e}},mounted:function(){this.uploadList=this.$refs.upload.fileList}}),l=c,d=(a("41f3"),a("2877")),u=Object(d["a"])(l,s,o,!1,null,null,null),m=(u.exports,a("7e1e")),f={name:"manager-page",comments:{Upload:void 0},data:function(){var e=this;return{modal1:!1,mobileValue:"",model4:"",current:1,total:0,statusList:["待付款","已发货","已完成"],columns4:[{title:"用户名",key:"username"},{title:"手机号",key:"mobile"},{title:"真实姓名",key:"realName"},{title:"权限",key:"access",render:function(e,t){var a=["primary","success","error","warning"],r=t.row.access.map((function(t,r){return e("Tag",{attrs:{color:a[r]}},t)}));return e("div",r)}},{title:"操作",render:function(t,a){var r=e;return t("div",[t("a",{style:{marginRight:"10px"},on:{click:function(){r.delAdmin(a.row.id)}}},"删除"),t("a",{on:{click:function(){r.editAdmin(a.index)}}},"编辑")])}}],data1:[],formValidate:{name:"",mobile:"",password:"",real_name:"",access:["admin"]},ruleValidate:{name:[{required:!0,message:"用户名不能为空",trigger:"blur"}],mobile:[{required:!0,message:"手机号不能为空",trigger:"blur"}],password:[{required:!0,message:"密码不能为空",trigger:"blur"}],real_name:[{required:!0,message:"真实姓名不能为空",trigger:"blur"}],access:[{type:"array",required:!0,message:"权限不能为空",trigger:"change"}]}}},mounted:function(){this.loadData()},methods:{loadData:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(m["b"])({page:this.current});case 2:t=e.sent,this.total=t.data.count,this.data1=t.data.data;case 5:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),addNewManger:function(){this.modal1=!this.modal1},delAdmin:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(m["c"])({id:t});case 2:a=e.sent,200==a.status?(that.data1.splice(params.index,1),this.$Message.success(a.data.message)):this.$Message.error(a.data.message);case 4:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),editAdmin:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.formValidate.name=this.data1[t].username,this.modal1=!this.modal1;case 2:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),ok:function(){var e=this;this.$refs["formValidate"].validate(function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(a){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!a){t.next=14;break}return t.next=3,Object(m["a"])(e.formValidate);case 3:if(r=t.sent,200!=r.status){t.next=11;break}return e.$Message.success("提交成功!"),t.next=8,e.loadData();case 8:e.modal1=!1,t.next=12;break;case 11:e.$Message.error(r.data.message);case 12:t.next=15;break;case 14:e.$Message.error("请填完整信息!");case 15:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())},cancel:function(){}}},p=f,h=(a("7e0a"),Object(d["a"])(p,r,n,!1,null,"ed4f3160",null));t["default"]=h.exports},bd16:function(e,t,a){}}]);