
var content = document.getElementById("content");

var text_area = document.getElementById("text_area");
var bottom_navbar = document.getElementById("bottom_navbar");
var top_navbar = document.getElementById("top_navbar");

var send_btn = document.getElementById("send_btn");
var send_btn_img = document.getElementById("send_btn_img");

var attachment_file = document.getElementById("attachment_file");
var attach_btn = document.getElementById("attach_btn");
var attach_btn_img = document.getElementById("attach_btn_img");

var filter_value_textedit = document.getElementById("filter_value");
var filter_btn = document.getElementById("filter_button");

var content_container = document.getElementById("content_container");
var view_manager = new ViewManager(content_container);

var content_id = 0;
var local_content_id = -1;

filter_btn.onclick = function()
{
    load_content();
}

filter_value_textedit.addEventListener("change", ()=>{
    load_content();
});

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

    var attachment_content_boxes = [];

    for (var i=0; i<file_list.length; i++)
    {
        var file = file_list[i];

        if (!file.name){ return; }

        var attachment_content_box = new AttachmentContentBox(local_content_id, view_manager);
        attachment_content_box.setTemplate(document.getElementById("_c_attachmentbox_template").innerHTML);

        view_manager.addContentBox(attachment_content_box);
        attachment_content_box.setFile(file);

        attachment_content_boxes.push(attachment_content_box);
        local_content_id -= 1;
    }
    
    if (file_list.length > 0)
    {
        view_manager.render();
    }

    for (var i=0; i<attachment_content_boxes.length; i++)
    {
        attachment_content_boxes[i].upload();
    }

    view_manager.focus(0);

}, false);

function add_item_to_view_manager(item_as_json_data)
{
    var content_added = false;

    if (item_as_json_data.content_type === "text")
    {
        var text_content_box = new TextContentBox(item_as_json_data.id, view_manager);

        text_content_box.setTemplate(document.getElementById("_c_textbox_template").innerHTML);
        text_content_box.setText(item_as_json_data.text);

        if (!view_manager.hasContentBoxWithID(item_as_json_data.id))
        {
            view_manager.addContentBox(text_content_box);
            content_added = true;
        }
        else
        {
            if (!text_content_box.isSimilar(view_manager.getContentBoxWithID(text_content_box.id)))
            {
                view_manager.replaceContentBoxWith(text_content_box);
                content_added = true;
            }
        }


        view_manager.addContentBoxReverse(text_content_box);
        text_content_box.state = text_content_box.states.SENT;
    }
    else if (item_as_json_data.content_type === "file")
    {
        var attachment_content_box = new AttachmentContentBox(item_as_json_data.id, view_manager);

        attachment_content_box.setTemplate(document.getElementById("_c_attachmentbox_template").innerHTML);
        attachment_content_box.filename = item_as_json_data.filename;

        if (!view_manager.hasContentBoxWithID(item_as_json_data.id))
        {
            view_manager.addContentBox(attachment_content_box);
            content_added = true;
        }
        else
        {
            if (!attachment_content_box.isSimilar(view_manager.getContentBoxWithID(attachment_content_box.id)))
            {
                view_manager.replaceContentBoxWith(attachment_content_box);
                content_added = true;
            }
        }

        attachment_content_box.state = attachment_content_box.states.SENT;
    }

    return content_added;
}

// TODO: handle when server deletes content -- refresh current page

function load_content()
{
    post_data("/get_items/30", {"filter":document.getElementById("filter_value").value}, (state, status, response)=>{

        if (state === 4 && status === 200)
        {
            var json_data = JSON.parse(response);

            if (!json_data.status){ return; }

            // view_manager.removeSentContent();
            var content_changed = false;

            var items = json_data.items;
            var item_ids = [];
            for (var i=0; i<items.length; i++)
            {
                item_ids.push(items[i].id);
                content_changed = add_item_to_view_manager(items[i]) || content_changed;
            }

            for (var i=view_manager.content_ids.length-1; i>=0; i--)
            {
                var id = view_manager.content_ids[i];

                if ( id >= 0 && list_contains(item_ids, id) == false )
                {
                    view_manager.removeContentBox( view_manager.getContentBoxWithID(id) );
                    content_changed =  true;
                }
            }

            if (content_changed)
            {
                view_manager.render();
            }
        }

    })
}

setTimeout(()=>{
    setInterval(load_content, 500);
}, 100);

load_content();