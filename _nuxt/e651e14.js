(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{349:function(t,r,e){var content=e(352);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(89).default)("628d4674",content,!0,{sourceMap:!1})},350:function(t,r,e){var content=e(354);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(89).default)("4b017be1",content,!0,{sourceMap:!1})},351:function(t,r,e){"use strict";e(349)},352:function(t,r,e){var o=e(88)((function(i){return i[1]}));o.push([t.i,".VueToNuxtLogo{animation:turn 2s linear 1s forwards;display:inline-block;height:180px;overflow:hidden;position:relative;transform:rotateX(180deg);width:245px}.Triangle{height:0;left:0;position:absolute;top:0;width:0}.Triangle--one{border-bottom:180px solid #41b883;border-left:105px solid transparent;border-right:105px solid transparent}.Triangle--two{border-bottom:150px solid #3b8070;border-left:87.5px solid transparent;border-right:87.5px solid transparent;top:30px}.Triangle--three,.Triangle--two{animation:goright .5s linear 3.5s forwards;left:35px}.Triangle--three{border-bottom:120px solid #35495e;border-left:70px solid transparent;border-right:70px solid transparent;top:60px}.Triangle--four{animation:godown .5s linear 3s forwards;border-bottom:60px solid #fff;border-left:35px solid transparent;border-right:35px solid transparent;left:70px;top:120px}@keyframes turn{to{transform:rotateX(0deg)}}@keyframes godown{to{top:180px}}@keyframes goright{to{left:70px}}",""]),o.locals={},t.exports=o},353:function(t,r,e){"use strict";e(350)},354:function(t,r,e){var o=e(88)((function(i){return i[1]}));o.push([t.i,".volume{color:red;font-size:50px;font-weight:700}",""]),o.locals={},t.exports=o},355:function(t,r,e){"use strict";e.r(r);e(351);var o=e(83),n={components:{Logo:Object(o.a)({},(function(){this._self._c;return this._m(0)}),[function(){var t=this,r=t._self._c;return r("div",{staticClass:"VueToNuxtLogo"},[r("div",{staticClass:"Triangle Triangle--two"}),t._v(" "),r("div",{staticClass:"Triangle Triangle--one"}),t._v(" "),r("div",{staticClass:"Triangle Triangle--three"}),t._v(" "),r("div",{staticClass:"Triangle Triangle--four"})])}],!1,null,null,null).exports},head:{script:[{src:"./index.js",type:"text/javascript",body:!0}]}},l=(e(353),Object(o.a)(n,(function(){var t=this,r=t._self._c;return r("div",{staticClass:"container text-center"},[r("logo"),t._v(" "),r("h1",[t._v("音量測定ツール")]),t._v(" "),r("h3",{attrs:{id:"status"}},[t._v("初期化されていません")]),t._v(" "),t._m(0),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),r("b-button",{attrs:{id:"startButton",variant:"primary",onclick:"startRecording()",disabled:""}},[t._v("\n    測定開始\n  ")]),t._v(" "),r("b-button",{staticStyle:{display:"none"},attrs:{id:"stopButton",variant:"danger",onclick:"endRecording()",disabled:""}},[t._v("\n    測定停止\n  ")]),t._v(" "),r("hr"),t._v(" "),r("div",{attrs:{id:"completeLog"}}),t._v(" "),r("hr"),t._v(" "),r("canvas",{attrs:{id:"canvas"}})],1)}),[function(){var t=this._self._c;return t("div",{staticClass:"progress"},[t("div",{staticClass:"progress-bar progress-bar-striped progress-bar-animated",staticStyle:{width:"0%"},attrs:{id:"progressBar",role:"progressbar","aria-valuenow":"0","aria-valuemin":"0","aria-valuemax":"100"}})])},function(){var t=this,r=t._self._c;return r("h3",{attrs:{id:"maxInput"}},[t._v("input:"),r("span",{staticClass:"volume"},[t._v("0")]),t._v("dB")])},function(){var t=this,r=t._self._c;return r("h3",{attrs:{id:"maxSpectrums"}},[t._v("spectrums:"),r("span",{staticClass:"volume"},[t._v("0")]),t._v("dBFS/Hz")])}],!1,null,null,null));r.default=l.exports}}]);