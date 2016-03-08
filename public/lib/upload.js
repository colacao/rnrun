var Upload = function(url, token, file, filename, filedata, contentType,cb) {
    var send = function() {
        var formData = new FormData;
        // formData.append("_wpnonce", _wpPluploadSettings.defaults.multipart_params._wpnonce);
        // formData.append("action", "upload-attachment");
        formData.append("post_id", "abcdefg");
        formData.append("path", filename);

        formData.append('uploadImg', file, filename);
        var xhr = new XMLHttpRequest();
        xhr.open('post', url, true);
        xhr.send(formData);
        xhr.onload = function() {
           var data =JSON.parse(xhr.responseText);
                       cb(data);

            // document.querySelector("#content_ifr").contentWindow.document.execCommand("insertImage", false, data.data.url)
        }
    };
    send();
};
var drapHandler = function(el,cb) {
    el.addEventListener("dragenter", function(e) {
        e.stopPropagation();
        e.preventDefault();
    }, false);
    el.addEventListener("dragover", function(e) {
        e.stopPropagation();
        e.preventDefault();
    }, false);

    function traverseFileTree(item, path) {
        path = path || "";
        if (item.isFile) {
            item.file(function(file) {
                var ctype = file.type;
                var blob = file.getAsFile ? file.getAsFile() : file;
                var oFReader = new FileReader();
                oFReader.readAsBinaryString(blob);
                oFReader.onload = function() {
                    var url = decodeURIComponent("/upload/");
                    var type = blob.type;
                    var name = blob.name
                    Upload(url, "", blob, path + name, this.result, ctype,cb);
                }
            });
        } else if (item.isDirectory) {
            var dirReader = item.createReader();
            dirReader.readEntries(function(entries) {
                for (var i = 0; i < entries.length; i++) {
                    traverseFileTree(entries[i], path + item.name + "/");
                }
            });
        }
    }
    el.addEventListener("drop", function(e) {
        e.stopPropagation();
        e.preventDefault();
        for (var i = 0; i < e.dataTransfer.items.length; i++) {
            var entry = e.dataTransfer.items[i].webkitGetAsEntry();
            if (entry) {
                traverseFileTree(entry,"",cb);
            }
        }
    }, false);
};