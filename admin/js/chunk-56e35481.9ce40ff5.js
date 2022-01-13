(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-56e35481"],{6104:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"order-wrapper"},[a("div",{staticClass:"filter-wrapper"},[a("DatePicker",{staticStyle:{margin:"0 20px",width:"200px"},attrs:{type:"date",placeholder:"请选择日期"}}),a("Select",{staticStyle:{width:"200px",margin:"0 20px"},attrs:{placeholder:"请选择黄/红牌"},model:{value:e.model4,callback:function(t){e.model4=t},expression:"model4"}},e._l(e.boardList,(function(t,r){return a("Option",{key:r,attrs:{value:t.value}},[e._v(e._s(t.name))])})),1),a("Select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择科室类别"},model:{value:e.model4,callback:function(t){e.model4=t},expression:"model4"}},e._l(e.statusList,(function(t,r){return a("Option",{key:r,attrs:{value:t.value}},[e._v(e._s(t.name))])})),1),a("Input",{staticStyle:{margin:"0 20px",width:"200px"},attrs:{placeholder:"请输入科室名称"},model:{value:e.mobileValue,callback:function(t){e.mobileValue=t},expression:"mobileValue"}}),a("Button",{staticStyle:{"margin-right":"20px"},attrs:{type:"primary",icon:"ios-search"}},[e._v("搜索")]),a("Button",{attrs:{icon:"ios-download-outline",type:"primary"}},[e._v("重置")])],1),a("Divider"),a("Button",{attrs:{type:"primary"},on:{click:e.addNewItem}},[e._v("黄红牌登记")]),a("Button",{staticStyle:{marginLeft:"20px"},attrs:{type:"primary"}},[e._v("表格导出")]),a("div",{staticClass:"table",staticStyle:{"margin-top":"20px"}},[a("Table",{ref:"selection",attrs:{border:"",columns:e.columns4,data:e.data1}})],1),a("div",{staticClass:"page"},[a("Page",{attrs:{total:e.total,current:e.current},on:{"on-change":e.changePage}})],1),a("Modal",{attrs:{title:"黄红牌登记"},model:{value:e.modal1,callback:function(t){e.modal1=t},expression:"modal1"}},[a("Form",{ref:"formValidate",attrs:{model:e.formValidate,rules:e.ruleValidate,"label-width":80}},[a("FormItem",{attrs:{label:"月份",prop:"month"}},[a("DatePicker",{staticStyle:{width:"200px"},attrs:{disabled:e.disabled,value:e.formValidate.month,format:"yyyy-MM",type:"month",placeholder:"请选择月份"},on:{"on-change":e.onDateChange}})],1),a("FormItem",{attrs:{label:"黄/红牌",prop:"cardName"}},[a("Select",{attrs:{disabled:e.disabled,placeholder:"请选择黄/红牌"},model:{value:e.formValidate.cardName,callback:function(t){e.$set(e.formValidate,"cardName",t)},expression:"formValidate.cardName"}},e._l(e.boardList,(function(t,r){return a("Option",{key:r,attrs:{value:t.value}},[e._v(e._s(t.name))])})),1)],1),a("FormItem",{attrs:{label:"黄/红牌张数",prop:"count"}},[a("Input",{attrs:{disabled:e.disabled,placeholder:"请输入黄/红牌张数"},model:{value:e.formValidate.count,callback:function(t){e.$set(e.formValidate,"count",t)},expression:"formValidate.count"}})],1),a("FormItem",{attrs:{label:"科室类别",prop:"type"}},[a("Select",{attrs:{"label-in-value":!0,disabled:e.disabled,placeholder:"请选择科室类别"},on:{"on-change":e.onChange},model:{value:e.formValidate.typeId,callback:function(t){e.$set(e.formValidate,"typeId",t)},expression:"formValidate.typeId"}},e._l(e.optionsList,(function(t,r){return a("Option",{key:r,attrs:{value:t._id}},[e._v(e._s(t.name))])})),1)],1),a("FormItem",{attrs:{label:"科室名称",prop:"name"}},[a("Select",{attrs:{"label-in-value":!0,disabled:e.disabled,placeholder:"请选择科室类别"},on:{"on-change":e.onNameChange},model:{value:e.formValidate.nameId,callback:function(t){e.$set(e.formValidate,"nameId",t)},expression:"formValidate.nameId"}},e._l(e.departList,(function(t,r){return a("Option",{key:r,attrs:{value:t._id}},[e._v(e._s(t.name))])})),1)],1)],1),a("div",{attrs:{slot:"footer"},slot:"footer"},[e.disabled?e._e():a("Button",{attrs:{type:"primary"},on:{click:function(t){return e.handleSubmit("formValidate")}}},[e._v("保存")])],1)],1)],1)},n=[],i=(a("96cf"),a("3b8d")),o=(a("7f7f"),a("7e1e")),l=a("90de"),s={name:"order-page",data:function(){var e=this;return{optionsList:[],total:0,departList:[],disabled:!1,current:1,modal1:!1,mobileValue:"",model4:"",boardList:[{name:"黄牌",value:"00"},{name:"红牌",value:"01"}],statusList:[{name:"临床科室",value:"00"},{name:"医技科室",value:"01"},{name:"行政后勤",value:"02"}],formValidate:{name:"",type:"",month:"",cardName:"",count:"",typeId:"",nameId:""},columns4:[{title:"序号",type:"index",width:100,align:"center"},{title:"月份",key:"month"},{title:"科室",key:"name"},{title:"黄/红牌",key:"cardName",render:function(e,t){var a={"00":"黄牌","01":"红牌"};return e("div",a[t.row.cardName])}},{title:"张数",key:"count"},{title:"编辑时间",key:"updated_at",render:function(e,t){return e("div",Object(l["b"])(t.row.updated_at,"year"))}},{title:"操作",render:function(t,a){var r=e;return t("div",[t("a",{style:{margin:"0 10px"},on:{click:function(){r.formValidate.name=a.row.name,r.formValidate.type=a.row.type,r.formValidate.month=a.row.month,r.formValidate.cardName=a.row.cardName,r.formValidate.count=a.row.count,r.disabled=!0,r.modal1=!r.modal1}}},"查看")])}}],data1:[],ruleValidate:{name:[{required:!0,message:"科室名称不能为空",trigger:"blur"}],count:[{required:!0,message:"红黄牌张数不能为空",trigger:"blur"}],month:[{required:!0,message:"月份不能为空",trigger:"change"}],cardName:[{required:!0,message:"红黄牌名称不能为空",trigger:"change"}],type:[{required:!0,message:"请选择科室类别",trigger:"change"}]}}},watch:{modal1:function(e){if(!e){for(var t in this.disabled=!1,this.formValidate)this.formValidate[t]="";this.$refs["formValidate"].resetFields()}}},mounted:function(){this.loadData(),this.getNames(),this.getTypes()},methods:{onNameChange:function(e){e&&(this.formValidate.name=e.label)},onChange:function(e){e&&(this.formValidate.type=e.label,this.departList=this.allNameList.filter((function(t){return t.type===e.label})))},getNames:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(o["l"])();case 2:t=e.sent,this.allNameList=t.data.data;case 4:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),getTypes:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(o["y"])();case 2:t=e.sent,this.optionsList=t.data.data;case 4:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),onDateChange:function(e){this.formValidate.month=e},changePage:function(e){this.current=e,this.loadData()},delProject:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}(),loadData:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(o["f"])({p:this.current-1});case 2:t=e.sent,this.total=t.data.count,this.data1=t.data.data;case 5:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),handleSubmit:function(e){var t=this;this.$refs[e].validate(function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(a){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!a){e.next=15;break}return e.next=3,Object(o["a"])(t.formValidate);case 3:if(r=e.sent,200!=r.status){e.next=11;break}return t.$Message.success("提交成功!"),e.next=8,t.loadData();case 8:t.modal1=!1,e.next=12;break;case 11:t.$Message.error(r.data.message);case 12:t.$Message.success("Success!"),e.next=16;break;case 15:t.$Message.error("请完成相应信息！");case 16:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())},addNewItem:function(){this.modal1=!this.modal1}}},c=s,d=(a("ae18"),a("2877")),u=Object(d["a"])(c,r,n,!1,null,"65b9f3d2",null);t["default"]=u.exports},ae18:function(e,t,a){"use strict";a("e65f")},e65f:function(e,t,a){}}]);