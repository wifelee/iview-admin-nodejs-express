(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-index-index"],{"219b":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=60,a={data:function(){return{userName:"",code:"",disabled:!1,text:"发送验证码"}},onLoad:function(){},methods:{sendSms:function(){var t=this,e=/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;if(!e.test(this.userName))return uni.showToast({title:"手机号格式错误",icon:"error"});if(60===r){var n=function e(){r>0?(t.text=r+"s后再发送",t.disabled=!0,r--,setTimeout((function(){return e()}),1e3)):(t.text="发送验证码",t.disabled=!1,r=60)};n(),this.sendSmsCode()}},sendSmsCode:function(){var t=this.userName;if(!/^1[3456789]\d{9}$/.test(t))return uni.showToast({title:"请输入手机号码",icon:"error"});uni.request({url:"http://".concat(this.$host,":3003/users/getSms"),method:"POST",data:{phone:t},success:function(t){200===t.statusCode?uni.showToast({title:"发送成功",icon:"success"}):uni.showToast({title:t.data.message,icon:"error"})}})},handleLogin:function(){var t=this.userName,e=this.code;return t?e?void uni.request({url:"http://".concat(this.$host,":3003/users/h5/login"),method:"POST",data:{name:t,code:e},success:function(t){200===t.statusCode?(uni.showToast({title:"登录成功",icon:"success"}),uni.setStorage({key:"token",data:t.data.token,success:function(){uni.navigateTo({url:"../form/form"})}}),uni.setStorage({key:"user",data:t.data.data})):uni.showToast({title:t.data.message,icon:"error"})}}):uni.showToast({title:"请输入验证码",icon:"error"}):uni.showToast({title:"请输入手机号码",icon:"error"})},onRedirect:function(){uni.navigateTo({url:"../form/form"})}}};e.default=a},"24fb":function(t,e,n){"use strict";function r(t,e){var n=t[1]||"",r=t[3];if(!r)return n;if(e&&"function"===typeof btoa){var o=a(r),i=r.sources.map((function(t){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(t," */")}));return[n].concat(i).concat([o]).join("\n")}return[n].join("\n")}function a(t){var e=btoa(unescape(encodeURIComponent(JSON.stringify(t)))),n="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(e);return"/*# ".concat(n," */")}t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=r(e,t);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,r){"string"===typeof t&&(t=[[null,t,""]]);var a={};if(r)for(var o=0;o<this.length;o++){var i=this[o][0];null!=i&&(a[i]=!0)}for(var s=0;s<t.length;s++){var u=[].concat(t[s]);r&&a[u[0]]||(n&&(u[2]?u[2]="".concat(n," and ").concat(u[2]):u[2]=n),e.push(u))}},e}},"4f06":function(t,e,n){"use strict";function r(t,e){for(var n=[],r={},a=0;a<e.length;a++){var o=e[a],i=o[0],s=o[1],u=o[2],c=o[3],d={id:t+":"+a,css:s,media:u,sourceMap:c};r[i]?r[i].parts.push(d):n.push(r[i]={id:i,parts:[d]})}return n}n.r(e),n.d(e,"default",(function(){return v}));var a="undefined"!==typeof document;if("undefined"!==typeof DEBUG&&DEBUG&&!a)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var o={},i=a&&(document.head||document.getElementsByTagName("head")[0]),s=null,u=0,c=!1,d=function(){},p=null,f="data-vue-ssr-id",l="undefined"!==typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function v(t,e,n,a){c=n,p=a||{};var i=r(t,e);return h(i),function(e){for(var n=[],a=0;a<i.length;a++){var s=i[a],u=o[s.id];u.refs--,n.push(u)}e?(i=r(t,e),h(i)):i=[];for(a=0;a<n.length;a++){u=n[a];if(0===u.refs){for(var c=0;c<u.parts.length;c++)u.parts[c]();delete o[u.id]}}}}function h(t){for(var e=0;e<t.length;e++){var n=t[e],r=o[n.id];if(r){r.refs++;for(var a=0;a<r.parts.length;a++)r.parts[a](n.parts[a]);for(;a<n.parts.length;a++)r.parts.push(g(n.parts[a]));r.parts.length>n.parts.length&&(r.parts.length=n.parts.length)}else{var i=[];for(a=0;a<n.parts.length;a++)i.push(g(n.parts[a]));o[n.id]={id:n.id,refs:1,parts:i}}}}function m(){var t=document.createElement("style");return t.type="text/css",i.appendChild(t),t}function g(t){var e,n,r=document.querySelector("style["+f+'~="'+t.id+'"]');if(r){if(c)return d;r.parentNode.removeChild(r)}if(l){var a=u++;r=s||(s=m()),e=y.bind(null,r,a,!1),n=y.bind(null,r,a,!0)}else r=m(),e=w.bind(null,r),n=function(){r.parentNode.removeChild(r)};return e(t),function(r){if(r){if(r.css===t.css&&r.media===t.media&&r.sourceMap===t.sourceMap)return;e(t=r)}else n()}}var b=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}();function y(t,e,n,r){var a=n?"":U(r.css);if(t.styleSheet)t.styleSheet.cssText=b(e,a);else{var o=document.createTextNode(a),i=t.childNodes;i[e]&&t.removeChild(i[e]),i.length?t.insertBefore(o,i[e]):t.appendChild(o)}}function w(t,e){var n=U(e.css),r=e.media,a=e.sourceMap;if(r&&t.setAttribute("media",r),p.ssrId&&t.setAttribute(f,e.id),a&&(n+="\n/*# sourceURL="+a.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */"),t.styleSheet)t.styleSheet.cssText=n;else{while(t.firstChild)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}var x=/%\?([+-]?\d+(\.\d+)?)\?%/g,S=/\.\?%PAGE\?%/g,T=/\?%PAGE\?%\[data-v-[a-z0-9]{8}\]/g,C=/uni-page-body\[data-v-[a-z0-9]{8}\]/g,N=/var\(--status-bar-height\)/gi,$=/var\(--window-top\)/gi,k=/var\(--window-bottom\)/gi,A=/var\(--window-left\)/gi,E=/var\(--window-right\)/gi;function U(t){var e=M();if("undefined"!==typeof uni&&!uni.canIUse("css.var")){var n=R();t=t.replace(N,"0px").replace($,n.top+"px").replace(k,n.bottom+"px").replace(A,"0px").replace(E,"0px")}return t.replace(T,e).replace(S,"").replace(C,"body."+e+" uni-page-body").replace(/\{[\s\S]+?\}|@media.+?\{/g,(function(t){return"undefined"===typeof uni?t:t.replace(x,(function(t,e){return uni.upx2px(e)+"px"}))}))}function M(){var t="function"===typeof getApp&&getApp();return t&&t.$route&&t.$route.meta&&t.$route.meta.name||""}function R(){var t="function"===typeof getApp&&getApp();return t&&t.$route&&t.$route.meta&&t.$route.meta.name?{top:t.$route.meta.windowTop,bottom:t.$route.meta.isTabBar?50:0}:{top:0,bottom:0}}},"5f91":function(t,e,n){"use strict";n.r(e);var r=n("6504"),a=n("9c2b");for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);n("fece");var i,s=n("f0c5"),u=Object(s["a"])(a["default"],r["b"],r["c"],!1,null,"2bb64295",null,!1,r["a"],i);e["default"]=u.exports},6504:function(t,e,n){"use strict";var r;n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return r}));var a=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-uni-view",{staticClass:"content"},[r("v-uni-view",{staticStyle:{"text-align":"center"}},[r("v-uni-image",{staticStyle:{width:"100px",margin:"20px auto 40px"},attrs:{src:n("d827"),mode:"widthFix"}})],1),r("v-uni-input",{attrs:{type:"text",placeholder:"请输入手机号码"},model:{value:t.userName,callback:function(e){t.userName=e},expression:"userName"}}),r("v-uni-view",{staticClass:"sms-wrapper"},[r("v-uni-input",{staticStyle:{width:"50%"},attrs:{type:"text",placeholder:"请输入短信验证码"},model:{value:t.code,callback:function(e){t.code=e},expression:"code"}}),r("v-uni-button",{staticClass:"btn",staticStyle:{width:"120px","font-size":"14px",height:"100%"},attrs:{disabled:t.disabled,size:"default",type:"primary"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.sendSms.apply(void 0,arguments)}}},[t._v(t._s(t.text))])],1),r("v-uni-button",{attrs:{type:"primary"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.handleLogin.apply(void 0,arguments)}}},[t._v("6s质量检查填报")])],1)},o=[]},"9c2b":function(t,e,n){"use strict";n.r(e);var r=n("219b"),a=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,(function(){return r[t]}))}(o);e["default"]=a.a},a7fb:function(t,e,n){var r=n("ba4e");"string"===typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);var a=n("4f06").default;a("9d67d842",r,!0,{sourceMap:!1,shadowMode:!1})},ba4e:function(t,e,n){var r=n("24fb");e=r(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */uni-page-body[data-v-2bb64295]{background:#f8f8f8;padding:40px}uni-input[data-v-2bb64295]{padding:10px;margin:20px 0;background:#fff;color:#999}.sms-wrapper[data-v-2bb64295]{position:relative}.sms-wrapper .btn[data-v-2bb64295]{padding:5px;position:absolute;right:0;top:0}body.?%PAGE?%[data-v-2bb64295]{background:#f8f8f8}',""]),t.exports=e},d827:function(t,e,n){t.exports=n.p+"static/img/logo.b56c218d.png"},fece:function(t,e,n){"use strict";var r=n("a7fb"),a=n.n(r);a.a}}]);