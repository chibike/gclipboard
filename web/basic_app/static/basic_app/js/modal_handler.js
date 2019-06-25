
class ModalManager
{
    constructor(modal_id)
    {
        this.id = modal_id;
        this.STATES = {
            VISIBLE: 1,
            HIDDEN: 2
        }

        this.button_ok_clicked_callback = null;
        this.button_cancel_clicked_callback = null;

        this.state = this.STATES.HIDDEN;

        document.getElementById("modal_btn_ok").onclick = ()=>{
            this.ok_button_clicked.call(this);
        }

        document.getElementById("modal_btn_cancel").onclick = ()=>{
            this.cancel_button_clicked.call(this);
        }
        
        document.getElementById("modal_top_close_button").onclick = ()=>{
            this.cancel_button_clicked.call(this);
        }
    }

    show_modal()
    {
        document.getElementById(this.id).style.display = "block";
        this.state = this.STATES.VISIBLE;
    }

    hide_modal()
    {
        document.getElementById(this.id).style.display = "none";
        this.state = this.STATES.HIDDEN;
    }

    set_title(title)
    {
        document.getElementById("modal_title").innerHTML = title;
    }

    set_body(body)
    {
        document.getElementById("modal_body").innerHTML = body;
    }

    set_body_loading()
    {
        document.getElementById("modal_body").innerHTML = `<span>please wait, this might take a while</span><br><img class="mb-3 mt-3" src="../static/icons/loading.gif" style="width: 100px;" id="loading_gif">`;
    }

    ok_button_clicked()
    {
        if (this.button_ok_clicked_callback)
        {
            this.button_ok_clicked_callback();
        }
    }

    cancel_button_clicked()
    {
        this.hide_modal();

        if (this.button_cancel_clicked_callback)
        {
            this.button_cancel_clicked_callback();
        }
    }

    set_disable_ok_button(should_disable)
    {
        var modal_btn_ok = document.getElementById("modal_btn_ok");

        if (should_disable)
        {
            add_class_to_view(modal_btn_ok, "disable");
            add_class_to_view(modal_btn_ok, "d-none");
        }
        else
        {
            remove_class_from_view(modal_btn_ok, "d-none");
            remove_class_from_view(modal_btn_ok, "disable");
        }
    }

    set_disable_cancel_button(should_disable)
    {
        var modal_btn_cancel = document.getElementById("modal_btn_cancel");

        if (should_disable)
        {
            add_class_to_view(modal_btn_cancel, "disable");
            add_class_to_view(modal_btn_cancel, "d-none");
        }
        else
        {
            remove_class_from_view(modal_btn_cancel, "d-none");
            remove_class_from_view(modal_btn_cancel, "disable");
        }
    }

    set_disable_close_button(should_disable)
    {
        var modal_top_close_button = document.getElementById("modal_top_close_button");

        if (should_disable)
        {
            add_class_to_view(modal_top_close_button, "disable");
            add_class_to_view(modal_top_close_button, "d-none");
        }
        else
        {
            remove_class_from_view(modal_top_close_button, "d-none");
            remove_class_from_view(modal_top_close_button, "disable");
        }
    }
}


var modal_instance = new ModalManager("modal");

function modal_show(body_content)
{
    modal_instance.set_body(body_content);
    modal_instance.show_modal();
}

function show_loading(title)
{
    modal_instance.set_title(title);
    modal_instance.set_body_loading();
    modal_instance.button_ok_clicked_callback = null;
    modal_instance.button_cancel_clicked_callback = null;

    modal_instance.set_disable_cancel_button(true);
    modal_instance.set_disable_close_button(true);
    modal_instance.set_disable_ok_button(true);

    modal_instance.show_modal();
}

function ask_confirmation(title, body, ok_callback, on_rendered)
{
    modal_instance.set_title(title);
    modal_instance.set_body(body);
    modal_instance.button_ok_clicked_callback = ok_callback;
    modal_instance.button_cancel_clicked_callback = null;

    modal_instance.set_disable_cancel_button(false);
    modal_instance.set_disable_close_button(false);
    modal_instance.set_disable_ok_button(false);

    if (on_rendered)
    {
        on_rendered();
    }

    modal_instance.show_modal();
}


function ask_shareable_info(content_id, content_name, view_content_id, view_content_name, view_expiry_date, view_download_limit, on_proceed_btn_clicked)
{
    body = document.getElementById("_s_shareable_info_form").innerHTML;
    body = body.replace(/\${content_id}/g, view_content_id);
    body = body.replace(/\${content_name}/g, view_content_name);
    body = body.replace(/\${expiry_date}/g, view_expiry_date);
    body = body.replace(/\${download_limit}/g, view_download_limit);
    
    ask_confirmation("Create Shareable Link", body, ()=>{
        // on_proceed_btn_clicked

        on_proceed_btn_clicked(
                document.getElementById(view_expiry_date).value,
                document.getElementById(view_download_limit).value,
            )

    }, ()=>{
        // on rendered
        document.getElementById(view_content_id).value = content_id;
        document.getElementById(view_content_name).value = content_name;

        var today = new Date();
        today.setDate(today.getDate() + 5);
        document.getElementById(view_expiry_date).value = document.getElementById(view_expiry_date).min = today.toISOString().split("T")[0];
    });
}

function close_modal()
{
    modal_instance.hide_modal();
}