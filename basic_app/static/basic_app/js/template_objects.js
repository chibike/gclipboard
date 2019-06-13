
class ViewManager
{
    constructor(view)
    {
        this.view = view;
        this.content_boxes = [];
    }

    addContentBox(content_box)
    {
        this.content_boxes.push(content_box);
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
    constructor(id)
    {
        this.id = id;
        this.container_id = `_c_textbox__${this.id}`;
        this.delete_btn_id = `delete_btn_${this.id}`;
        this.status_indicator_id = `status_indicator_${this.id}`;
        this.status_indicator_img_id = `status_indicator_img_${this.id}`;

        this.states = {
            UPLOADING : 1,
            EDITING : 2,
            SENT : 3
        }

        this.state = this.states.EDITING;
    }

    onDelete()
    {
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

    setTemplate(template)
    {
        this.template = template.replace(/\${id}/g, this.id);
    }

    setState(state)
    {
        console.log(state);
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
        document.getElementById(this.container_id).scrollIntoView({behavior: "smooth"});
    }

    upload()
    {
        this.setState(this.states.UPLOADING);
    }

    delete()
    {
        this.setState(this.states.UPLOADING);
    }
}

class TextContentBox extends GenericContentBox
{
    constructor(id)
    {
        super(id);

        this.copy_btn_id = `copy_btn_${this.id}`;
        this.download_btn_id = `download_btn_${this.id}`;
        this.text_area_id = `text_area_${this.id}`;
        this.text = "";
    }

    onCopy()
    {
        console.log(`copying ${this.id}`);
    }

    onDownload()
    {
        console.log(`downloading ${this.id}`);
    }

    onEdit()
    {
        super.onEdit();
        this.auto_resize();
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
}

class AttachmentContentBox extends GenericContentBox
{
    constructor(id)
    {
        super(id);

        this.download_btn_id = `download_btn_${this.id}`;
        this.text_area_id = `text_area_${this.id}`;
    }

    onDownload()
    {
        console.log(`downloading ${this.id}`);
    }

    appendToView(view)
    {
        super.appendToView(view);
    }

    update()
    {
        super.update()
        document.getElementById(this.download_btn_id).onclick = ()=>{this.onDownload.call(this)};
    }
}
