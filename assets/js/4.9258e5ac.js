(window.webpackJsonp=window.webpackJsonp||[]).push([[4,8],{280:function(t,e,n){},281:function(t,e,n){},304:function(t,e,n){"use strict";var s=n(280);n.n(s).a},305:function(t,e,n){"use strict";var s=n(281);n.n(s).a},315:function(t,e,n){"use strict";n.r(e);var s={name:"ContentTitle.vue",props:["Tag"],data:function(){return{tags:[],mobile:!1}},computed:{post:function(){return Object.assign({post:""},this.$page.frontmatter)}},beforeMount:function(){this.changePageViewer(),window.addEventListener("resize",this.changePageViewer)},methods:{changePageViewer:function(){this.mobile=window.innerWidth<1200}}},a=(n(304),n(35)),i=Object(a.a)(s,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"v-application d-block content-title"},[n("v-row",{staticStyle:{width:"100%"}},[n("div",{staticClass:"w-90 mx-auto"},[n("h1",{class:t.mobile?"mobile-post-title":""},[t._v(t._s(t.post.title))])]),t._v(" "),n("div",{staticClass:"text--primary text-right w-95 mr-5 my-2"},[t._v("\n            작성일: "+t._s(t.post.date)+"\n        ")]),t._v(" "),n("div",{staticClass:"w-100 text-center"},[t.Tag?n(t.Tag,{tag:"component",attrs:{tags:t.post.tags}}):t._e()],1),t._v(" "),n("hr",{staticClass:"content-divider"})])],1)}),[],!1,null,"70505fd9",null);e.default=i.exports},316:function(t,e,n){"use strict";n.r(e);n(285);var s={name:"Disqus",mounted:function(){var t,e;t=document,(e=t.createElement("script")).src="https://vuepress-blog.disqus.com/embed.js",e.setAttribute("data-timestamp",String(new Date)),(t.head||t.body).appendChild(e)}},a=(n(305),n(35)),i=Object(a.a)(s,(function(){var t=this.$createElement;return(this._self._c||t)("div",{attrs:{id:"disqus_thread"}})}),[],!1,null,"7be5fb81",null);e.default=i.exports},355:function(t,e,n){"use strict";n.r(e);var s=n(352),a=n(315),i=n(316),o={name:"Layout",data:function(){return{ContentTitle:null,Tag:null}},components:{ParentLayout:s.a,Disqus:i.default,ContentTitle:a.default}},r=n(35),u=Object(r.a)(o,(function(){var t=this.$createElement,e=this._self._c||t;return e("ParentLayout",[this.$frontmatter.title?e("ContentTitle",{attrs:{slot:"page-top"},slot:"page-top"}):this._e(),this._v(" "),this.$frontmatter.title?e("Disqus",{attrs:{slot:"page-bottom"},slot:"page-bottom"}):this._e()],1)}),[],!1,null,"3e65a26a",null);e.default=u.exports}}]);