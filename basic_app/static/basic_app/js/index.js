

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

attachment_file.onselectionchange = function()
{
    // console.log
}

attach_btn.onclick = function()
{
    attachment_file.click();
}

send_btn.onclick = function()
{
    if (!text_area.value)
    {
        return;
    }

    var text_content_box = new TextContentBox(content_id);
    text_content_box.setTemplate(document.getElementById("_c_textbox_template").innerHTML);

    view_manager.addContentBox(text_content_box);
    text_content_box.setText(text_area.value);

    view_manager.render();
    text_area.value = "";
    content_id += 1;

    view_manager.focus(0);
}

// var vaf = new ViewManager(content_container);

// var c_textbot_template = document.getElementById("_c_textbox_template");
// var foo = new TextContentBox(0);
// foo.setTemplate(c_textbot_template.innerHTML);

// var foo_1 = new TextContentBox(1);
// foo_1.setTemplate(c_textbot_template.innerHTML);

// var foo_2 = new TextContentBox(2);
// foo_2.setTemplate(c_textbot_template.innerHTML);

// var c_attachment_box_template = document.getElementById("_c_attachemntbox_template");
// var foo_3 = new AttachmentContentBox(3);
// foo_3.setTemplate(c_attachment_box_template.innerHTML);

// vaf.addContentBox(foo);
// vaf.addContentBox(foo_1);
// vaf.addContentBox(foo_2);
// vaf.addContentBox(foo_3);

// vaf.render();

// foo.setState(foo.states.SENT);
// foo_1.setState(foo.states.UPLOADING);
// foo_2.setState(foo.states.EDITING);