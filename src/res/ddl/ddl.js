import * as chs from '../chs';

var ResultClass = "cs-ddl-result",
    FocusClass  = "cs-focus";


//Singleton Dropdown list class
//----------------------------------------------------------------------------------------
export class DDL  
{
    constructor()
    {
        this.curCtrl      = null;        //Stores a reference to the current control this DDL is working with
        this.queryTimerID = 0;           //setTimeout ID for the query


        //Create & store drop down list elements
        var doc           = document;
        this.ddlEl        = doc.createElement("div");    //Dropdown list
        this.inputEl      = doc.createElement("input");  //Input inside DDL
        this.inputElWrap  = doc.createElement("div");    //Wraps the input
        this.inputIco     = doc.createElement("div");    //Icon inside the input wrap
        this.resultsEl    = doc.createElement("ul");     //Results inside DDL
        this.ddlElMsg     = doc.createElement("div");    //Message below the results

        //Add classes to them
        this.ddlEl.className        = 'cs-ddl cs-hidden';
        this.inputEl.className      = 'cs-ddl-input';
        this.inputElWrap.className  = 'cs-ddl-input-wrap';
        this.inputIco.className     = 'cs-ddl-input-ico';
        this.resultsEl.className    = 'cs-ddl-results';
        this.ddlElMsg.className     = 'cs-ddl-msg';

        //Assemble them and append ddl to body
        this.inputElWrap.appendChild(this.inputEl);
        this.inputElWrap.appendChild(this.inputIco);
        this.ddlEl.appendChild(this.inputElWrap);
        this.ddlEl.appendChild(this.resultsEl);
        this.ddlEl.appendChild(this.ddlElMsg);
        
        doc.body.appendChild(this.ddlEl);

        //Wire permanent input events
        this.inputEl.addEventListener('keydown', (e) => this.onInputKeyDown(e));
        this.inputEl.addEventListener('keyup',   (e) => this.onInputKeyUp(e));
    }
    
    wireDocEvents()
    {
        var self = this, ddlEl = self.ddlEl;
        
        if(self.wheelHandler) { return; }   //Don't allow multiple sets of event handlers
        
        //Wheel
        self.wheelHandler = function(ev)
        {
            if(!ddlEl.contains(ev.target))  //If scrolling isn't on the DDL, close it
            {
                self.hideDDL();
            }
        };
          
        
        //Mouse down
        self.mousedownHandler = function(ev)
        {
            var ctrlEl = self.curCtrl.element, target = ev.target;

            if (ctrlEl.contains(target))                           //If click was on the active control
            {
                self.focusInput();
            }
            else if (ddlEl.contains(target))                       //If click was on the DDL
            {
                var clickedResult = chs.closest(target, "." + ResultClass);
                if (clickedResult)
                {
                    self.resultsEl.querySelector("." + FocusClass).classList.remove(FocusClass);   //Clear prev selected result
                    clickedResult.classList.add(FocusClass);                                       //Select clicked result
                    self.addSelectedResult();
                }
                else { self.focusInput(); }
            }
            else { self.hideDDL(); }                               //Otherwise, close DDL
        };
        
        document.addEventListener('wheel', self.wheelHandler);
        document.addEventListener('mousedown', self.mousedownHandler);
    }
    
    removeDocEvents()
    {
        var self = this;
        document.removeEventListener('wheel', self.wheelHandler);
        document.removeEventListener('mousedown', self.mousedownHandler);
        self.wheelHandler     = null;
        self.mousedownHandler = null;
    }

    open(ctrl)
    {
        if (ctrl !== this.curCtrl)             //If a new ctrl is being opened...
        {
            if (this.curCtrl !== null)         //Set previously active ctrl to closed
            {
                this.curCtrl.setOpenState(false);
            }   
            this.curCtrl = ctrl;               //Switch to new ctrl
            this.clearDDL();
        }
        
        if (!this.curCtrl.disabled) { this.queryIfAllowedAndEnsureDDLVisible(); }
    }

    focusInput()
    {
        setTimeout(()=> this.inputEl.focus(), 1);
    }

