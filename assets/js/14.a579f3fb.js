(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{279:function(t,a,n){"use strict";function e(t){t&&console.log(t)}n.d(a,"a",(function(){return e}))},321:function(t,a,n){"use strict";n.r(a);var e=n(279),o={name:"TagListDrawer",props:["tags"],methods:{moveTo:function(t){"/tag/ALL"===t?this.$router.push("/"):this.$router.push(t).catch(e.a)}}},s=n(35),c=Object(s.a)(o,(function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("div",{staticClass:"v-application"},[n("v-navigation-drawer",{attrs:{app:"",right:"",width:"200",permanent:""}},[n("v-row",{staticClass:"w-100; h-100 text-center",attrs:{align:"center"}},[n("v-col",{staticClass:"col-12"},t._l(t.tags,(function(a,e){return n("div",{key:e},[n("v-chip",{staticClass:"mt-3 font-weight-bold",staticStyle:{width:"150px"},attrs:{color:a.color,label:"","text-color":"white"},on:{click:function(n){return t.moveTo("/tag/"+a.tagName)}}},[n("v-icon",{attrs:{left:""}},[t._v("mdi-label")]),t._v("\n            "+t._s(a.tagName)+" ("+t._s(a.count)+")\n          ")],1)],1)})),0)],1)],1)],1)}),[],!1,null,"3c566dd0",null);a.default=c.exports}}]);