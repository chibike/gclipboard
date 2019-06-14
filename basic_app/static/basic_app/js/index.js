

// $('#text_area').autoResize();

var content = document.getElementById("content");

var text_area = document.getElementById("text_area");
var bottom_navbar = document.getElementById("bottom_navbar");
var top_navbar = document.getElementById("top_navbar");

var send_btn = document.getElementById("send_btn");
var send_btn_img = document.getElementById("send_btn_img");

var attachment_file = document.getElementById("attachment_file");
var attach_btn = document.getElementById("attach_btn");
var attach_btn_img = document.getElementById("attach_btn_img");

var content_container = document.getElementById("content_container");
var view_manager = new ViewManager(content_container);

var content_id = 0;
var local_content_id = -1;

send_btn.onmouseover = function()
{
    send_btn_img.src = "/static/icons/brown/send-button.svg";
}

send_btn.onmouseout = function()
{
    send_btn_img.src = "/static/icons/send-button.svg";
}

attach_btn.onmouseover = function()
{
    attach_btn_img.src = "/static/icons/brown/add.svg";
}

attach_btn.onmouseout = function()
{
    attach_btn_img.src = "/static/icons/add.svg";
}

function replaceAll(str, find, replace)
{
    return str.replace(new RegExp(find, 'g'), replace);
}

text_area.oninput = auto_resize;

attach_btn.onclick = function()
{
    attachment_file.click();
}

send_btn.onclick = function()
{
    if (!text_area.value) { return; }

    var text_content_box = new TextContentBox(local_content_id, view_manager);
    text_content_box.setTemplate(document.getElementById("_c_textbox_template").innerHTML);

    view_manager.addContentBox(text_content_box);
    text_content_box.setText(text_area.value);

    view_manager.render();
    text_area.value = "";
    local_content_id -= 1;

    view_manager.focus(0);

    setTimeout(()=>{
        text_content_box.upload.call(text_content_box)
    }, 3000);
}

attachment_file.addEventListener("change", ()=>{
    const file_list = attachment_file.files;

    for (var i=0; i<file_list.length; i++)
    {
        var file = file_list[i];

        if (!file.name){ return; }

        var attachment_content_box = new AttachmentContentBox(local_content_id, view_manager);
        attachment_content_box.setTemplate(document.getElementById("_c_attachmentbox_template").innerHTML);

        view_manager.addContentBox(attachment_content_box);
        attachment_content_box.setFile(file);

        setTimeout(()=>{
            attachment_content_box.upload.call(attachment_content_box)
        }, 3000);

        local_content_id -= 1;
    }

    if (file_list.length > 0)
    {
        view_manager.render();
    }

    view_manager.focus(0);

}, false);

function load_content()
{
    post_data("/get_items/30", {}, (state, status, response)=>{

        if (state == 4 && status == 200)
        {
            var json_data = JSON.parse(response);
            if (!json_data.status){ return; }

            view_manager.removeSentContent();

            var items = json_data.items;
            for (var i=0; i<items.length; i++)
            {
                var item = items[i];
                var id = item.id;
                var type = item.content_type;

                if (type === "text")
                {
                    var text = item.text;
                    var text_content_box = new TextContentBox(id, view_manager);

                    text_content_box.setTemplate(document.getElementById("_c_textbox_template").innerHTML);
                    view_manager.addContentBoxReverse(text_content_box);
                    text_content_box.setText(text);

                    text_content_box.state = text_content_box.states.SENT;

                }
                else if (type === "file")
                {
                    var filename = item.filename;
                    var attachment_content_box = new AttachmentContentBox(id, view_manager);

                    attachment_content_box.setTemplate(document.getElementById("_c_attachmentbox_template").innerHTML);
                    view_manager.addContentBoxReverse(attachment_content_box);
                    attachment_content_box.filename = filename;

                    attachment_content_box.state = attachment_content_box.states.SENT;
                }
            }

            view_manager.render();
        }
    })
}

setTimeout(()=>{
    setInterval(load_content, 3000);
}, 2000);

load_content();