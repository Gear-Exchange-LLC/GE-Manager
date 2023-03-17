const express = require('express');
const app = express();
const http = require('http');
var cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");
require('dotenv').config()

const redis = require('redis');

const pdf = require('html-pdf');

const { print } = require('pdf-to-printer');

const client = redis.createClient(6379);

const { exec } = require('child_process');

var PDFDocument = require('pdfkit');

const crypto = require('crypto');

const { writeDatabase, readDatabase, connectDatabase, deleteDatabase } = require("./db-manager")

const { Client, Environment, ApiError } = require('square');
const { create } = require('domain');
const path = require('path');
const { read, file } = require('pdfkit');

// Square Client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
});
// Socket Server
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

const reverbAPIUrl = "https://api.reverb.com/api/listings"

async function createSquareLabel() {
try {
    // Retrieve all items from the Square catalog
    const { result: item } = await squareClient.catalogApi.retrieveCatalogObject("HLVQZQN7HMDCJOYLSWMQGOBL");

    // Define HTML template for label
    const labelTemplate = (item) => `
      <div style="display: flex; position: absolute; left: 0; top: 0; right: 0; bottom: 0; max-width: 1.35in; max-height: 0.48in; border: 1px solid black; padding: 10px;">
        <div style="font-size: 10px;"><svg id="barcode" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;"></svg></div>
        <script>
          JsBarcode("#barcode", "15368", {format: "code39", height: 15, width: 1, fontSize: "5px", paddingLeft: "0"});
        </script>
      </div>
    `;

    // Define HTML template for label sheet
    const labelSheetTemplate = (item) => `
    <!DOCTYPE html>
    <!-- Created by pdf2htmlEX (https://github.com/pdf2htmlEX/pdf2htmlEX) -->
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta charset="utf-8"/>
    <meta name="generator" content="pdf2htmlEX"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <style type="text/css">
    /*! 
     * Base CSS for pdf2htmlEX
     * Copyright 2012,2013 Lu Wang <coolwanglu@gmail.com> 
     * https://github.com/pdf2htmlEX/pdf2htmlEX/blob/master/share/LICENSE
     */#sidebar{position:absolute;top:0;left:0;bottom:0;width:250px;padding:0;margin:0;overflow:auto}#page-container{position:absolute;top:0;left:0;margin:0;padding:0;border:0}@media screen{#sidebar.opened+#page-container{left:250px}#page-container{bottom:0;right:0;overflow:auto}.loading-indicator{display:none}.loading-indicator.active{display:block;position:absolute;width:64px;height:64px;top:50%;left:50%;margin-top:-32px;margin-left:-32px}.loading-indicator img{position:absolute;top:0;left:0;bottom:0;right:0}}@media print{@page{margin:0}html{margin:0}body{margin:0;-webkit-print-color-adjust:exact}#sidebar{display:none}#page-container{width:auto;height:auto;overflow:visible;background-color:transparent}.d{display:none}}.pf{position:relative;background-color:white;overflow:hidden;margin:0;border:0}.pc{position:absolute;border:0;padding:0;margin:0;top:0;left:0;width:100%;height:100%;overflow:hidden;display:block;transform-origin:0 0;-ms-transform-origin:0 0;-webkit-transform-origin:0 0}.pc.opened{display:block}.bf{position:absolute;border:0;margin:0;top:0;bottom:0;width:100%;height:100%;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;user-select:none}.bi{position:absolute;border:0;margin:0;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;user-select:none}@media print{.pf{margin:0;box-shadow:none;page-break-after:always;page-break-inside:avoid}@-moz-document url-prefix(){.pf{overflow:visible;border:1px solid #fff}.pc{overflow:visible}}}.c{position:absolute;border:0;padding:0;margin:0;overflow:hidden;display:block}.t{position:absolute;white-space:pre;font-size:1px;transform-origin:0 100%;-ms-transform-origin:0 100%;-webkit-transform-origin:0 100%;unicode-bidi:bidi-override;-moz-font-feature-settings:"liga" 0}.t:after{content:''}.t:before{content:'';display:inline-block}.t span{position:relative;unicode-bidi:bidi-override}._{display:inline-block;color:transparent;z-index:-1}::selection{background:rgba(127,255,255,0.4)}::-moz-selection{background:rgba(127,255,255,0.4)}.pi{display:none}.d{position:absolute;transform-origin:0 100%;-ms-transform-origin:0 100%;-webkit-transform-origin:0 100%}.it{border:0;background-color:rgba(255,255,255,0.0)}.ir:hover{cursor:pointer}</style>
    <style type="text/css">
    /*! 
     * Fancy styles for pdf2htmlEX
     * Copyright 2012,2013 Lu Wang <coolwanglu@gmail.com> 
     * https://github.com/pdf2htmlEX/pdf2htmlEX/blob/master/share/LICENSE
     */@keyframes fadein{from{opacity:0}to{opacity:1}}@-webkit-keyframes fadein{from{opacity:0}to{opacity:1}}@keyframes swing{0{transform:rotate(0)}10%{transform:rotate(0)}90%{transform:rotate(720deg)}100%{transform:rotate(720deg)}}@-webkit-keyframes swing{0{-webkit-transform:rotate(0)}10%{-webkit-transform:rotate(0)}90%{-webkit-transform:rotate(720deg)}100%{-webkit-transform:rotate(720deg)}}@media screen{#sidebar{background-color:#2f3236;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjNDAzYzNmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2U9IiMxZTI5MmQiPjwvcGF0aD4KPC9zdmc+")}#outline{font-family:Georgia,Times,"Times New Roman",serif;font-size:13px;margin:2em 1em}#outline ul{padding:0}#outline li{list-style-type:none;margin:1em 0}#outline li>ul{margin-left:1em}#outline a,#outline a:visited,#outline a:hover,#outline a:active{line-height:1.2;color:#e8e8e8;text-overflow:ellipsis;white-space:nowrap;text-decoration:none;display:block;overflow:hidden;outline:0}#outline a:hover{color:#0cf}#page-container{background-color:#9e9e9e;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjOWU5ZTllIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=");-webkit-transition:left 500ms;transition:left 500ms}.pf{margin:13px auto;box-shadow:1px 1px 3px 1px #333;border-collapse:separate}.pc.opened{-webkit-animation:fadein 100ms;animation:fadein 100ms}.loading-indicator.active{-webkit-animation:swing 1.5s ease-in-out .01s infinite alternate none;animation:swing 1.5s ease-in-out .01s infinite alternate none}.checked{background:no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3goQDSYgDiGofgAAAslJREFUOMvtlM9LFGEYx7/vvOPM6ywuuyPFihWFBUsdNnA6KLIh+QPx4KWExULdHQ/9A9EfUodYmATDYg/iRewQzklFWxcEBcGgEplDkDtI6sw4PzrIbrOuedBb9MALD7zv+3m+z4/3Bf7bZS2bzQIAcrmcMDExcTeXy10DAFVVAQDksgFUVZ1ljD3yfd+0LOuFpmnvVVW9GHhkZAQcxwkNDQ2FSCQyRMgJxnVdy7KstKZpn7nwha6urqqfTqfPBAJAuVymlNLXoigOhfd5nmeiKL5TVTV+lmIKwAOA7u5u6Lped2BsbOwjY6yf4zgQQkAIAcedaPR9H67r3uYBQFEUFItFtLe332lpaVkUBOHK3t5eRtf1DwAwODiIubk5DA8PM8bYW1EU+wEgCIJqsCAIQAiB7/u253k2BQDDMJBKpa4mEon5eDx+UxAESJL0uK2t7XosFlvSdf0QAEmlUnlRFJ9Waho2Qghc1/U9z3uWz+eX+Wr+lL6SZfleEAQIggA8z6OpqSknimIvYyybSCReMsZ6TislhCAIAti2Dc/zejVNWwCAavN8339j27YbTg0AGGM3WltbP4WhlRWq6Q/btrs1TVsYHx+vNgqKoqBUKn2NRqPFxsbGJzzP05puUlpt0ukyOI6z7zjOwNTU1OLo6CgmJyf/gA3DgKIoWF1d/cIY24/FYgOU0pp0z/Ityzo8Pj5OTk9PbwHA+vp6zWghDC+VSiuRSOQgGo32UErJ38CO42wdHR09LBQK3zKZDDY2NupmFmF4R0cHVlZWlmRZ/iVJUn9FeWWcCCE4ODjYtG27Z2Zm5juAOmgdGAB2d3cBADs7O8uSJN2SZfl+WKlpmpumaT6Yn58vn/fs6XmbhmHMNjc3tzDGFI7jYJrm5vb29sDa2trPC/9aiqJUy5pOp4f6+vqeJ5PJBAB0dnZe/t8NBajx/z37Df5OGX8d13xzAAAAAElFTkSuQmCC)}}</style>
    <style type="text/css">
    .ff0{font-family:sans-serif;visibility:hidden;}
    @font-face{font-family:ff1;src:url('data:application/font-woff;base64,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')format("woff");}.ff1{font-family:ff1;line-height:0.942000;font-style:normal;font-weight:normal;visibility:visible;}
    .m0{transform:matrix(0.250000,0.000000,0.000000,0.250000,0,0);-ms-transform:matrix(0.250000,0.000000,0.000000,0.250000,0,0);-webkit-transform:matrix(0.250000,0.000000,0.000000,0.250000,0,0);}
    .v1{vertical-align:-7.600000px;}
    .v0{vertical-align:0.000000px;}
    .ls0{letter-spacing:0.000000px;}
    .sc_{text-shadow:none;}
    .sc0{text-shadow:-0.015em 0 transparent,0 0.015em transparent,0.015em 0 transparent,0 -0.015em  transparent;}
    @media screen and (-webkit-min-device-pixel-ratio:0){
    .sc_{-webkit-text-stroke:0px transparent;}
    .sc0{-webkit-text-stroke:0.015em transparent;text-shadow:none;}
    }
    .ws0{word-spacing:-7.560000px;}
    .ws1{word-spacing:0.000000px;}
    .fc0{color:rgb(0,0,0);}
    .fs2{font-size:20.000000px;}
    .fs0{font-size:28.000000px;}
    .fs1{font-size:40.000000px;}
    .y0{bottom:-0.500000px;}
    .y1{bottom:3.600000px;}
    .y4{bottom:10.760000px;}
    .y3{bottom:38.560000px;}
    .y2{bottom:48.940000px;}
    .h5{height:16.080000px;}
    .h4{height:22.512000px;}
    .h3{height:24.560000px;}
    .h2{height:64.800000px;}
    .h0{height:72.000000px;}
    .h1{height:72.500000px;}
    .w2{width:136.800000px;}
    .w0{width:153.000000px;}
    .w1{width:153.500000px;}
    .x0{left:0.000000px;}
    .x1{left:2.880000px;}
    .x4{left:23.660000px;}
    .x2{left:32.760000px;}
    .x3{left:60.790000px;}
    @media print{
    .v1{vertical-align:-10.133333pt;}
    .v0{vertical-align:0.000000pt;}
    .ls0{letter-spacing:0.000000pt;}
    .ws0{word-spacing:-10.080000pt;}
    .ws1{word-spacing:0.000000pt;}
    .fs2{font-size:26.666667pt;}
    .fs0{font-size:37.333333pt;}
    .fs1{font-size:53.333333pt;}
    .y0{bottom:-0.666667pt;}
    .y1{bottom:4.800000pt;}
    .y4{bottom:14.346667pt;}
    .y3{bottom:51.413333pt;}
    .y2{bottom:65.253333pt;}
    .h5{height:21.440000pt;}
    .h4{height:30.016000pt;}
    .h3{height:32.746667pt;}
    .h2{height:86.400000pt;}
    .h0{height:96.000000pt;}
    .h1{height:96.666667pt;}
    .w2{width:182.400000pt;}
    .w0{width:204.000000pt;}
    .w1{width:204.666667pt;}
    .x0{left:0.000000pt;}
    .x1{left:3.840000pt;}
    .x4{left:31.546667pt;}
    .x2{left:43.680000pt;}
    .x3{left:81.053333pt;}
    }
    </style>
    <script>
    /*
     Copyright 2012 Mozilla Foundation 
     Copyright 2013 Lu Wang <coolwanglu@gmail.com>
     Apachine License Version 2.0 
    */
    (function(){function b(a,b,e,f){var c=(a.className||"").split(/\s+/g);""===c[0]&&c.shift();var d=c.indexOf(b);0>d&&e&&c.push(b);0<=d&&f&&c.splice(d,1);a.className=c.join(" ");return 0<=d}if(!("classList"in document.createElement("div"))){var e={add:function(a){b(this.element,a,!0,!1)},contains:function(a){return b(this.element,a,!1,!1)},remove:function(a){b(this.element,a,!1,!0)},toggle:function(a){b(this.element,a,!0,!0)}};Object.defineProperty(HTMLElement.prototype,"classList",{get:function(){if(this._classList)return this._classList;
    var a=Object.create(e,{element:{value:this,writable:!1,enumerable:!0}});Object.defineProperty(this,"_classList",{value:a,writable:!1,enumerable:!1});return a},enumerable:!0})}})();
    </script>
    <script>
    (function(){/*
     pdf2htmlEX.js: Core UI functions for pdf2htmlEX 
     Copyright 2012,2013 Lu Wang <coolwanglu@gmail.com> and other contributors 
     https://github.com/pdf2htmlEX/pdf2htmlEX/blob/master/share/LICENSE 
    */
    var pdf2htmlEX=window.pdf2htmlEX=window.pdf2htmlEX||{},CSS_CLASS_NAMES={page_frame:"pf",page_content_box:"pc",page_data:"pi",background_image:"bi",link:"l",input_radio:"ir",__dummy__:"no comma"},DEFAULT_CONFIG={container_id:"page-container",sidebar_id:"sidebar",outline_id:"outline",loading_indicator_cls:"loading-indicator",preload_pages:3,render_timeout:100,scale_step:0.9,key_handler:!0,hashchange_handler:!0,view_history_handler:!0,__dummy__:"no comma"},EPS=1E-6;
    function invert(a){var b=a[0]*a[3]-a[1]*a[2];return[a[3]/b,-a[1]/b,-a[2]/b,a[0]/b,(a[2]*a[5]-a[3]*a[4])/b,(a[1]*a[4]-a[0]*a[5])/b]}function transform(a,b){return[a[0]*b[0]+a[2]*b[1]+a[4],a[1]*b[0]+a[3]*b[1]+a[5]]}function get_page_number(a){return parseInt(a.getAttribute("data-page-no"),16)}function disable_dragstart(a){for(var b=0,c=a.length;b<c;++b)a[b].addEventListener("dragstart",function(){return!1},!1)}
    function clone_and_extend_objs(a){for(var b={},c=0,e=arguments.length;c<e;++c){var h=arguments[c],d;for(d in h)h.hasOwnProperty(d)&&(b[d]=h[d])}return b}
    function Page(a){if(a){this.shown=this.loaded=!1;this.page=a;this.num=get_page_number(a);this.original_height=a.clientHeight;this.original_width=a.clientWidth;var b=a.getElementsByClassName(CSS_CLASS_NAMES.page_content_box)[0];b&&(this.content_box=b,this.original_scale=this.cur_scale=this.original_height/b.clientHeight,this.page_data=JSON.parse(a.getElementsByClassName(CSS_CLASS_NAMES.page_data)[0].getAttribute("data-data")),this.ctm=this.page_data.ctm,this.ictm=invert(this.ctm),this.loaded=!0)}}
    Page.prototype={hide:function(){this.loaded&&this.shown&&(this.content_box.classList.remove("opened"),this.shown=!1)},show:function(){this.loaded&&!this.shown&&(this.content_box.classList.add("opened"),this.shown=!0)},rescale:function(a){this.cur_scale=0===a?this.original_scale:a;this.loaded&&(a=this.content_box.style,a.msTransform=a.webkitTransform=a.transform="scale("+this.cur_scale.toFixed(3)+")");a=this.page.style;a.height=this.original_height*this.cur_scale+"px";a.width=this.original_width*this.cur_scale+
    "px"},view_position:function(){var a=this.page,b=a.parentNode;return[b.scrollLeft-a.offsetLeft-a.clientLeft,b.scrollTop-a.offsetTop-a.clientTop]},height:function(){return this.page.clientHeight},width:function(){return this.page.clientWidth}};function Viewer(a){this.config=clone_and_extend_objs(DEFAULT_CONFIG,0<arguments.length?a:{});this.pages_loading=[];this.init_before_loading_content();var b=this;document.addEventListener("DOMContentLoaded",function(){b.init_after_loading_content()},!1)}
    Viewer.prototype={scale:1,cur_page_idx:0,first_page_idx:0,init_before_loading_content:function(){this.pre_hide_pages()},initialize_radio_button:function(){for(var a=document.getElementsByClassName(CSS_CLASS_NAMES.input_radio),b=0;b<a.length;b++)a[b].addEventListener("click",function(){this.classList.toggle("checked")})},init_after_loading_content:function(){this.sidebar=document.getElementById(this.config.sidebar_id);this.outline=document.getElementById(this.config.outline_id);this.container=document.getElementById(this.config.container_id);
    this.loading_indicator=document.getElementsByClassName(this.config.loading_indicator_cls)[0];for(var a=!0,b=this.outline.childNodes,c=0,e=b.length;c<e;++c)if("ul"===b[c].nodeName.toLowerCase()){a=!1;break}a||this.sidebar.classList.add("opened");this.find_pages();if(0!=this.pages.length){disable_dragstart(document.getElementsByClassName(CSS_CLASS_NAMES.background_image));this.config.key_handler&&this.register_key_handler();var h=this;this.config.hashchange_handler&&window.addEventListener("hashchange",
    function(a){h.navigate_to_dest(document.location.hash.substring(1))},!1);this.config.view_history_handler&&window.addEventListener("popstate",function(a){a.state&&h.navigate_to_dest(a.state)},!1);this.container.addEventListener("scroll",function(){h.update_page_idx();h.schedule_render(!0)},!1);[this.container,this.outline].forEach(function(a){a.addEventListener("click",h.link_handler.bind(h),!1)});this.initialize_radio_button();this.render()}},find_pages:function(){for(var a=[],b={},c=this.container.childNodes,
    e=0,h=c.length;e<h;++e){var d=c[e];d.nodeType===Node.ELEMENT_NODE&&d.classList.contains(CSS_CLASS_NAMES.page_frame)&&(d=new Page(d),a.push(d),b[d.num]=a.length-1)}this.pages=a;this.page_map=b},load_page:function(a,b,c){var e=this.pages;if(!(a>=e.length||(e=e[a],e.loaded||this.pages_loading[a]))){var e=e.page,h=e.getAttribute("data-page-url");if(h){this.pages_loading[a]=!0;var d=e.getElementsByClassName(this.config.loading_indicator_cls)[0];"undefined"===typeof d&&(d=this.loading_indicator.cloneNode(!0),
    d.classList.add("active"),e.appendChild(d));var f=this,g=new XMLHttpRequest;g.open("GET",h,!0);g.onload=function(){if(200===g.status||0===g.status){var b=document.createElement("div");b.innerHTML=g.responseText;for(var d=null,b=b.childNodes,e=0,h=b.length;e<h;++e){var p=b[e];if(p.nodeType===Node.ELEMENT_NODE&&p.classList.contains(CSS_CLASS_NAMES.page_frame)){d=p;break}}b=f.pages[a];f.container.replaceChild(d,b.page);b=new Page(d);f.pages[a]=b;b.hide();b.rescale(f.scale);disable_dragstart(d.getElementsByClassName(CSS_CLASS_NAMES.background_image));
    f.schedule_render(!1);c&&c(b)}delete f.pages_loading[a]};g.send(null)}void 0===b&&(b=this.config.preload_pages);0<--b&&(f=this,setTimeout(function(){f.load_page(a+1,b)},0))}},pre_hide_pages:function(){var a="@media screen{."+CSS_CLASS_NAMES.page_content_box+"{display:none;}}",b=document.createElement("style");b.styleSheet?b.styleSheet.cssText=a:b.appendChild(document.createTextNode(a));document.head.appendChild(b)},render:function(){for(var a=this.container,b=a.scrollTop,c=a.clientHeight,a=b-c,b=
    b+c+c,c=this.pages,e=0,h=c.length;e<h;++e){var d=c[e],f=d.page,g=f.offsetTop+f.clientTop,f=g+f.clientHeight;g<=b&&f>=a?d.loaded?d.show():this.load_page(e):d.hide()}},update_page_idx:function(){var a=this.pages,b=a.length;if(!(2>b)){for(var c=this.container,e=c.scrollTop,c=e+c.clientHeight,h=-1,d=b,f=d-h;1<f;){var g=h+Math.floor(f/2),f=a[g].page;f.offsetTop+f.clientTop+f.clientHeight>=e?d=g:h=g;f=d-h}this.first_page_idx=d;for(var g=h=this.cur_page_idx,k=0;d<b;++d){var f=a[d].page,l=f.offsetTop+f.clientTop,
    f=f.clientHeight;if(l>c)break;f=(Math.min(c,l+f)-Math.max(e,l))/f;if(d===h&&Math.abs(f-1)<=EPS){g=h;break}f>k&&(k=f,g=d)}this.cur_page_idx=g}},schedule_render:function(a){if(void 0!==this.render_timer){if(!a)return;clearTimeout(this.render_timer)}var b=this;this.render_timer=setTimeout(function(){delete b.render_timer;b.render()},this.config.render_timeout)},register_key_handler:function(){var a=this;window.addEventListener("DOMMouseScroll",function(b){if(b.ctrlKey){b.preventDefault();var c=a.container,
    e=c.getBoundingClientRect(),c=[b.clientX-e.left-c.clientLeft,b.clientY-e.top-c.clientTop];a.rescale(Math.pow(a.config.scale_step,b.detail),!0,c)}},!1);window.addEventListener("keydown",function(b){var c=!1,e=b.ctrlKey||b.metaKey,h=b.altKey;switch(b.keyCode){case 61:case 107:case 187:e&&(a.rescale(1/a.config.scale_step,!0),c=!0);break;case 173:case 109:case 189:e&&(a.rescale(a.config.scale_step,!0),c=!0);break;case 48:e&&(a.rescale(0,!1),c=!0);break;case 33:h?a.scroll_to(a.cur_page_idx-1):a.container.scrollTop-=
    a.container.clientHeight;c=!0;break;case 34:h?a.scroll_to(a.cur_page_idx+1):a.container.scrollTop+=a.container.clientHeight;c=!0;break;case 35:a.container.scrollTop=a.container.scrollHeight;c=!0;break;case 36:a.container.scrollTop=0,c=!0}c&&b.preventDefault()},!1)},rescale:function(a,b,c){var e=this.scale;this.scale=a=0===a?1:b?e*a:a;c||(c=[0,0]);b=this.container;c[0]+=b.scrollLeft;c[1]+=b.scrollTop;for(var h=this.pages,d=h.length,f=this.first_page_idx;f<d;++f){var g=h[f].page;if(g.offsetTop+g.clientTop>=
    c[1])break}g=f-1;0>g&&(g=0);var g=h[g].page,k=g.clientWidth,f=g.clientHeight,l=g.offsetLeft+g.clientLeft,m=c[0]-l;0>m?m=0:m>k&&(m=k);k=g.offsetTop+g.clientTop;c=c[1]-k;0>c?c=0:c>f&&(c=f);for(f=0;f<d;++f)h[f].rescale(a);b.scrollLeft+=m/e*a+g.offsetLeft+g.clientLeft-m-l;b.scrollTop+=c/e*a+g.offsetTop+g.clientTop-c-k;this.schedule_render(!0)},fit_width:function(){var a=this.cur_page_idx;this.rescale(this.container.clientWidth/this.pages[a].width(),!0);this.scroll_to(a)},fit_height:function(){var a=this.cur_page_idx;
    this.rescale(this.container.clientHeight/this.pages[a].height(),!0);this.scroll_to(a)},get_containing_page:function(a){for(;a;){if(a.nodeType===Node.ELEMENT_NODE&&a.classList.contains(CSS_CLASS_NAMES.page_frame)){a=get_page_number(a);var b=this.page_map;return a in b?this.pages[b[a]]:null}a=a.parentNode}return null},link_handler:function(a){var b=a.target,c=b.getAttribute("data-dest-detail");if(c){if(this.config.view_history_handler)try{var e=this.get_current_view_hash();window.history.replaceState(e,
    "","#"+e);window.history.pushState(c,"","#"+c)}catch(h){}this.navigate_to_dest(c,this.get_containing_page(b));a.preventDefault()}},navigate_to_dest:function(a,b){try{var c=JSON.parse(a)}catch(e){return}if(c instanceof Array){var h=c[0],d=this.page_map;if(h in d){for(var f=d[h],h=this.pages[f],d=2,g=c.length;d<g;++d){var k=c[d];if(null!==k&&"number"!==typeof k)return}for(;6>c.length;)c.push(null);var g=b||this.pages[this.cur_page_idx],d=g.view_position(),d=transform(g.ictm,[d[0],g.height()-d[1]]),
    g=this.scale,l=[0,0],m=!0,k=!1,n=this.scale;switch(c[1]){case "XYZ":l=[null===c[2]?d[0]:c[2]*n,null===c[3]?d[1]:c[3]*n];g=c[4];if(null===g||0===g)g=this.scale;k=!0;break;case "Fit":case "FitB":l=[0,0];k=!0;break;case "FitH":case "FitBH":l=[0,null===c[2]?d[1]:c[2]*n];k=!0;break;case "FitV":case "FitBV":l=[null===c[2]?d[0]:c[2]*n,0];k=!0;break;case "FitR":l=[c[2]*n,c[5]*n],m=!1,k=!0}if(k){this.rescale(g,!1);var p=this,c=function(a){l=transform(a.ctm,l);m&&(l[1]=a.height()-l[1]);p.scroll_to(f,l)};h.loaded?
    c(h):(this.load_page(f,void 0,c),this.scroll_to(f))}}}},scroll_to:function(a,b){var c=this.pages;if(!(0>a||a>=c.length)){c=c[a].view_position();void 0===b&&(b=[0,0]);var e=this.container;e.scrollLeft+=b[0]-c[0];e.scrollTop+=b[1]-c[1]}},get_current_view_hash:function(){var a=[],b=this.pages[this.cur_page_idx];a.push(b.num);a.push("XYZ");var c=b.view_position(),c=transform(b.ictm,[c[0],b.height()-c[1]]);a.push(c[0]/this.scale);a.push(c[1]/this.scale);a.push(this.scale);return JSON.stringify(a)}};
    pdf2htmlEX.Viewer=Viewer;})();
    </script>
    <script>
    try{
    pdf2htmlEX.defaultViewer = new pdf2htmlEX.Viewer({});
    }catch(e){}
    </script>
    <title></title>
    </head>
    <body>
    <div id="sidebar">
    <div id="outline">
    </div>
    </div>
    <div id="page-container">
    <div id="pf1" class="pf w0 h0" data-page-no="1"><div class="pc pc1 w0 h0"><img class="bi x0 y0 w1 h1" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATMAAACRCAIAAAAgmchYAAAACXBIWXMAABYlAAAWJQFJUiTwAAAB8klEQVR42u3c0UrDQBBA0cwmIf/jf/uJ2fFhcAihKkJB0XOehm122wQvfZFGZi7ALzM8AlAmoExQJqBMUCagTECZoExAmaBMQJmgTECZgDJBmYAyQZmAMkGZgDIBZYIyAWWCMgFlgjIBZQLKBGUCygRlAsoEZQLKBJQJygSUCcoElAnKBJQJKBOUCSgTlAkoE5QJKBNQJigTUCYoE1AmKBNQJqBMUCagTFAmoExQJqBMQJmgTECZoExAmYAyQZmAMr8QEeu6rut6nue+7/u+Z2a/NMYYY0RErWRmRNT6nHPOuSxLDRGRmbW3rvnknOuuvqb03ENtjIjjOHrX7cC46JXrPV5fevgJ+yHUXYwx+nZq6DfNzL73Omfbtj6/rjnPsw68vS/KBGUCygRlAsoElAnKBJQJygSUCcoElAkoE5QJKBOUCSgTlAkoE1AmKBNQJigTUCYoE1AmoExQJqBMUCagTFAmoExAmaBM4Bk2j+BHZOZt+Gjx4a5vreA7E1AmKBNQJigTUCagTFAmoExQJs8XET2UnnsYY9RwHMecc85Zi7V+235d8Xj/wl+If+YC35mAMkGZgDJBmYAyAWWCMgFlgjIBZYIyAWUCygRlAsoEZQLKBGUCygSUCcoElAnKBJQJ/0eM95/ef3m9/gQ/8JPyDdRxcwAa+82/AAAAAElFTkSuQmCC"/><div class="c x1 y1 w2 h2"><div class="t m0 x2 h3 y2 ff1 fs0 fc0 sc0 ls0 ws0">$<span class="fs1 v1">69.00</span></div><div class="t m0 x2 h4 y3 ff1 fs0 fc0 sc0 ls0 ws1">(11568) MXR Phase 90</div><div class="t m0 x3 h5 y4 ff1 fs2 fc0 sc0 ls0">${item.itemData.variations[0].itemVariationData.sku}</div></div></div><div class="pi" data-data='{"ctm":[1.000000,0.000000,0.000000,1.000000,0.000000,0.000000]}'></div></div>
    <div id="pf2" class="pf w0 h0" data-page-no="2"><div class="pc pc2 w0 h0"><img class="bi x0 y0 w1 h1" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATMAAACRCAIAAAAgmchYAAAACXBIWXMAABYlAAAWJQFJUiTwAAACBUlEQVR42u3cQW7CMBBA0XicKPfpvXtEe7oYYUUgxKYqbfXeahSS2ER8sUG0zNyAXyY8AlAmoExQJqBMUCagTECZoExAmaBMQJmgTECZgDJBmYAyQZmAMkGZgDIBZYIyAWWCMgFlgjIBZQLKBGUCygRlAsoEZQLKBJQJygSUCcoElAnKBJQJKBOUCSgTlAkoE5QJKBNQJigTUCYoE1AmKBNQJqBMUCagTFAmoExQJqBMQJmgTECZoExAmYAyQZmAMl9orfXee+9jjOM4juPIzPVSREREvTrGqIOttTUs16vWDTMzMyMib+qcOee6z91aj0tERA3nec4517XXO6xhjFGrr6tquTnnvu+1RG2phpd73rathrXDzKwbrh3u+77WqnPWNu7eJsoEZQLKBGUCygSUCcoElAnKBJQJygSUCSgTlAkoE5QJKBOUCSgTUCYoE1AmKBNQJigTUCagTFAmoExQJqBMUCagTECZoEzgO+wewXtl5uN8Pfjs5LsjvfcxRs2tNQ/WdyagTFAmoExAmaBMQJmgTECZoEx+SGstIiKi5vr5Tg0RUcN5nnPOOWe7WJfXMMbovffe61b8+Q/Gsx+CAb4zAWWCMgFlgjIBZYIyAWUCygRlAsoEZQLKBGUCygSUCcoElAnKBJQJygSUCSgTlAkoE/6fFrc/4//4vP4pP/BO+QU8xn8naOd6fgAAAABJRU5ErkJggg=="/><div class="c x1 y1 w2 h2"><div class="t m0 x4 h3 y2 ff1 fs0 fc0 sc0 ls0 ws0">$<span class="fs1 v1">200.00</span></div><div class="t m0 x4 h4 y3 ff1 fs0 fc0 sc0 ls0 ws1">(15681) Ibanez AEG12IINMH</div><div class="t m0 x3 h5 y4 ff1 fs2 fc0 sc0 ls0">15681</div></div></div><div class="pi" data-data='{"ctm":[1.000000,0.000000,0.000000,1.000000,0.000000,0.000000]}'></div></div>
    </div>
    <div class="loading-indicator">
    <img alt="" src="data:image/png;base64,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"/>
    </div>
    </body>
    </html>
    
    `;

    // Define label sheet HTML
    let labelSheetHTML = '';
    console.log(item.object.itemData.variations[0].itemVariationData.priceMoney.amount.toString().split("n")[0] / 100)

    labelSheetHTML = labelSheetTemplate(item.object);

    // Generate PDF of label sheet
    const options = {
      width: "4.26in",
      height: "1.88in",
      orientation: 'portrait',
      border: {
        top: '4.26in',
        right: '1.88in',
        bottom: '4.26in',
        left: '1.88in',
      },
    };
    pdf.create(labelSheetHTML, options).toFile('labels/item-labels.pdf', (err, res) => {
      if (err) return console.log(err);
      console.log('PDF generated:', res.filename);

      const filePath = 'labels/item-labels.pdf';

      // const printerName = 'Printer_ThermalPrinter';
      const printerName = 'Brother_PT_P700';
  
      console.log(path.resolve("labels/item-labels.pdf"));
  
      const lpCommand = `lp -d "${printerName}" -o landscape -o media=Custom.0.94x2.34in  "${path.resolve(filePath)}"`;
      // exec(lpCommand, (error, stdout, stderr) => {
      //   if (error) {
      //     console.error(`lp command error: ${error}`);
      //   } else {
      //     console.log(`lp command output: ${stdout}`);
      //   }
      // });
    });

  } catch (error) {
    console.error('Error generating item labels: ', error);
  }
}

