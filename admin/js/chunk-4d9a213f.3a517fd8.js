(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4d9a213f"],{"5a2c":function(e,a,t){},"986b":function(e,a,t){"use strict";var r=t("5a2c"),n=t.n(r);n.a},b03a:function(e,a,t){"use strict";t.r(a);var r=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"order-wrapper"},[t("Button",{attrs:{type:"primary"},on:{click:e.addNewManger}},[e._v("新增管理员")]),t("div",{staticClass:"table",staticStyle:{"margin-top":"20px"}},[t("Table",{ref:"selection",attrs:{border:"",columns:e.columns4,data:e.data1}})],1),t("div",{staticClass:"page"},[t("Page",{attrs:{total:e.total,current:e.current}})],1),t("Modal",{attrs:{title:"新增管理员"},model:{value:e.modal1,callback:function(a){e.modal1=a},expression:"modal1"}},[t("Form",{ref:"formValidate",attrs:{model:e.formValidate,rules:e.ruleValidate,"label-width":80}},[t("FormItem",{attrs:{label:"用户名",prop:"name"}},[t("Input",{attrs:{placeholder:"请输入用户名"},model:{value:e.formValidate.name,callback:function(a){e.$set(e.formValidate,"name",a)},expression:"formValidate.name"}})],1),t("FormItem",{attrs:{label:"密码",prop:"password"}},[t("Input",{attrs:{type:"password",placeholder:"请输入密码"},model:{value:e.formValidate.password,callback:function(a){e.$set(e.formValidate,"password",a)},expression:"formValidate.password"}})],1),t("FormItem",{attrs:{label:"手机号",prop:"mobile"}},[t("Input",{attrs:{placeholder:"请输入手机号码"},model:{value:e.formValidate.mobile,callback:function(a){e.$set(e.formValidate,"mobile",a)},expression:"formValidate.mobile"}})],1),t("FormItem",{attrs:{label:"真实姓名",prop:"real_name"}},[t("Input",{attrs:{placeholder:"请输入真实姓名"},model:{value:e.formValidate.real_name,callback:function(a){e.$set(e.formValidate,"real_name",a)},expression:"formValidate.real_name"}})],1),t("FormItem",{attrs:{label:"权限",prop:"access"}},[t("Select",{attrs:{multiple:"",placeholder:"管理员权限"},model:{value:e.formValidate.access,callback:function(a){e.$set(e.formValidate,"access",a)},expression:"formValidate.access"}},[t("Option",{attrs:{value:"super_admin"}},[e._v("super_admin")]),t("Option",{attrs:{value:"admin"}},[e._v("admin")])],1)],1)],1),t("div",{attrs:{slot:"footer"},slot:"footer"},[t("Button",{attrs:{size:"large"},on:{click:e.cancel}},[e._v("取消")]),t("Button",{attrs:{type:"primary",size:"large"},on:{click:e.ok}},[e._v("提交")])],1)],1)],1)},n=[],s=(t("96cf"),t("3b8d")),i=t("7e1e"),o={name:"manager-page",data:function(){var e=this;return{modal1:!1,mobileValue:"",model4:"",current:1,total:0,statusList:["待付款","已发货","已完成"],columns4:[{title:"用户名",key:"username"},{title:"手机号",key:"mobile"},{title:"真实姓名",key:"realName"},{title:"权限",key:"access",render:function(e,a){var t=["primary","success","error","warning"],r=a.row.access.map((function(a,r){return e("Tag",{attrs:{color:t[r]}},a)}));return e("div",r)}},{title:"操作",render:function(a,t){var r=e;return a("div",[a("a",{style:{marginRight:"10px"},on:{click:function(){r.delAdmin(t.row.id)}}},"删除"),a("a",{on:{click:function(){r.editAdmin(t.index)}}},"编辑")])}}],data1:[],formValidate:{name:"",mobile:"",password:"",real_name:"",access:["admin"]},ruleValidate:{name:[{required:!0,message:"用户名不能为空",trigger:"blur"}],mobile:[{required:!0,message:"手机号不能为空",trigger:"blur"}],password:[{required:!0,message:"密码不能为空",trigger:"blur"}],real_name:[{required:!0,message:"真实姓名不能为空",trigger:"blur"}],access:[{type:"array",required:!0,message:"权限不能为空",trigger:"change"}]}}},mounted:function(){this.loadData()},methods:{loadData:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(i["b"])({page:this.current});case 2:a=e.sent,this.total=a.data.count,this.data1=a.data.data;case 5:case"end":return e.stop()}}),e,this)})));function a(){return e.apply(this,arguments)}return a}(),addNewManger:function(){this.modal1=!this.modal1},delAdmin:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(a){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(i["c"])({id:a});case 2:t=e.sent,200==t.status?(that.data1.splice(params.index,1),this.$Message.success(t.data.message)):this.$Message.error(t.data.message);case 4:case"end":return e.stop()}}),e,this)})));function a(a){return e.apply(this,arguments)}return a}(),editAdmin:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(a){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.formValidate.name=this.data1[a].username,this.modal1=!this.modal1;case 2:case"end":return e.stop()}}),e,this)})));function a(a){return e.apply(this,arguments)}return a}(),ok:function(){var e=this;this.$refs["formValidate"].validate(function(){var a=Object(s["a"])(regeneratorRuntime.mark((function a(t){var r;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(!t){a.next=14;break}return a.next=3,Object(i["a"])(e.formValidate);case 3:if(r=a.sent,200!=r.status){a.next=11;break}return e.$Message.success("提交成功!"),a.next=8,e.loadData();case 8:e.modal1=!1,a.next=12;break;case 11:e.$Message.error(r.data.message);case 12:a.next=15;break;case 14:e.$Message.error("请填完整信息!");case 15:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}())},cancel:function(){}}},l=o,c=(t("986b"),t("2877")),u=Object(c["a"])(l,r,n,!1,null,"48dbb62b",null);a["default"]=u.exports}}]);