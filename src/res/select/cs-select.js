import {inject, customElement, bindable, bindingMode} from 'aurelia-framework';  
import {DDL} from '../ddl/ddl';
import * as chs from '../chs';

@inject(Element,DDL)
@customElement('cs-select')
@bindable({name     : 'value',                            //Selected value object
           attribute: 'value',
           changeHandler: 'valueChanged',
           defaultBindingMode: bindingMode.twoWay,
           defaultValue: undefined
})
export class CsSelect
{
    @bindable src            = null;   //Item source for results
    @bindable disabled       = false;  //Is the control disabled?
    @bindable renderItemFn   = null;   //Custom function for rendering item content.   Ex: renderItem(obj, id, txt)
    @bindable renderResultFn = null;   //Custom function for rendering result content. Ex: renderResult(ddl, ctrl, obj, highlightedMarkup)

    constructor(el, ddl)
    {
        //Set control properties
        this.element   = el;       
        this.ddl       = ddl;          //Global singleton drop down list
        this.isOpen    = false;        //Is drop down open?
        this.lastInput = "";           //Stores last input entered into the control (ddl uses & sets this)
    }


    //Lifecycle hooks
    //-------------------------------------------------------------------------------------------------------------------------------------------
    bind(bindingContext)   //Invoked when the databinding engine binds the view. The binding context is the instance that the view is databound to. (All properties have their initial bound values set)
    {
        var el = this.element;
        
        this.contentEl = el.querySelector(".cs-select-content");          //Div that holds the control's current value content


        //Added classes to the element
        el.classList.add("cs-ctrl");                                      //Every cs control has this to idenify them             
        el.classList.add("cs-select");                                    //Style select control
        

        this.savedTabIndex = (el.tabIndex < 0) ? 0 : el.tabIndex;          //Record any tabIndex set on the control element.
        this.required      = el.hasAttribute("required");                  //Record if this is a required field or is nullable
        this.minChars      = parseInt(el.getAttribute("min-chars")) || 0;  //Min chars that need to be typed before querying
        this.textProp      = el.getAttribute("text-prop") || "text";       //Object property to use for text
        this.idProp        = el.getAttribute("id-prop")   || "id";         //Object property to use for the ID


        //Ensure the control is tabbable (unless the control is disabled)
        if(!this.disabled)
        {
            el.tabIndex  = this.savedTabIndex;
        }
        
        //Milli-seconds to delay querying. If non specified use 0 delay for array data source and 200ms for others sources.
        if (Array.isArray(this.src))   { this.delay = parseInt(el.getAttribute("delay")) || 0;   }
        else                           { this.delay = parseInt(el.getAttribute("delay")) || 200; }

        //Bind events
        this.clickHandler   = e => this.onClick(e);
        this.focusHandler   = e => this.onFocus(e);
        this.blurHandler    = e => this.onBlur(e);
        this.keydownHandler = e => this.onKeyDown(e);

        el.addEventListener("click",   this.clickHandler);
        el.addEventListener("focus",   this.focusHandler);
        el.addEventListener("blur",    this.blurHandler);
        el.addEventListener("keydown", this.keydownHandler);

        this.renderContent();
    }
    unbind()   //Called when the databinding engine unbinds the view
    {
        var el = this.element;
        el.removeEventListener("click",   this.clickHandler);
        el.removeEventListener("focus",   this.focusHandler);
        el.removeEventListener("blur",    this.blurHandler);
        el.removeEventListener("keydown", this.keydownHandler);
    }
    



    //Event handlers
    //-------------------------------------------------------------------------------------------------------------------------------------------
    onClick(evt)
    {
        if(this.disabled) { return; }

        if (chs.closest(evt.target, ".cs-select-clear"))   //If clear button was clicked
        {
            this.clear(); return;
        }
        this.ddl.open(this);
    }

    onFocus()
    {
        if(this.disabled) { this.onBlur(); return; }
        this.element.classList.add("focused");
    }

    onBlur()
    {
        this.element.classList.remove("focused");
    }

    onKeyDown(evt)
    {
        if (this.disabled) { return; }

        if (evt.keyCode === chs.keyCode.UP || evt.keyCode === chs.keyCode.DOWN || chs.isAlphaNumericKey(evt.keyCode))
        {
            this.ddl.open(this);
        }
    }

    



    //Propety change handlers
    //-------------------------------------------------------------------------------------------------------------------------------------------
    disabledChanged(newVal)
    {
        var el = this.element;
        if(newVal)
        {
            el.classList.add("disabled");
            el.tabIndex = -1;                  //Prevent tabbing
            
        }
        else
        {
            el.classList.remove("disabled");
            el.tabIndex = this.savedTabIndex;  //Enable tabbing
        }
    }

    valueChanged(newVal)
    {
        this.renderContent();
    }


    //Actions
    //-------------------------------------------------------------------------------------------------------------------------------------------
    clear()
    {
        this.value = null;
        this.renderContent();
    }

    setOpenState(b)  //Called by ddl
    {
        this.isOpen = b;

        if(b) { this.element.classList.add("open"); }
        else  { this.element.classList.remove("open"); }
    }

    addSelectedResult(o)  //Called by ddl when result item selected
    {
        this.value = o;
        this.renderContent();
    }

    renderContent()
    {
        var markup,  obj = this.value, id, txt;
        if(obj)
        {
            id  = obj[this.idProp], 
            txt = obj[this.textProp];
        }

        if(this.renderItemFn)   //If a custom item render() supplied call it to generate the markup to render
        {
            markup = this.renderItemFn(obj, id, txt);
        }
        else                    //Use default rendering (just display selected item's "text" property
        {
            markup = obj ? chs.encodeHtml(txt) : "";
        }
        this.contentEl.innerHTML = markup;
    }
}