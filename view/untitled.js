 (function() {
     var Upload = function(url, token, file, filename, filedata, contentType) {
         var send = function() {
             var formData = new FormData;
             // formData.append("_wpnonce", _wpPluploadSettings.defaults.multipart_params._wpnonce);
             // formData.append("action", "upload-attachment");
             // formData.append("post_id", document.getElementById('post_ID').value);
             formData.append('async-upload', file, filename);
             var xhr = new XMLHttpRequest();
             xhr.open('post', url, true);
             xhr.send(formData);
             xhr.onload = function(fuckccd) {
                 var data = eval('(' + xhr.responseText + ')');
                 document.querySelector("#content_ifr").contentWindow.document.execCommand("insertImage", false, data.data.url)
             }
         };
         send();
     };

     function uploadFiles(files) {
         for (var i = 0; i < files.length; i++) {
             var ctype = files[i].type;
             var blob = files[i].getAsFile ? files[i].getAsFile() : files[i];
             var oFReader = new FileReader();
             oFReader.readAsBinaryString(blob);
             oFReader.onload = function() {
                 var url = decodeURIComponent("http://www.colacao.me/wp-admin/async-upload.php");
                 var type = blob.type;
                 var fileExtension = type.substring(type.indexOf("/") + 1, type.length);
                 var name = (+new Date()) + "." + fileExtension;
                 Upload(url, "", blob, name, this.result, ctype);
             }
         }
     };
     var pasteHandler = function(el) {
         el.addEventListener("paste", function(e) {
             if (e.clipboardData) {
                 uploadFiles(e.clipboardData.items);
             }
         }, false);
     };
     var drapHandler = function(el) {
         el.addEventListener("dragenter", function(e) {
             e.stopPropagation();
             e.preventDefault();
         }, false);
         el.addEventListener("dragover", function(e) {
             e.stopPropagation();
             e.preventDefault();
         }, false);
         el.addEventListener("drop", function(e) {
             e.stopPropagation();
             e.preventDefault();
             uploadFiles(e.dataTransfer.files);
         }, false);
     };

     (function() {
         if (document.querySelector(".rn-sider")) {
             drapHandler(document.querySelector(".rn-sider"));
             pasteHandler(document.querySelector(".rn-sider"));
         } else {
             setTimeout(arguments.callee, 1000);
         }
     })();
 });