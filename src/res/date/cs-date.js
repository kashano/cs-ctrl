var MonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


import {customElement, bindable, bindingMode} from 'aurelia-framework';
import {CalendarPopup} from './calendar-popup';
import * as chs from '../chs';



@customElement('cs-date')
@bindable({name              : 'value',
           attribute         : 'value',
           changeHandler     : 'valueChanged',
           defaultBindingMode: bindingMode.twoWay,
           defaultValue      : null
})
export class CsDate
{
    static defaultOps =
    {
        format : "ISO"             //Format date strings are expected to be in. ISO=YYYY-MM-DD, USA=M/D/YYYY
    };
    
    static inject = [Element, CalendarPopup];
    constructor(element, calendar)
    {
        this.element  = element;
        this.calendar = calendar;
    }
    
    
    //Lifecycle hooks
    //-------------------------------------------------------------------------------------------------------------------------------------------
    bind(bindingContext)   //Invoked when the databinding engine binds the view
    {
        var self = this, el = self.element;
        self.ops = chs.extend({}, CsDate.defaultOps);
        
        el.classList.add("cs-date");
        el.classList.add("cs-ctrl");
        
        //Set options from attributes
        self.ops.format   = el.getAttribute("format") || self.ops.format;
        self.ops.required = el.hasAttribute("required");
        
        self.updateInputValue();
    }
    unbind()
    {
        console.log("Date unbound");
    }
    
    
    //Binding change handlers
    //-------------------------------------------------------------------------------------------------------------------------------------------
    valueChanged(newVal)
    {
        console.log("Date value changed");
        this.updateInputValue();
    }
    
   
    
    //Event handlers
    //-------------------------------------------------------------------------------------------------------------------------------------------
    onInput()
    {
        console.log("Date inputValue changed");
        var self = this, txt = self.inputValue;
        
        if(!txt)   //If input is blank, set date value to null
        {
            self.value = null;
            return; 
        } 
        
        //If date ented is valid, assign the new date value
        var dt = parseDateStr(txt, self.ops.format);
        if(dt) { self.value = dt; }
    }
    
    
    //
    updateInputValue()
    {
        var self = this, dt = self.value;
        if(!self.value) { self.inputValue = ""; return; }
        
        if(this.ops.format == "ISO")
        {
            self.inputValue = dt.getFullYear() + "-" + pad2(dt.getMonth() + 1) + "-" + pad2(dt.getDate());
        }
        else   //USA
        {
            self.inputValue = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
        }
    }
  
}



//Pads the given value with a 0 as necessary to ensure it is 2 digits
function pad2(num)
{
    var s = "0" + num;
    return s.substr(s.length - 2);
}

//Returns a date object if the given date string matches the given format & is a valid date. Returns null otherwise.
function parseDateStr(txt, fmt)
{
    var year, month, day, parts, maxDays;
    
    if(!txt) { return null; }
    
    if(fmt == "ISO")          //ISO = YYYY-MM-DD
    {
        if(txt.length != 10) { return null; }
        year  = Number(txt.substr(0, 4));
        month = Number(txt.substr(5, 2));
        day   = Number(txt.substr(8, 2));
    }
    else                      //USA = M/D/YYYY             
    {
        parts = txt.split(/[\/\.-]/);   //Allow / . - as seperators
        if(parts.length != 3) { return null; }
        month = Number(parts[0]);
        day   = Number(parts[1]);
        year  = Number(parts[2]);
    }


    //Run some checks
    if(!(month > 0 && day > 0 && year > 0)) { return null; }  //Ensure all date parts are positive numbers
    if(month > 12)                          { return null; }  //Ensure a valid month #   
    
    
    //Get max days in the month
    maxDays = MonthDays[month-1];
    if(month == 2)                     //Check for leap year in case of Feb
    {
        if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))  //If leap year
        {
            maxDays = 29;
        }
    }
    if(day > maxDays) { return null; }  //Ensure valid day

    return new Date(year, month-1, day);
}