    clearDDL()
    {
        var c = this.curCtrl;
        this.resultsEl.innerHTML = '';
        this.inputEl.value = "";
        if (c) 
        { 
            c.lastInput       = ""; 
            c.filteredResults = null;
        }
    }

    showDDL()
    {
        this.ddlEl.classList.remove("cs-hidden");
        this.positionDDL();
        this.curCtrl.setOpenState(true);
        this.focusInput();
        this.wireDocEvents();
    }

    hideDDL()
    {
        this.ddlEl.classList.add("cs-hidden");
        if (this.curCtrl) { this.curCtrl.setOpenState(false); }
        this.removeDocEvents();
    }

    positionDDL()
    {
        var ctrlEl      = this.curCtrl.element,         //The DOM element for the control we are attaching this DDL to
            ctrlPos     = chs.jqOffset(ctrlEl),         //Coordinates relative to the document
            borderTop   = false,                        //DDL will either have a top or bottom border. (Depending on if it's positioned above or below the ctrl)
            ddl         = this.ddlEl,                   //The DDL element
            ctrlHeight  = ctrlEl.offsetHeight,          //Height of the control we're attached to
            y           = ctrlPos.top + ctrlHeight,     //Y position directly below ctrl
            wh          = window.innerHeight,           //Height of the browser viewport including, if rendered, the horizontal scrollbar
            topSpace    = ctrlPos.top,                  //Space available above ctrl
            botSpace    = (wh - y),                     //Space available below ctrl
            maxSpace    = Math.max(botSpace, topSpace); //Size of the larger space
            

        //Set ddl left position / width
        ddl.style.left   = ctrlPos.left + 'px';
        ddl.style.width  = ctrlEl.offsetWidth + 'px';
        
        //Set scrollable area max-height
        var scrollHeight = maxSpace - 45;                         //Subtract a bit to account for the input control and padding
        this.resultsEl.style.maxHeight = scrollHeight + 'px';

        //If ddl would extend beyond the window assume it's better to show above the control *IF* topSpace has more room
        if ((y + ddl.offsetHeight) > wh) 
        {
            if (topSpace > botSpace) //Top space has more room so put ddl above the ctrl
            {
                borderTop = true;
                y = ctrlPos.top - ddl.offsetHeight - 1;   //Position if above control (may not have ddl height correct @ this point, may need to cal again after results render)
            }
        }
 
        //Set DDL top position
        ddl.style.top = y + 'px';
        
        //Assign top/bottom border
        if(borderTop)
        {
            ddl.style.borderTopStyle    = 'solid';
            ddl.style.borderBottomStyle = 'none';
        }
        else
        {
            ddl.style.borderBottomStyle = 'solid';
            ddl.style.borderTopStyle    = 'none';
        }
    }

    setMsg(markup) 
    { 
        this.ddlElMsg.innerHTML = markup; 
    }

    showBusy(b)
    {
        if (b) { this.inputElWrap.classList.add("cs-busy");    }
        else   { this.inputElWrap.classList.remove("cs-busy"); }
    }


    queryIfAllowedAndEnsureDDLVisible()
    {
        if (this.canQuery())
        {
            this.queryTimerID = setTimeout(() => this.doQuery(), this.curCtrl.delay);
        }
        if (!this.curCtrl.isOpen) { this.showDDL(); }
    }



    canQuery()
    {
        var charsNeeded = this.curCtrl.minChars - this.inputEl.value.length;

        this.cancelQuery();

        if (charsNeeded > 0)
        {
            this.setMsg("Enter " + charsNeeded + " more character(s)");
            return false;
        }

        this.showBusy(true);
        return true;
    }

    cancelQuery()
    {
        this.setMsg("");                                                //Remove working message
        if (this.queryTimerID) { clearTimeout(this.queryTimerID); }     //Stop query from running
    }

