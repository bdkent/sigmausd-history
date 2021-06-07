(this["webpackJsonpsigmausd-history"]=this["webpackJsonpsigmausd-history"]||[]).push([[0],{192:function(e,t,a){},194:function(e,t,a){},335:function(e,t,a){"use strict";a.r(t);var r=a(1),n=a.n(r),s=a(72),c=a.n(s),i=(a(192),a(23)),o=a(32),l=a.n(o),d=a(65),b=a(26),j=a(33),u=a(25),h=(a(194),a(195),a(36)),m=a(48),O=a.n(m),x=a(337),p=a(338),f=a(342),v=a(177),g=a(178),y=a(83),k=a(183),N=a(171),w=a(118),T=a.n(w);function D(){var e=h.DateTime.now().toUTC();return h.DateTime.utc(e.year,e.month,e.day)}function S(e){return"".concat(e.year,"-").concat(T()(e.month.toString(),2,"0"),"-").concat(T()(e.day.toString(),2,"0"))}var C=a(286),R=a(288).default,F=new C.Connection(new Worker(R));function I(e){return L.apply(this,arguments)}function L(){return(L=Object(d.a)(l.a.mark((function e(t){var a,r,n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=S(t),r="".concat("/sigmausd-history","/data/daily/").concat(a,".json"),e.next=4,fetch(r);case 4:return n=e.sent,e.next=7,n.json();case 7:return e.abrupt("return",e.sent);case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var M=!1;function K(){return(K=Object(d.a)(l.a.mark((function e(){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F.initDb({name:"sigmausd",tables:[{name:"Items",columns:{id:{primaryKey:!0,dataType:"number"},time:{notNull:!0,dataType:"string"},reserveRatio:{notNull:!0,dataType:"string"},stableCoinPrice:{notNull:!0,dataType:"string"},stableCoinRatio:{notNull:!0,dataType:"string"},reserveCoinPrice:{notNull:!0,dataType:"string"},reserveCoinRatio:{notNull:!0,dataType:"string"}}}]});case 2:M=e.sent;case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function E(e){return H.apply(this,arguments)}function H(){return(H=Object(d.a)(l.a.mark((function e(t){var a,r,n,s,c;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=D(),r=a.equals(t),!M||r){e.next=9;break}return n=t.plus({days:1}).minus({minutes:5}),e.next=6,F.select({from:"Items",where:{id:{"-":{low:t.toMillis(),high:n.toMillis()}}}});case 6:if(!((s=e.sent).length>0)){e.next=9;break}return e.abrupt("return",s);case 9:return e.next=11,I(t);case 11:if(c=e.sent,!M||r){e.next=15;break}return e.next=15,F.insert({into:"Items",upsert:!0,values:c.map((function(e){return Object(j.a)(Object(j.a)({},e),{},{id:h.DateTime.fromISO(e.time).toMillis()})}))});case 15:return e.abrupt("return",c);case 16:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){K.apply(this,arguments)}();var P=a(5),U=function(){var e=Object(r.useState)({}),t=Object(u.a)(e,2),a=t[0],n=t[1],s=Object(r.useState)(function(){var e=D();return{start:e,end:e}}()),c=Object(u.a)(s,2),o=c[0],m=c[1],w=Object(r.useCallback)((function(e,t){n((function(a){return Object(j.a)(Object(j.a)({},a),{},Object(b.a)({},e,t))}))}),[]);Object(r.useEffect)((function(){var e=S(o.start),t=S(o.end);(function(){var r=Object(d.a)(l.a.mark((function r(){return l.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(a[e]){r.next=7;break}return r.t0=w,r.t1=e,r.next=5,E(o.start);case 5:r.t2=r.sent,(0,r.t0)(r.t1,r.t2);case 7:if(e===t||a[t]){r.next=14;break}return r.t3=w,r.t4=t,r.next=12,E(o.end);case 12:r.t5=r.sent,(0,r.t3)(r.t4,r.t5);case 14:case"end":return r.stop()}}),r)})));return function(){return r.apply(this,arguments)}})()()}),[w,o,a]);var T=Object(r.useCallback)((function(){m((function(e){return a[S(e.start)]?Object(j.a)(Object(j.a)({},e),{},{start:e.start.minus(h.Duration.fromObject({days:1}))}):e}))}),[a]),C=Object(r.useMemo)((function(){var e=O()(Object.keys(a));return e.reduce((function(e,t){var r;return[].concat(Object(i.a)(e),Object(i.a)(null!==(r=a[t])&&void 0!==r?r:[]))}),[]).reduce((function(t,a,r){return r%Math.pow(e.length,2)===0?[].concat(Object(i.a)(t),[{label:h.DateTime.fromISO(a.time).toLocaleString(h.DateTime.DATETIME_SHORT),reserveRatio:parseInt(a.reserveRatio,10),stable:Math.round(100*parseFloat(a.stableCoinRatio))/100,reserve:parseInt(a.reserveCoinRatio,10)}]):t}),[])}),[a]);return Object(P.jsxs)("div",{className:"App container",children:[Object(P.jsx)("a",{className:"github-fork-ribbon",href:"https://github.com/bdkent/sigmausd-history","data-ribbon":"Fork me on GitHub",title:"Fork me on GitHub",target:"_blank",rel:"noreferrer",children:"Fork me on GitHub"}),Object(P.jsx)("h1",{children:"SigmaUSD History"}),Object(P.jsxs)("h2",{children:[o.start.toLocaleString(h.DateTime.DATE_FULL),!o.start.equals(o.end)&&Object(P.jsxs)(P.Fragment,{children:[" ","\u2014"," ",o.end.toLocaleString(h.DateTime.DATE_FULL)]})]}),Object(P.jsx)("button",{className:"btn btn-primary",onClick:T,children:"Load Previous Day"}),Object(P.jsx)("hr",{}),Object(P.jsx)("div",{className:"row",children:Object(P.jsx)("div",{className:"col",children:Object(P.jsxs)("div",{className:" card text-dark bg-light mb-3",children:[Object(P.jsx)("div",{className:"card-header",children:"Reserve Ratio (%)"}),Object(P.jsx)("div",{className:"card-body ",children:Object(P.jsx)("div",{className:"reserveRatioChartWrapper",children:C&&Object(P.jsx)(x.a,{width:"100%",height:200,children:Object(P.jsxs)(p.a,{width:730,height:250,data:C,margin:{top:5,right:30,left:20,bottom:5},children:[Object(P.jsx)(f.a,{strokeDasharray:"3 3"}),Object(P.jsx)(v.a,{dataKey:"label"}),Object(P.jsx)(g.a,{}),Object(P.jsx)(y.a,{}),Object(P.jsx)(k.a,{type:"monotone",dataKey:"reserveRatio",stroke:"#8884d8"}),Object(P.jsx)(N.a,{y1:400,y2:800,fill:"green",opacity:.25,alwaysShow:!0})]})})})})]})})}),Object(P.jsxs)("div",{className:"row",children:[Object(P.jsx)("div",{className:"col",children:Object(P.jsxs)("div",{className:" card text-dark bg-light mb-3",children:[Object(P.jsx)("div",{className:"card-header",children:"SigmaUSD ($)"}),Object(P.jsx)("div",{className:"card-body ",children:Object(P.jsx)("div",{className:"reserveRatioChartWrapper",children:C&&Object(P.jsx)(x.a,{width:"100%",height:200,children:Object(P.jsxs)(p.a,{width:730,height:250,data:C,margin:{top:5,right:30,left:20,bottom:5},children:[Object(P.jsx)(f.a,{strokeDasharray:"3 3"}),Object(P.jsx)(v.a,{dataKey:"label"}),Object(P.jsx)(g.a,{}),Object(P.jsx)(y.a,{}),Object(P.jsx)(k.a,{type:"monotone",dataKey:"stable",stroke:"#8884d8"})]})})})})]})}),Object(P.jsx)("div",{className:"col",children:Object(P.jsxs)("div",{className:" card text-dark bg-light mb-3",children:[Object(P.jsx)("div",{className:"card-header",children:"SigmaRSV"}),Object(P.jsx)("div",{className:"card-body ",children:Object(P.jsx)("div",{className:"reserveRatioChartWrapper",children:C&&Object(P.jsx)(x.a,{width:"100%",height:200,children:Object(P.jsxs)(p.a,{width:730,height:250,data:C,margin:{top:5,right:30,left:20,bottom:5},children:[Object(P.jsx)(f.a,{strokeDasharray:"3 3"}),Object(P.jsx)(v.a,{dataKey:"label"}),Object(P.jsx)(g.a,{}),Object(P.jsx)(y.a,{}),Object(P.jsx)(k.a,{type:"monotone",dataKey:"reserve",stroke:"#8884d8"})]})})})})]})})]}),Object(P.jsx)("hr",{}),Object(P.jsx)("footer",{className:"navbar navbar-expand-lg navbar-light bg-light",children:Object(P.jsx)("div",{className:"container-fluid",children:Object(P.jsx)("ul",{className:"navbar-nav",children:Object(P.jsx)("li",{className:"nav-item",children:Object(P.jsx)("a",{href:"http://sigmausd.io",className:"nav-link",children:"sigmausd.io"})})})})})]})},A=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,344)).then((function(t){var a=t.getCLS,r=t.getFID,n=t.getFCP,s=t.getLCP,c=t.getTTFB;a(e),r(e),n(e),s(e),c(e)}))},W=a(42),_=a(182);W.b.register(_.a),c.a.render(Object(P.jsx)(n.a.StrictMode,{children:Object(P.jsx)(U,{})}),document.getElementById("root")),A()}},[[335,1,2]]]);
//# sourceMappingURL=main.4fcea6bd.chunk.js.map