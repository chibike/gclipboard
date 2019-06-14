
class ViewManager
{
    constructor(view)
    {
        this.view = view;
        this.content_boxes = [];
        this.content_ids = [];
    }

    hasContentBox(content_id)
    {
        return (this.content_ids.indexOf(content_id) >= 0);
    }

    addContentBox(content_box)
    {
        if (this.hasContentBox(content_box.id)) { return false; }

        this.content_boxes.push(content_box);
        this.content_ids.push(content_box.id);

        return true;
    }

    addContentBoxReverse(content_box)
    {
        if (this.hasContentBox(content_box.id)) { return false; }

        this.content_boxes = [content_box].concat(this.content_boxes);
        this.content_ids   = [content_box.id].concat(this.content_ids);

        return true;
    }

    removeSentContent()
    {
        for (var i=this.content_boxes.length-1; i>=0; i--)
        {
            if (this.content_boxes[i].state === this.content_boxes[i].states.SENT)
            {
                this.content_boxes.splice(i, 1);
                this.content_ids.splice(i, 1);
            }
        }
    }

    removeContentBox(content_box)
    {
        if (!this.hasContentBox(content_box.id)) { return false; }

        for (var i=this.content_boxes.length-1; i>=0; i--)
        {
            if (content_box.id === this.content_boxes[i].id)
            {
                this.content_boxes.splice(i, 1);
                this.content_ids.splice(i, 1);
            }
        }

        return true;
    }

    render()
    {
        var _t = "";

        for (var i=this.content_boxes.length-1; i>=0; i--)
        {
            _t += this.content_boxes[i].template;
        }

        this.view.innerHTML = _t;

        for (var i=this.content_boxes.length-1; i>=0; i--)
        {
            _t += this.content_boxes[i].update();
        }
    }

    focus(box_id)
    {
        view_manager.content_boxes[box_id].focus();
    }
}

class GenericContentBox
{
    constructor(id, view_manager)
    {
        this.id = id;
        this.configureNames()
        this.view_manager = view_manager;

        this.states = {
            UPLOADING : 1,
            EDITING : 2,
            SENT : 3,
            ERROR : 4
        }

        this.state = this.states.EDITING;
    }

    configureNames()
    {
        this.delete_btn_id = `delete_btn_${this.id}`;
        this.status_indicator_id = `status_indicator_${this.id}`;
        this.status_indicator_img_id = `status_indicator_img_${this.id}`;
    }

    onDelete()
    {
        this.view_manager.removeContentBox(this);
        this.delete();
    }

    onStatusClicked()
    {
        this.upload();
    }

    onEdit()
    {
        this.setState(this.states.EDITING);
    }

    onPostResponse(ready_state, status, response_text)
    {
        if (ready_state == 4 && status == 200)
        {
            var json_data = JSON.parse(response_text);

            if (json_data.status)
            {
                this.setState(this.states.SENT);
            }
            else
            {
                this.setState(this.states.ERROR);
            }
        }
    }

    setTemplate(template)
    {
        this.template = template.replace(/\${id}/g, this.id);
    }

