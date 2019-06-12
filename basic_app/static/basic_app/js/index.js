

// $('#text_area').autoResize();

var content = document.getElementById("content");

var text_area = document.getElementById("text_area");
var bottom_navbar = document.getElementById("bottom_navbar");
var top_navbar = document.getElementById("top_navbar");

var send_btn = document.getElementById("send_btn");
var send_btn_img = document.getElementById("send_btn_img");

var attach_btn = document.getElementById("attach_btn");
var attach_btn_img = document.getElementById("attach_btn_img");

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

text_area.oninput = function()
{
    var input_value = this.value;

    if (text_area.scrollHeight > text_area.clientHeight)
    {
        text_area.style.height = text_area.scrollHeight + "px";
    }
    else if (text_area.scrollHeight < text_area.clientHeight)
    {
        text_area.style.height = text_area.scrollHeight + "px";
    }

    if (text_area.clientHeight > document.documentElement.clientHeight - 200)
    {
        text_area.style.height = document.documentElement.clientHeight - 200 + "px";
        text_area.style.overflowY = "scroll";
    }
    else
    {
        text_area.style.overflowY = "hidden";
    }
}