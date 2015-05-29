import * as chs from '../chs';

var MonthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var PrevButtonCSS  = 'cs-cal-prev',
    NextButtonCSS  = 'cs-cal-next',
    CellContentCSS = 'cs-cal-cell-content';

//Singleton calendar (datepicker) popup for cs-date
//----------------------------------------------------------------------------------------
export class CalendarPopup
{
    constructor()
    {
        var self = this;
        self.curCtrl = null;               //Stores a reference to the current cs-date ctrl this calendar is working with
        
        //Append a <div class='cs-cal'> element to the document body.
        self.element = document.createElement("div");
        self.element.className = 'cs-cal cs-hidden';
        document.body.appendChild(self.element);
    }
    
    wireEvents()
    {
        var self = this;
        
        if(self.mousedownHandler) { return; }   //Don't allow multiple sets of event handlers
        
        //Mouse Down
        self.mousedownHandler = function(ev)
        {
            var target = ev.target;
            
            //If mousedown on calendar
            if(self.element.contains(target)) { return; }           
            
            //If mousedown on current cs-date ctrl
            if(self.curCtrl && self.curCtrl.element.contains(target)) { return; }
            
            self.hide();
        };
        
        //Mouse Up
        self.mouseupHandler = function(ev)
        {
            var cl = ev.target.classList;
            
            if(cl.contains(PrevButtonCSS)) { return self.changeMonth(-1); }   //Prev button on calendar
            if(cl.contains(NextButtonCSS)) { return self.changeMonth(1);  }   //Next button on calendar

            if(cl.contains(CellContentCSS))                                   //Calendar day cell
            {
                self.curCtrl.value = new Date(self.lastDt.getFullYear(), self.lastDt.getMonth(), ev.target.innerText);
                return self.hide();
            }
        };
        
        document.addEventListener('mousedown', self.mousedownHandler);
        document.addEventListener('mouseup', self.mouseupHandler);
    }
    
    removeEvents()
    {
        var self = this;
        document.removeEventListener('mousedown', self.mousedownHandler);
        document.removeEventListener('mouseup', self.mouseupHandler);
        self.mousedownHandler = null;
        self.mouseupHandler   = null;
    }
    
    hide()
    {
        var self    = this;
        self.isOpen = false;
        self.lastDt = null;  //Clear out last so on next show we'll render from the ctrl's date
        self.element.classList.add("cs-hidden");
        self.removeEvents();
    }
    
    show(ctrl)
    {
        var self    = this;
        self.isOpen = true;
        if(ctrl) { self.curCtrl = ctrl; }
        self.render();
        self.position();
        self.element.classList.remove("cs-hidden");
        self.wireEvents();
    }


    //Increments/decrements the rendered month
    changeMonth(delta)
    {
        var lDt = this.lastDt;
        lDt.setDate(1);          //I think this may prevent wierd edgecase errors like adding to the 31st day of a month
        lDt.setMonth(lDt.getMonth() + delta);
        this.render(lDt);
    }