    doQuery()
    {
        var searchTxt   = this.inputEl.value,
            lcSearchTxt = searchTxt.toLowerCase(),
            c           = this.curCtrl,
            results;

        
        //Process result source...
        var isFunc = chs.isFunc(c.src);                          //Check if control's data source is a function
        results    = isFunc ? c.src(searchTxt) : c.src;          //If it's a function run it passing the searchTxt, otherwise take the value as is.
        if(!results.then) {results = Promise.resolve(results);}  //Ensure results are a promise if not already.
        
      
        //Clear any current filtered results
        c.filteredResults = null;   //Null tells renderResults() that results are pending.
        this.renderResults();

        var self = this;

        //When promise has resolved
        results.then( (r) =>
        {
            if(isFunc)    //Assume if resultSrc was a function filtering of results has already been done.
            {
                c.filteredResults = r;
            }
            else          //If resultSrc wasn't a function perform basic filtering of results now
            {
                c.filteredResults = [];
                for (var i = 0; i < r.length; i++)
                {
                    if (r[i][c.textProp].containsWords(lcSearchTxt)) { c.filteredResults.push(r[i]); }
                }
            }
            self.renderResults();
        });
    }

    renderResults()
    {
        var c = this.curCtrl, d = c.filteredResults, markup, i = 1;
        
        //Check we're OK to display results
        if (!this.canQuery()) { return; }

        //Reposition the DDL after rendering, so position code knows the new height of the DDL
        setTimeout(() => this.positionDDL(), 0);
        
        //If d is undefined...results are still pending
        if (!d)
        {
            this.showBusy(true);
            return;
        }

        //Clear results and any message
        this.setMsg("");
        this.resultsEl.innerHTML = '';
        this.showBusy(false);


        //If this is a control supporting multiple selected values, remove results that have already been selected
        if (c.values)
        {
            d.chsRemoveMatchingElements(c.idProp, c.values);
        }

        //Handle No Results
        if (d.length < 1) { this.setMsg("No matches"); return; }

        //Add 1st result as being "focused/selected"
        markup = "<li class='cs-ddl-result cs-focus' data-id='" + d[0][c.idProp] + "'><div class='cs-ddl-result-content'>" + this.renderResultContent(this, c, d[0]) + "</div></li>";

        //Add the reamining results
        for (; i < d.length; i++)
        {
            markup += "<li class='cs-ddl-result' data-id='" + d[i][c.idProp] + "'><div class='cs-ddl-result-content'>" + this.renderResultContent(this, c, d[i]) + "</div></li>";
        }
        this.resultsEl.innerHTML = markup;
    }


    renderResultContent(ddl, ctrl, obj)
    {
        var highlightedMarkup = ddl.getHighlightedMarkup(obj[ctrl.textProp]);                      //Get highlighted version of the object's text property

        if(ctrl.renderResultFn) {return ctrl.renderResultFn(ddl, ctrl, obj, highlightedMarkup); }  //If control has a custom render function for results run in and return results
        return highlightedMarkup;                                                                  //Otherwise just return the highlighted text
    }


    getHighlightedMarkup(txt)
    {
        var searchTxt = this.inputEl.value.toLowerCase(),
            searchLen = searchTxt.length,
            matchIx   = txt.toLowerCase().indexOf(searchTxt),
            markup;
            
        if (matchIx < 0 || searchTxt.length < 1) { return chs.encodeHtml(txt); }

        markup = chs.encodeHtml(txt.substring(0, matchIx)) +
                "<span class='cs-ddl-result-highlight'>" +
                chs.encodeHtml(txt.substring(matchIx, matchIx + searchLen)) +
                "</span>" +
                chs.encodeHtml(txt.substring(matchIx + searchLen));

        return markup;
    }