    setState(state)
    {
        if (state === this.states.EDITING)
        {
            var status_indicator = document.getElementById(this.status_indicator_id);
            var status_indicator_img = document.getElementById(this.status_indicator_img_id);

            status_indicator_img.src = "/static/icons/red/refresh-button.svg";

            remove_class_from_view(status_indicator, "disabled");
            remove_class_from_view(status_indicator, "full_opacity");
            
            remove_class_from_view(status_indicator_img, "loading_animation");
            add_class_to_view(status_indicator_img, "pulse_animation");

            this.state = this.states.EDITING;
        }
        
        else if (state === this.states.UPLOADING)
        {
            var status_indicator = document.getElementById(this.status_indicator_id);
            var status_indicator_img = document.getElementById(this.status_indicator_img_id);

            status_indicator_img.src = "/static/icons/red/refresh-button.svg";

            remove_class_from_view(status_indicator_img, "pulse_animation");
            
            add_class_to_view(status_indicator_img, "loading_animation");
            add_class_to_view(status_indicator, "disabled");
            add_class_to_view(status_indicator, "full_opacity");

            this.state = this.states.UPLOADING;
        }

        else if (state === this.states.SENT)
        {
            var status_indicator = document.getElementById(this.status_indicator_id);
            var status_indicator_img = document.getElementById(this.status_indicator_img_id);

            status_indicator_img.src = "/static/icons/green/dot.svg";

            remove_class_from_view(status_indicator_img, "loading_animation");
            remove_class_from_view(status_indicator_img, "pulse_animation");

            add_class_to_view(status_indicator, "disabled");
            add_class_to_view(status_indicator, "full_opacity");

            this.state = this.states.SENT;
        }

        else if (state === this.states.ERROR)
        {
            var status_indicator = document.getElementById(this.status_indicator_id);
            var status_indicator_img = document.getElementById(this.status_indicator_img_id);

            status_indicator_img.src = "/static/icons/red/dot.svg";

            remove_class_from_view(status_indicator, "disabled");
            remove_class_from_view(status_indicator_img, "loading_animation");
            remove_class_from_view(status_indicator_img, "pulse_animation");

            add_class_to_view(status_indicator, "full_opacity");

            this.state = this.states.ERROR;
        }
    }

    appendToView(view)
    {
        view.innerHTML += this.template;
    }

    update()
    {
        document.getElementById(this.delete_btn_id).onclick = ()=>{this.onDelete.call(this)};
        document.getElementById(this.status_indicator_id).onclick = ()=>{this.onStatusClicked.call(this)};

        this.setState(this.state);
    }

    focus()
    {
        if (this.container_id)
        {
            document.getElementById(this.container_id).scrollIntoView({behavior: "smooth"});
        }
    }

    upload()
    {
        this.setState(this.states.UPLOADING);
        toast.show_message("uploading...");
    }

    delete()
    {
        this.setState(this.states.UPLOADING);
    }

    post_data(url, json_data)
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = ()=>{ this.onPostResponse(xhr.readyState, xhr.status, xhr.responseText); };
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(json_data));
    }

    post_formdata(url, formdata)
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = ()=>{ this.onPostResponse(xhr.readyState, xhr.status, xhr.responseText); };
        xhr.open("POST", url, true);
        xhr.send(formdata);
    }
}

class TextContentBox extends GenericContentBox
{
    constructor(id, view_manager)
    {
        super(id, view_manager);
        
        this.configureNames();
        this.text = "";
    }

    configureNames()
    {
        super.configureNames();

        this.container_id = `_c_textbox__${this.id}`;
        this.copy_btn_id = `copy_btn_${this.id}`;
        this.download_btn_id = `download_btn_${this.id}`;
        this.text_area_id = `text_area_${this.id}`;
    }

    onCopy()
    {
        copy_to_clipboard(document.getElementById(this.text_area_id).value);
        toast.show_message("copied to clipboard", 1500);
    }

    onDownload()
    {
        window.open(`/download_text/${this.id}`, '_blank');
    }

    onDelete()
    {
        super.onDelete();
        this.post_data(`/delete_text/${this.id}`, {});
    }

    onEdit()
    {
        super.onEdit();
        this.auto_resize();

        this.text = document.getElementById(this.text_area_id).value;
    }

    setState(state)
    {
        super.setState(state);

        if (state === this.states.EDITING)
        {
            var download_btn = document.getElementById(this.download_btn_id);

            add_class_to_view(download_btn, "disabled");
            add_class_to_view(download_btn, "full_opacity");
        }
        
        else if (state === this.states.UPLOADING)
        {
            var download_btn = document.getElementById(this.download_btn_id);

            add_class_to_view(download_btn, "disabled");
            add_class_to_view(download_btn, "full_opacity");
        }

        else if (state === this.states.SENT)
        {
            var download_btn = document.getElementById(this.download_btn_id);

            remove_class_from_view(download_btn, "disabled");
            add_class_to_view(download_btn, "full_opacity");
        }

        else if (state === this.states.ERROR)
        {
            var download_btn = document.getElementById(this.download_btn_id);

            add_class_to_view(download_btn, "disabled");
            add_class_to_view(download_btn, "full_opacity");
        }
    }