    render(pDt)
    {
        var self = this, ctrl = self.curCtrl, ctrlDt = ctrl.value;

        var dt = pDt || ctrlDt || new Date();
        dt = new Date(dt.getTime());                     //Ensure we work with a clone if using the ctrl's date

        var month       = dt.getMonth();
        var year        = dt.getFullYear();
        var firstDayDt  = new Date(year, month, 1);      //1st date of the month
        var startDay    = firstDayDt.getDay();           //That date's day number (0-6)
        var todayDt     = new Date();                    //Today's date
        var today       = -1;                            //Today's day number. -1 if today's date doesn't fall within the calendar month we are rendering.
        var activeDay   = -1;                            //Day number of the currently selected date. -1 if one doesn't exist within the calendar month we are rendering.

        //Record that this was the last date we rendered with
        self.lastDt = dt;

        //Get total days in the month
        dt = new Date(year, month + 1, 0);
        var daysInMonth = dt.getDate();
        
        //Explanation of the above:
        //Date constructor attempts to convert year/month/day values to the nearest valid date. Month is incremented to get the following month, then a Date object is created with zero days. 
        //Since this is invalid, the Date object defaults to the last valid day of the previous month which is the month we're actually interested in. 
        //Then getDate() returns the day (1-31) of that date, & that gives us the number of days in that month. As a bonus this handles leap year too.
        

        //Determine if the month we're rendering includes today's date
        if(month == todayDt.getMonth() && year == todayDt.getFullYear())
        {
            today = todayDt.getDate();
        }
        
        //Determine if the month we're rendering includes the currently selected date
        if(ctrlDt && month == ctrlDt.getMonth() && year == ctrlDt.getFullYear())
        {
            activeDay = ctrlDt.getDate();
        }
        
        var html = `<div class='cs-cal-hdr'>
                        <a class='` + PrevButtonCSS + `'><i class='cs-cal-prev-ico'></i></a>
                        <div class='cs-cal-title'>` + MonthName[month] + ' ' + year + `</div>
                        <a class='` + NextButtonCSS + `'><i class='cs-cal-next-ico'></i></a>
                    </div>
                    <table class='cs-cal-tbl'>
                        <tr class='cs-cal-dayrow'>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>Su</span></th>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>Mo</span></th>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>Tu</span></th>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>We</span></th>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>Th</span></th>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>Fr</span></th>
                          <th class='cs-cal-daycell'><span class='cs-cal-daylbl'>Sa</span></th>
                        </tr><tr>`;

        //Build day cells
        var w = 0, d, dayCount = 1;
        for (; w < 6; w++)           //Week loop (6 rows may be more than we need. We'll break out before if so.)
        {
            for (d = 0; d < 7; d++)  //Day loop (cells)
            {
                if (dayCount <= daysInMonth && (w > 0 || d >= startDay))       //Fill the cell if we still have days left, & we're not on the 1st row, or this day is >= the starting day for the month
                {
                    html += "<td class='cs-cal-cell";
                    
                    if(dayCount == activeDay) { html += " cs-active"; }        //Currently selected day
                    
                    html += "'><div class='cs-cal-cell-content";
                    
                    if(dayCount == today)  { html += " cs-today"; }            //Today's date cell
                    
                    html += "'>" + dayCount + "</div></td>"; 
                    dayCount++;
                }
                else
                {
                    html += '<td class="cs-cal-cell cs-cal-cell-blank"></td>'; //Empty cell
                }
            }
            if(dayCount > daysInMonth) { break; }
            html += "</tr><tr>";
        }
        html += "</tr></table>";

        self.element.innerHTML = html;
    }
    
    position()
    {
        var ctrlEl      = this.curCtrl.element,         //The DOM element for the control we are attaching this DDL to
            ctrlPos     = chs.jqOffset(ctrlEl),         //Coordinates relative to the document
            cal         = this.element,                 //The calendar element
            ctrlHeight  = ctrlEl.offsetHeight,          //Height of the control we're attached to
            y           = ctrlPos.top + ctrlHeight,     //Y position directly below ctrl
            wh          = window.innerHeight,           //Height of the browser viewport including, if rendered, the horizontal scrollbar
            topSpace    = ctrlPos.top,                  //Space available above ctrl
            botSpace    = (wh - y);                     //Space available below ctrl
            

        //Set cal left position
        cal.style.left = ctrlPos.left + 'px';
       
        //If cal would extend beyond the window assume it's better to show above the control *IF* topSpace has more room
        if ((y + cal.offsetHeight) > wh) 
        {
            if (topSpace > botSpace) //Top space has more room so put above the ctrl
            {
                //borderTop = true;
                y = ctrlPos.top - cal.offsetHeight - 1;
            }
        }
 
        //Set top position
        cal.style.top = y + 'px';
    }
}