createSquareLabel()

async function createReverbListing(item) {
  return new Promise((resolve, reject) => {
    const url = reverbAPIUrl

    const data = {
      make: item.make,
      model: item.model,
      categories: [{
        "uuid": item.category
      }],
      condition: {
          "uuid": item.condition
      },
      photos: [],
      description: `${item.make} ${item.model}`,
      price: {
          amount: item.listPrice.includes(".") ? item.listPrice : item.listPrice + ".00",
          currency: "USD"
      },
      title: `(${item.sku}) ${item.make} ${item.model}`,
      sku: item.sku,
      upc_does_not_apply: "true",
      has_inventory: true,
      inventory: item.stock,
      offers_enabled: false,
      handmade: false,
  }

    const headers = {
      headers: {
        "content-type": "application/hal+json",
        "accept": "application/hal+json",
        "accept-version": "3.0",
        "authorization": "Bearer " + process.env.REVERB_ACCESS_TOKEN
      },
      body: JSON.stringify(data),
      method: "POST"
    }

    fetch(url, headers).then(data => { resolve(data.json()) }).catch(error => console.log(error));
  })
}

async function getSquareData() {
  let cursor = '';
  let hasMoreItems = true;
  let items = [];

  while (hasMoreItems) {
    const response = await squareClient.catalogApi.listCatalog(cursor);
    const { objects, cursor: nextCursor } = response;
    items = items.concat(objects);

    if (!nextCursor) {
      hasMoreItems = false;
    } else {
      cursor = nextCursor;
    }
  }

  // Sort items by SKU
  items.sort((a, b) => {
    const variationA = a.item_data.variations[0];
    const variationB = b.item_data.variations[0];
    if (variationA && variationB) {
      const skuA = variationA.sku ? variationA.sku.toUpperCase() : '';
      const skuB = variationB.sku ? variationB.sku.toUpperCase() : '';
      if (skuA < skuB) {
        return -1;
      }
      if (skuA > skuB) {
        return 1;
      }
    }
    return 0;
  });

  console.log(items);
}

