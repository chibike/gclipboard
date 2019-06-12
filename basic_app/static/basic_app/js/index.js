

// $('#text_area').autoResize();

var content = document.getElementById("content");

var text_area = document.getElementById("text_area");
var bottom_navbar = document.getElementById("bottom_navbar");
var top_navbar = document.getElementById("top_navbar");

var send_btn = document.getElementById("send_btn");
var send_btn_img = document.getElementById("send_btn_img");

var attach_btn = document.getElementById("attach_btn");
var attach_btn_img = document.getElementById("attach_btn_img");

var content_container = document.getElementById("content_container");

// function apply_style_to_textbox_icons()
// {
//     var x = document.getElementsByClassName("example");
//     for (var i = 0; i < x.length; i++)
//     {
//         x[i].style.backgroundColor = "red";
//     }
// }


// var copy_btn = document.getElementById("copy_btn");
// var copy_btn_img = document.getElementById("copy_btn_img");

// copy_btn.onmouseover = function()
// {
//     copy_btn_img.src = "/static/icons/brown/copy-content.svg";
// }

// copy_btn.onmouseout = function()
// {
//     copy_btn_img.src = "/static/icons/copy-content.svg";
// }

// var download_btn = document.getElementById("download_btn");
// var download_btn_img = document.getElementById("download_btn_img");

// download_btn.onmouseover = function()
// {
//     download_btn_img.src = "/static/icons/brown/download.svg";
// }

// download_btn.onmouseout = function()
// {
//     download_btn_img.src = "/static/icons/download.svg";
// }

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

var vaf = new ViewManager(content_container);

var c_textbot_template = document.getElementById("_c_textbox_template");
var foo = new TextContentBox(0);
foo.setTemplate(c_textbot_template.innerHTML);

var foo_1 = new TextContentBox(1);
foo_1.setTemplate(c_textbot_template.innerHTML);

var foo_2 = new TextContentBox(2);
foo_2.setTemplate(c_textbot_template.innerHTML);

var c_attachment_box_template = document.getElementById("_c_attachemntbox_template");
var foo_3 = new AttachmentContentBox(3);
foo_3.setTemplate(c_attachment_box_template.innerHTML);

vaf.addContentBox(foo);
vaf.addContentBox(foo_1);
vaf.addContentBox(foo_2);
vaf.addContentBox(foo_3);

vaf.render();