import * as chs from '../chs';

var MonthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


//Singleton datepicker popup for cs-date
//----------------------------------------------------------------------------------------
export class CalendarPopup
{
    constructor()
    {
        var self = this, doc = document;
        self.curCtrl = null;               //Stores a reference to the current cs-date ctrl this calendar is working with
        
        //Append a <div class='cs-cal'> element to the document body.
        self.element = doc.createElement("div");
        self.element.className = 'cs-cal cs-hidden';
        doc.body.appendChild(self.element);
        
        //Wire document events
        doc.addEventListener('mousedown', (ev) =>
        {
            var target = ev.target;
            var tEl = chs.closest(target, ".cs-cal");           //If mousedown on calendar
            if(tEl) { return;}      
           
            tEl = chs.closest(target, ".cs-date");              //If mousedown on cs-date ctrl
            if(tEl) { return; }           
            
            self.hide();
        });

        doc.addEventListener('mouseup', (ev) =>
        {
            var target = ev.target;
            var tEl    = chs.closest(target, ".cs-date-btn");      //Show calendar button of a ctrl
            if(tEl) 
            {
                self.curCtrl = tEl.parentNode.primaryBehavior.executionContext;
                self.show();
                return;
            }
            
            tEl = chs.closest(target, ".cs-cal-prev");             //Prev button on calendar
            if(tEl) { return self.changeMonth(-1); }

            tEl = chs.closest(target, ".cs-cal-next");             //Next button on calendar
            if(tEl) { return self.changeMonth(1); }
            
            tEl = chs.closest(target, ".cs-cal-cell-content");     //Calendar day cell
            if(tEl) 
            { 
                self.curCtrl.value = new Date(self.lastDt.getFullYear(), self.lastDt.getMonth(), tEl.innerText);
                return self.hide();
            }
        });

    }
    
    hide()
    {
        this.element.classList.add("cs-hidden");
        this.lastDt = null;  //Clear out last so on next show we'll render from the ctrl's date
    }
    
    show()
    {
        this.render();
        this.position();
        this.element.classList.remove("cs-hidden");
    }


    //Increments/decrements the rendered month
    changeMonth(delta)
    {
        var lDt = this.lastDt;
        lDt.setDate(1);          //I think this may prevent wierd edgecase errors like adding to the 31st day of a month
        lDt.setMonth(lDt.getMonth() + delta);
        this.render(lDt);
    }



    render(dt)
    {
        var self = this, ctrl = self.curCtrl, ctrlDt = ctrl.value;

        var dt = dt || ctrlDt || new Date();
        dt = new Date(dt.getTime());                     //Ensure we work with a clone if using the ctrl's date

        var month       = dt.getMonth();
        var year        = dt.getFullYear();
        var firstDayDt  = new Date(year, month, 1);      //1st date of the month
        var startDay    = firstDayDt.getDay();           //That day's day number (0-6)
        var todayDt     = new Date();
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
                        <a class='cs-cal-prev'><i class='cs-cal-prev-ico'></i></a>
                        <div class='cs-cal-title'>` + MonthName[month] + ' ' + year + `</div>
                        <a class='cs-cal-next'><i class='cs-cal-next-ico'></i></a>
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
                if (dayCount <= daysInMonth && (w > 0 || d >= startDay))     //Fill the cell if we still have days left, & we're not on the 1st row, or this day is >= the starting day for the month
                {
                    if(dayCount == today)                                                                             //Today's date cell
                    {
                        html += "<td class='cs-cal-cell'><div class='cs-cal-cell-content cs-today'>" + dayCount + "</div></td>"; 
                    }
                    else if(dayCount == activeDay)                                                                    //Currently selected date
                    {
                        html += "<td class='cs-cal-cell cs-active'><div class='cs-cal-cell-content'>" + dayCount + "</div></td>"; 
                    }
                    else                                                                                              //Normal date cell
                    {
                        html += "<td class='cs-cal-cell'><div class='cs-cal-cell-content'>" + dayCount + "</div></td>"; 
                    }
                    dayCount++;
                }
                else
                {
                    html += '<td class="cs-cal-cell cs-cal-cell-blank"></td>';           //Empty cell
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
        cal.style.left   = ctrlPos.left + 'px';
       
        
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
        
        //Assign top/bottom border
//        if(borderTop)
//        {
//            ddl.style.borderTopStyle    = 'solid';
//            ddl.style.borderBottomStyle = 'none';
//        }
//        else
//        {
//            ddl.style.borderBottomStyle = 'solid';
//            ddl.style.borderTopStyle    = 'none';
//        }
    }
}