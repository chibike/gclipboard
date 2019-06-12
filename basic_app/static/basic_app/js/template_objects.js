
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

        for (var i=0; i<this.content_boxes.length; i++)
        {
            _t += this.content_boxes[i].template;
        }

        this.view.innerHTML = _t;

        for (var i=0; i<this.content_boxes.length; i++)
        {
            _t += this.content_boxes[i].update();
        }
    }
}

class GenericContentBox
{
    constructor(id)
    {
        this.id = id;
        this.delete_btn_id = `delete_btn_${this.id}`;
        this.status_indicator_id = `status_indicator_${this.id}`;
    }

    onDelete()
    {
        console.log(`deleting ${this.id}`);
    }

    setTemplate(template)
    {
        this.template = template.replace(/\${id}/g, this.id);
    }

    appendToView(view)
    {
        view.innerHTML += this.template;
    }

    update()
    {
        document.getElementById(this.delete_btn_id).onclick = this.onDelete;
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
    }

    onCopy()
    {
        console.log(`copying ${this.id}`);
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
        document.getElementById(this.copy_btn_id).onclick = this.onCopy;
        document.getElementById(this.download_btn_id).onclick = this.onDownload;
        document.getElementById(this.text_area_id).oninput = auto_resize;
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
        document.getElementById(this.download_btn_id).onclick = this.onDownload;
        document.getElementById(this.text_area_id).oninput = auto_resize;
    }
}