    auto_resize()
    {
        auto_resize.call(
            document.getElementById(this.text_area_id),
        );
    }

    appendToView(view)
    {
        super.appendToView(view);
    }

    setText(text)
    {
        this.text = text;
    }

    update()
    {
        super.update()
        document.getElementById(this.copy_btn_id).onclick = ()=>{this.onCopy.call(this)};
        document.getElementById(this.download_btn_id).onclick = ()=>{this.onDownload.call(this)};
        document.getElementById(this.text_area_id).oninput = ()=>{
            this.onEdit.call(
                this
            )
        };

        document.getElementById(this.text_area_id).value = this.text;
        this.auto_resize();
    }

    upload()
    {
        super.upload();

        var json_data = {
            text : document.getElementById(this.text_area_id).value
        }

        this.post_data("/upload_text/", json_data);
    }
}

class AttachmentContentBox extends GenericContentBox
{
    constructor(id, view_manager)
    {
        super(id, view_manager);

        this.configureNames();
        this.file = null;
        this.filename = null;
    }

    configureNames()
    {
        super.configureNames();

        this.container_id = `_c_attachmentbox__${this.id}`;
        this.download_btn_id = `download_btn_${this.id}`;
        this.text_area_id = `text_area_${this.id}`;
        this.text_area_help_id = `text_area_help_${this.id}`;
    }

    onDownload()
    {
        window.open(`/download_file/${this.id}`, '_blank');
    }

    onDelete()
    {
        super.onDelete();

        this.post_data(`/delete_file/${this.id}`, {});
    }

    setState(state)
    {
        super.setState(state);

        if (state === this.states.EDITING)
        {
            var download_btn = document.getElementById(this.download_btn_id);

            add_class_to_view(download_btn, "disabled");
            add_class_to_view(download_btn, "full_opacity");
        }
        
        else if (state === this.states.UPLOADING)
        {
            var download_btn = document.getElementById(this.download_btn_id);

            add_class_to_view(download_btn, "disabled");
            add_class_to_view(download_btn, "full_opacity");
        }

        else if (state === this.states.SENT)
        {
            var download_btn = document.getElementById(this.download_btn_id);

            remove_class_from_view(download_btn, "disabled");
            add_class_to_view(download_btn, "full_opacity");
        }

        else if (state === this.states.ERROR)
        {
            var download_btn = document.getElementById(this.download_btn_id);

            add_class_to_view(download_btn, "disabled");
            add_class_to_view(download_btn, "full_opacity");
        }
    }

    appendToView(view)
    {
        super.appendToView(view);
    }

    setFile(file)
    {
        this.file = file;
    }

    setFilename(filename)
    {
        if (!filename){ return; }
        document.getElementById(this.text_area_id).value = filename;
    }

    update()
    {
        super.update()
        document.getElementById(this.download_btn_id).onclick = ()=>{this.onDownload.call(this);}
        document.getElementById(this.text_area_id).oninput = ()=>{this.onEdit.call(this);}

        if (this.file)
        {
            this.setFilename(this.file.name);
        }
        else
        {
            this.setFilename(this.filename);
        }
    }

    upload()
    {
        super.upload();
        if (!this.file) { return; }

        var fd = new FormData();

        if (document.getElementById(this.text_area_id).value)
        {
            fd.append("filename", document.getElementById(this.text_area_id).value);
        }
        else
        {
            fd.append("filename", this.file.name);
        }

        fd.append("file", this.file);
        this.post_formdata("/upload_file/", fd);
    }
}
