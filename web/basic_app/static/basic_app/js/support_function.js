function auto_resize()
{
    var input_value = this.value;

    if (this.scrollHeight > this.clientHeight)
    {
        this.style.height = this.scrollHeight + "px";
    }
    else if (this.scrollHeight < this.clientHeight)
    {
        this.style.height = this.scrollHeight + "px";
    }

    if (this.clientHeight > document.documentElement.clientHeight - 200)
    {
        this.style.height = document.documentElement.clientHeight - 200 + "px";
        this.style.overflowY = "scroll";
    }
    else
    {
        this.style.overflowY = "hidden";
    }
}

function add_class_to_view(view, class_name)
{
    if (!view.classList.contains(class_name))
    {
        view.classList.add(class_name);
    }
}

function remove_class_from_view(view, class_name)
{
    if (view.classList.contains(class_name))
    {
        view.classList.remove(class_name);
    }
}

function copy_to_clipboard(text)
{
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

function post_data(url, json_data, callback)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = ()=>{ if (callback){callback(xhr.readyState, xhr.status, xhr.responseText);} };
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(json_data));
}

function post_string_data(url, json_string, callback)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = ()=>{ if (callback){callback(xhr.readyState, xhr.status, xhr.responseText);} };
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(json_string);
}

function post_formdata(url, formdata, callback)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = ()=>{ if (callback){callback(xhr.readyState, xhr.status, xhr.responseText);} };
    xhr.open("POST", url, true);
    xhr.send(formdata);
}

function list_contains(list, item)
{
    return (list.indexOf(item) >= 0);
}