async function createReverb(data) {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      
      await createReverbListing(item)

      resolve()
    }
  })
}


async function createSquareItem(data) {

  data.items.map(async (item, i) => {
    setTimeout(async () => {
      var make = item.make;
      var model = item.model;
  
      var price = item.listPrice;
  
      if (!price.includes(".")) {
        price = price + "00"
      }
      else {
        price = price.split(".")[0] + price.split(".")[1]
      }
  
      var stock = item.stock;
  
      var sku = item.sku;
  
      try {
        const objectResponse = await squareClient.catalogApi.upsertCatalogObject({
          idempotencyKey: crypto.randomUUID(),
          object: {
            type: 'ITEM',
            id: '#create-item',
            itemData: {
              name: `(${sku}) ${make} ${model}`,
              variations: [
                {
                  type: 'ITEM_VARIATION',
                  id: '#create-item-varient',
                  itemVariationData: {
                    sku: sku,
                    pricingType: 'FIXED_PRICING',
                    priceMoney: {
                      amount: price,
                      currency: 'USD'
                    },
                    trackInventory: true
                  }
                }
              ]
            }
          }
        });
  
        const stockResponse = await squareClient.inventoryApi.batchChangeInventory({
          idempotencyKey: crypto.randomUUID(),
          changes: [
            {
              type: 'PHYSICAL_COUNT',
              physicalCount: {
                catalogObjectId: objectResponse.result.catalogObject.itemData.variations[0].id,
                state: 'IN_STOCK',
                locationId: objectResponse.result.catalogObject.itemData.variations[0].itemVariationData.locationOverrides[0].locationId,
                quantity: stock.toString(),
                occurredAt: new Date().toISOString()
              }
            }
          ]
        });
  
      } catch(error) {
        console.log(error);
      }
    }, i * 1000)
  })
}

