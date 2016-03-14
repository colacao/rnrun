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
           if( window["editor_code_" + file.replace(/\//g, "_")].display){
             window["editor_code_" + file.replace(/\//g, "_")].display.wrapper.style.zIndex = maxZIndex++;
         }else{
                         window["editor_code_" + file.replace(/\//g, "_")].style.zIndex = maxZIndex++;

         }
             return;
       
         }

         if (file.split('/')[file.split('/').length - 1] == "README.md") {
             $.ajax({
                 url: "/makedown/1",
                 success: function(data) {
                     $(".titles span").removeClass('select');
                 $(".titles").append("<span class='select' id='title_" + file.replace(/\//g, "_") + "'>" + file.split('/')[file.split('/').length - 1] + "</span>");
                 file = file.replace(/\//g, "_");
                 var code = '<div id="code_' + file + '" name="code_' + file + '" style=""> ' + data + '</div>';
                 var t = document.createElement('div');
                 t.innerHTML = code;
                 var el = t.removeChild(t.firstChild);
                 $('.rn-main .file').append(el);
                 
   window["editor_code_"+file] = el;
                
                }
            });
             return;
         }


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