class ToastMessenger
{
    constructor()
    {
        this.messages = [];
        this.parent_div = document.getElementById("toast_messages_div");

        this.toast_message = null;
        this.is_running = false;
    }

    show_message(msg, timeout=3000)
    {
        this.messages.push(msg);

        if (!this.is_running)
        {
            this.render(timeout);
        }
    }

    render(timeout=3000)
    {
        this.renderIn(timeout);
    }

    renderIn(timeout=3000)
    {
        this.is_running = true;

        var msg = this.messages.shift();
        if (!msg) { return; };

        var toast_template = `
            <div class="toast_container mx-auto" id="toast_message">
                <span class="">${msg}</span>
            <div>
        `

        this.parent_div.innerHTML = toast_template;
        this.toast_message = document.getElementById("toast_message");

        remove_class_from_view(this.parent_div, "d-none");
        add_class_to_view(this.parent_div, "d-flex");
        add_class_to_view(this.toast_message, "fade_in_animation");

        setTimeout(()=>{
            this.renderOut.call(this, timeout);
        }, timeout);
    }

    renderOut(timeout=3000)
    {
        remove_class_from_view(this.toast_message, "fade_in_animation");
        add_class_to_view(this.toast_message, "fade_out_animation");

        setTimeout(()=>{
            this.hide.call(this, timeout);
        }, timeout);
    }

    hide(timeout=3000)
    {
        remove_class_from_view(this.toast_message, "fade_in_animation");
        remove_class_from_view(this.toast_message, "fade_out_animation");
        remove_class_from_view(this.parent_div, "d-flex");
        add_class_to_view(this.parent_div, "d-none");

        if (this.messages.length > 0)
        {
            this.renderIn(timeout);
        }
        else
        {
            this.is_running = false;
        }
    }
}

var toast = new ToastMessenger();

// t = new ToastMessages();
// t.show_message("Hello, world");
// t.show_message("Hello, chibuike");
// t.show_message("Hello, grass");

// setTimeout(()=>{t.show_message("Hello, world");}, 10000);