    onInputKeyDown(evt)
    {
        var c = this.curCtrl, isOpen = c.isOpen, resultsEl = this.resultsEl, results, selectedResult, ix, newRes;

        switch (evt.keyCode)
        {
            case 40:  //Down
                if (isOpen)
                {
                    results = resultsEl.querySelectorAll("." + ResultClass);          //Get results
                    if(!results.length) {return false;}

                    selectedResult = resultsEl.querySelector("." + FocusClass);       //Get currently selected result
                    selectedResult.classList.remove(FocusClass);                      //Remove selection class from prev selection

                    ix = getIndexOfNode(results, selectedResult) + 1;                 //Get index after selected result
                    if (ix >= results.length) { ix = 0; }                             //Wrap around as necessary
                    
                    newRes = results[ix];                                             //Get new result
                    newRes.classList.add(FocusClass);                                 //Add selection class to newly selected result

                    if (!isInView(resultsEl, newRes, true))                           //If not totally visible, scroll to it
                    {
                        resultsEl.scrollTop = (newRes.offsetTop - resultsEl.offsetTop) + (newRes.offsetHeight - resultsEl.offsetHeight);
                    }
                    
                    return false;
                }
                c.lastInput = "";  //Cause prev input to not match current (which will cause a query on keyUp)
                return;
                
            case 38:  //Up
                if (isOpen)
                {
                    results        = resultsEl.querySelectorAll("." + ResultClass);   //Get results
                    if(!results.length) {return false;}

                    selectedResult = resultsEl.querySelector("." + FocusClass);       //Get currently selected result
                    selectedResult.classList.remove(FocusClass);                      //Remove selection class from prev selection

                    ix = getIndexOfNode(results, selectedResult) - 1;                 //Get index before selected result
                    if (ix < 0) { ix = (results.length - 1); }                        //Wrap around as necessary
                    
                    newRes = results[ix];                                             //Get new result
                    newRes.classList.add(FocusClass);                                 //Add selection class to newly selected result

                    if (!isInView(resultsEl, newRes, true))                           //If not totally visible, scroll to it
                    {
                        resultsEl.scrollTop = newRes.offsetTop - resultsEl.offsetTop;
                    }
                    
                    return false;
                }
                return;

            case 27:  //ESC
                if (isOpen)
                {
                    this.hideDDL(); c.element.focus();
                    return false;
                }
                return;
                
            case 13:  //Enter
                if (isOpen) { this.addSelectedResult(); return false; }
                return;
                
            case 9:  //Tab
                evt.preventDefault();
                this.hideDDL();
                this.curCtrl.element.focus();
                return false;
        }
    }

    onInputKeyUp(evt)
    {
        var currentInput = this.inputEl.value;

        switch (evt.keyCode)
        {
            case  9:  //Tab
            case 13:  //Enter
            case 27:  //Esc
                return;
        }

        if (this.curCtrl.lastInput !== currentInput)   //Attempt a query if input has changed
        {
            this.curCtrl.lastInput = currentInput;
            this.queryIfAllowedAndEnsureDDLVisible();
        }
    }

    

    addSelectedResult()
    {
        var result          = this.resultsEl.querySelector("." + FocusClass),
            id              = Number(result.dataset.id),  //read data-id attribue
            obj             = null,
            c               = this.curCtrl,
            filteredResults = c.filteredResults;
        
        //Search thru filtered result objects to grab the one w/ the id matching the id on the selected result element
        for (var i = 0; i < filteredResults.length; i++) 
        {
            if (filteredResults[i][c.idProp] === id) { obj = filteredResults[i]; break; }
        }

        if (obj === null) { return; }
        
        this.hideDDL();
        c.addSelectedResult(obj);

        setTimeout(()=>c.element.focus(), 1);
    }
}



function getIndexOfNode(nodeList, node)  //returns the index of the node in the nodelist
{
    for(var i = 0; i < nodeList.length; i++)
    {
        if(nodeList[i] === node) { return i; }
    }
    return -1;
}


function isInView(container, el, fullyInView)   //Simplistic check if element is visible when inside a vertically scrolling parent
{
    var containerTop    = container.scrollTop,
        containerBottom = containerTop + container.offsetHeight,
        elTop           = chs.jqOffset(el).top + containerTop;

    if(container !== window)
    {
        elTop -= chs.jqOffset(container).top;
    }


    var elBottom = elTop + el.offsetHeight;
    if (fullyInView)
    {
        return ((containerTop <= elTop) && (containerBottom >= elBottom));  //Is element fully visible?
    }
    return ((elBottom >= containerTop) && (elTop <= containerBottom));    //Is element visible at all?
}