app.use(cors())

app.use(express.static(path.join(__dirname, "Site")))
app.use(express.static(path.join(__dirname, "barcodeFont")))

app.get('/barcodeFont.ttf', (req, res) => {
  res.sendFile(path.join(__dirname, "barcodeFont/free3of9.ttf"));
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "site/index.html"));
});

io.on('connection', async (socket) => {
  console.log('a user connected: ' + socket.id);

  socket.on("create-item", async (value) => {
    console.log(value);
    await createSquareItem(JSON.parse(value));
    
    await writeDatabase(value);

    io.to(socket.id).emit("created");

    io.emit("update", await readDatabase())
  })

  socket.on("set-complete", async (data) => {
    data.completed = !data.completed;

    await writeDatabase(JSON.stringify(data));

    socket.emit("data", await readDatabase())
    io.emit("update", await readDatabase())
  });

  socket.on("request-update", async (value) => {
    console.log("requested Update")

    const data = await readDatabase();
    io.to(socket.id).emit("update", data)
  });

  socket.on("get-data", async () => {
    const data = await readDatabase()
    io.to(socket.id).emit("data", data)
  })

  socket.on("create-reverb", async (data) => {
    await createReverb(data)

    data.reverbCreated = true;

    await writeDatabase(JSON.stringify(data));

    socket.emit("reverb")
    socket.emit("data", await readDatabase())
    io.emit("update", await readDatabase())
    console.log("Create Reverb")
  })

  socket.on("deleteItem", async (transactionID) => {

    await deleteDatabase(transactionID)

    socket.emit("delete-item", transactionID);
    io.emit("update", await readDatabase())
  })
});

server.listen(80, () => {
  console.log('listening on *:80');
  connectDatabase()
});