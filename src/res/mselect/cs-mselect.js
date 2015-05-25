import {inject, customElement, bindable, ObserverLocator} from 'aurelia-framework';  
import {DDL} from '../ddl/ddl';
import * as chs from '../chs';

@inject(Element,DDL,ObserverLocator)
@customElement('cs-mselect')
export class CsMselect
{
    @bindable src            = null;   //Item source for results
    @bindable values         = [];     //Array of selected objects
    @bindable disabled       = false;  //Is the control disabled?
    @bindable renderItemFn   = null;   //Custom function for rendering item content.   Ex: renderItem(obj, id, txt)
    @bindable renderResultFn = null;   //Custom function for rendering result content. Ex: renderResult(ddl, ctrl, obj, highlightedMarkup)

    constructor(el, ddl, observerLocator)
    {
        this.observerLocator = observerLocator;

        //Set control properties
        this.element       = el;       
        this.ddl           = ddl;      //Global singleton drop down list
        this.isOpen        = false;    //Is drop down open?
        this.lastInput     = "";       //Stores last input entered into the control (ddl uses & sets this)
    }



    //Lifecycle hooks
    //-------------------------------------------------------------------------------------------------------------------------------------------
    bind(bindingContext)   //Invoked when the databinding engine binds the view. The binding context is the instance that the view is databound to. (All properties have their initial bound values set)
    {
        var el = this.element;
        
        this.contentEl = el.querySelector(".cs-mselect-items");           //Div that holds the control's current value content


        //Added classes to the element
        el.classList.add("cs-ctrl");                                      //Every cs control has this to idenify them             
        el.classList.add("cs-mselect");                                   //Style select control
        if(el.hasAttribute('vertical'))
        {
            el.classList.add("cs-mselect-vertical");                      //Give it the vertical (listbox) styling
        }


        this.savedTabIndex = (el.tabIndex < 0) ? 0 : el.tabIndex;          //Record any tabIndex set on the control element.
        //this.minCount      = parseInt(el.getAttribute("min-count")) || 0;  //Minimum # of selected values required
        this.maxCount      = parseInt(el.getAttribute("max-count")) || 0;  //Minimum # of selected values allowed (0 = no limit)
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

        //Subscribe to changes to the values array
        this.disposeValuesSubscription = this.observerLocator.getArrayObserver(this.values)
                                                             .subscribe(() => this.valuesChanged());
        

        this.renderContent();
    }
    unbind()   //Called when the databinding engine unbinds the view
    {
        var el = this.element;
        el.removeEventListener("click",   this.clickHandler);
        el.removeEventListener("focus",   this.focusHandler);
        el.removeEventListener("blur",    this.blurHandler);
        el.removeEventListener("keydown", this.keydownHandler);

        this.disposeValuesSubscription();
    }
    



    //Event handlers
    //-------------------------------------------------------------------------------------------------------------------------------------------
    onClick(evt)
    {
        if(this.disabled) { return; }

        var xClicked = chs.closest(evt.target, ".cs-mselect-item-x");
        if (xClicked)                                                     //If an item's x button was clicked
        {
            var item = chs.closest(evt.target, ".cs-mselect-item");       //Get the item 
            var id   = parseInt(item.dataset.id);                         //Read data-id attribue

            this.values.chsRemoveWithProperty(this.idProp, id);           //Remove the obj from the values [] matching this id
            this.renderContent();
            return;
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

    valuesChanged(newVal)
    {
        this.renderContent();
    }


    //Actions
    //-------------------------------------------------------------------------------------------------------------------------------------------
    clear()
    {
        this.values.length = 0;   //Clear array
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
        if(this.maxCount === 0 || this.values.length < this.maxCount)
        {
            this.values.push(o);
            this.renderContent();
        }
    }

    renderContent()
    {
        var markup = "";

        for(var i = 0; i < this.values.length; i++)
        {
            markup += getItemMarkup(this, this.values[i]);
        }
        this.contentEl.innerHTML = markup;
    }
}


function getItemMarkup(ctrl, obj)
{
    var id   = obj[ctrl.idProp];
    var text = obj[ctrl.textProp];
    var itemContent = ctrl.renderItemFn ? ctrl.renderItemFn(obj, id, text) : chs.encodeHtml(text);

    return "<li class='cs-mselect-item' data-id='" + id + "'><div class='cs-mselect-item-content'>" + itemContent + "</div><div class='cs-mselect-item-x'>x</div></li>";
}