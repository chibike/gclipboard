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
