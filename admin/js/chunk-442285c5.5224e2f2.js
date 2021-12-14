(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-442285c5"],{"55d5":function(e,t,a){},c0f7:function(e,t,a){"use strict";var r=a("55d5"),n=a.n(r);n.a},e18c:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"order-wrapper"},[a("div",{staticClass:"filter-wrapper"},[a("Input",{staticStyle:{margin:"0 20px",width:"200px"},attrs:{placeholder:"角色"},model:{value:e.role,callback:function(t){e.role=t},expression:"role"}}),a("Input",{staticStyle:{margin:"0 20px",width:"200px"},attrs:{placeholder:"手机号"},model:{value:e.mobile,callback:function(t){e.mobile=t},expression:"mobile"}}),a("Input",{staticStyle:{margin:"0 20px",width:"200px"},attrs:{placeholder:"姓名"},model:{value:e.real_name,callback:function(t){e.real_name=t},expression:"real_name"}}),a("Button",{staticStyle:{"margin-right":"20px"},attrs:{type:"primary",icon:"ios-search"},on:{click:e.loadData}},[e._v("搜索")]),a("Button",{on:{click:e.onClear}},[e._v("重置")])],1),a("Divider"),a("Button",{attrs:{type:"primary"},on:{click:e.addNewManger}},[e._v("新增用户")]),a("div",{staticClass:"table",staticStyle:{"margin-top":"20px"}},[a("Table",{ref:"selection",attrs:{border:"",columns:e.columns4,data:e.data1}})],1),a("div",{staticClass:"page"},[a("Page",{attrs:{total:e.total,current:e.current},on:{"on-change":e.changePage}})],1),a("Modal",{attrs:{title:"用户信息维护"},model:{value:e.modal1,callback:function(t){e.modal1=t},expression:"modal1"}},[a("Form",{ref:"formValidate",attrs:{model:e.formValidate,rules:e.ruleValidate,"label-width":80}},[a("FormItem",{attrs:{label:"手机号",prop:"mobile"}},[a("Input",{attrs:{placeholder:"请输入手机号码"},model:{value:e.formValidate.mobile,callback:function(t){e.$set(e.formValidate,"mobile",t)},expression:"formValidate.mobile"}})],1),a("FormItem",{attrs:{label:"用户角色",prop:"role"}},[a("Input",{attrs:{placeholder:"请输入用户角色"},model:{value:e.formValidate.role,callback:function(t){e.$set(e.formValidate,"role",t)},expression:"formValidate.role"}})],1),a("FormItem",{attrs:{label:"姓名",prop:"real_name"}},[a("Input",{attrs:{placeholder:"请输入姓名"},model:{value:e.formValidate.real_name,callback:function(t){e.$set(e.formValidate,"real_name",t)},expression:"formValidate.real_name"}})],1)],1),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{size:"large"},on:{click:e.cancel}},[e._v("取消")]),a("Button",{attrs:{type:"primary",size:"large"},on:{click:e.ok}},[e._v("提交")])],1)],1)],1)},n=[],i=(a("96cf"),a("3b8d")),l=a("7e1e"),o=a("90de"),s={name:"manager-page",data:function(){var e=this;return{role:"",mobile:"",real_name:"",modal1:!1,mobileValue:"",model4:"",current:1,total:0,statusList:["待付款","已发货","已完成"],columns4:[{title:"序号",type:"index",width:100,align:"center"},{title:"手机号",key:"mobile"},{title:"用户角色",key:"role"},{title:"姓名",key:"realName"},{title:"编辑时间",key:"created_at",render:function(e,t){return e("div",Object(o["b"])(t.row.created_at,"year"))}},{title:"操作",render:function(t,a){var r=e;return t("div",[t("a",{style:{marginRight:"10px"},on:{click:function(){r.delAdmin(a.row.id,a.index)}}},"删除"),t("a",{on:{click:function(){r.editAdmin(a.index)}}},"编辑")])}}],data1:[],formValidate:{role:"",mobile:"",password:"abc123456",real_name:"",access:["admin"]},ruleValidate:{role:[{required:!0,message:"角色不能为空",trigger:"blur"}],mobile:[{required:!0,message:"手机号不能为空",trigger:"blur"}],password:[{required:!0,message:"密码不能为空",trigger:"blur"}],real_name:[{required:!1,message:"真实姓名不能为空",trigger:"blur"}],access:[{type:"array",required:!0,message:"权限不能为空",trigger:"change"}]}}},mounted:function(){this.loadData()},methods:{onClear:function(){this.role="",this.mobile="",this.real_name="",this.loadData()},changePage:function(e){this.current=e,this.loadData()},loadData:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(l["d"])({p:this.current-1,role:this.role,mobile:this.mobile,real_name:this.real_name});case 2:t=e.sent,this.total=t.data.count,this.data1=t.data.data;case 5:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),addNewManger:function(){this.modal1=!this.modal1},delAdmin:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t,a){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(l["f"])({id:t});case 2:r=e.sent,200===r.status?(this.data1.splice(a,1),this.$Message.success(r.data.message)):this.$Message.error(r.data.message);case 4:case"end":return e.stop()}}),e,this)})));function t(t,a){return e.apply(this,arguments)}return t}(),editAdmin:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.formValidate.name=this.data1[t].username,this.modal1=!this.modal1;case 2:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),ok:function(){var e=this;this.$refs["formValidate"].validate(function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(a){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!a){t.next=14;break}return t.next=3,Object(l["a"])(e.formValidate);case 3:if(r=t.sent,200!=r.status){t.next=11;break}return e.$Message.success("提交成功!"),t.next=8,e.loadData();case 8:e.modal1=!1,t.next=12;break;case 11:e.$Message.error(r.data.message);case 12:t.next=15;break;case 14:e.$Message.error("请填完整信息!");case 15:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())},cancel:function(){this.modal1=!this.modal1}}},c=s,u=(a("c0f7"),a("2877")),d=Object(u["a"])(c,r,n,!1,null,"a5c0036e",null);t["default"]=d.exports}}]);