 var maxZIndex = 9;
 $(function() {
   $('#treeDemo').fileTree({
     onLoad: function() {
       $('#treeDemo a:contains("README.md")')[0].click();
     },
     expandSpeed: 100,
     collapseSpeed: 100,
     root: 'public/upload/doc/',
     script: '../filetree'
   }, function(file) {
     if (window["editor_code_" + file.replace(/\//g, "_")]) {
       $(".titles span").removeClass('select');
       $(document.getElementById("title_" + file.replace(/\//g, "_"))).addClass('select');
       window["editor_code_" + file.replace(/\//g, "_")].display.wrapper.style.zIndex = maxZIndex++;
       return;
     }

     debugger;

     $.ajax({
       url: "/getfile",
       type: "post",
       data: {
         path: file,
       },
       success: function(data) {
         $(".titles span").removeClass('select');
         $(".titles").append("<span class='select' id='title_" + file.replace(/\//g, "_") + "'>" + file.split('/')[file.split('/').length - 1] + "</span>");
         file = file.replace(/\//g, "_");
         var code = '<textarea id="code_' + file + '" name="code_' + file + '" style="visibility: hidden;"> ' + data + '</textarea>';
         $('.rn-main .file').append(code);
         var editor = showCode("code_" + file);
         editor.setValue(data);
         editor.display.wrapper.style.zIndex = maxZIndex++;
       }
     })
   });
 })