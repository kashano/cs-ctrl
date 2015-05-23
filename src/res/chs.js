//Common keycodes
export var keyCode =
{
    BACKSPACE: 8,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    LEFT: 37,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    RIGHT: 39,
    SPACE: 32,
    TAB: 9,
    UP: 38
};


export function encodeHtml(txt)
{
    return txt.replace(/&/g, '&amp;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');

}

export function isAlphaNumericKey(keyCode)
{
    var r = (keyCode > 47 && keyCode < 58) || // Number keys
            (keyCode > 64 && keyCode < 91);   // Letter keys
    return r;
}



export function isFunc(obj) 
{ 
    return typeof obj == 'function' || false; 
}



export function copy(obj)
{
    var myCopy;

    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) 
    {
        myCopy = new Date();
        myCopy.setTime(obj.getTime());
        return myCopy;
    }

    // Handle Array
    if (obj instanceof Array) 
    {
        myCopy = [];
        for (var i = 0, len = obj.length; i < len; i++) 
        {
            myCopy[i] = copy(obj[i]);
        }
        return myCopy;
    }

    // Handle Object
    if (obj instanceof Object) 
    {
        myCopy = {};
        for (var attr in obj)
        {
            if (obj.hasOwnProperty(attr)) myCopy[attr] = copy(obj[attr]);
        }
        return myCopy;
    }

    throw new Error("Unable to clone object. Its type isn't supported.");
}




//String helpers
//---------------------------------------------------------------------------------
if (!isFunc(String.prototype.containsWords))
{
    String.prototype.containsWords = function (searchTxt) //True if all of the tokens in the search text are found in the string
    {
        var str      = this.toLowerCase(),
            lcSearch = searchTxt.toLowerCase();

        var searchWords = lcSearch.split(' ');
        if (searchWords.length === 0) { return true; }

        for (var i = 0; i < searchWords.length; i++)
        {
            if (str.indexOf(searchWords[i]) === -1) { return false; }
        }
        return true;
    };
}


//Array helpers
//---------------------------------------------------------------------------------
if (!isFunc(Array.prototype.chsRemoveMatchingElements))
{
    Array.prototype.chsRemoveMatchingElements = function (fieldToTest, arr)     //Removes all elements in the array matching an element in the given array
    {
        var i, x = 0;

        for (; x < arr.length; x++)                  //Go thru items in given array
        {
            for (i = this.length - 1; i >= 0; i--)   //Go backwards thru this array's items
            {
                if (this[i][fieldToTest] === arr[x][fieldToTest]) { this.splice(i, 1); }
            }
        }
        return this;
    };
}


if (!isFunc(Array.prototype.chsRemoveWithProperty))
{
    Array.prototype.chsRemoveWithProperty = function (fieldToTest, val)     //Removes all elements in the array w/ the given property value
    {   
        for (var i = this.length - 1; i >= 0; i--)   //Go backwards thru this array's items
        {
            if (this[i][fieldToTest] === val) { this.splice(i, 1); }
        }
        
        return this;
    };
}



//jQuery replacements
//---------------------------------------------------------------------------------
export function closest(el, selector) 
{
    var matchesFn;

    //Find match function supported by browser
    var arrMatch = ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'];
    for(var i = 0; i < arrMatch.length; i++)
    {
        if (typeof document.body[arrMatch[i]] == 'function') 
        {
            matchesFn = arrMatch[i];
            break;
        }
    }


    //Starting w/ the given element, traverse up thru parents for a selctor match
    var testEl = el;
    while (testEl !== null) 
    {
        if (testEl[matchesFn](selector)) { return testEl; }
        
        testEl = testEl.parentElement;
    }

    return null;
}

export function jqOffset(el)  //Returns element coordinates releative to the document origin
{
    var rect = el.getBoundingClientRect();
    var offset = 
    {
        top : rect.top  + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    };
    return offset;
}


export function extend(out)
{
    out = out || {};

    for (var i = 1; i < arguments.length; i++) 
    {
        var obj = arguments[i];

        if (!obj) { continue; }
            
        for (var key in obj) 
        {
            if (obj.hasOwnProperty(key)) 
            {
                if (typeof obj[key] === 'object') { extend(out[key], obj[key]); }
                else                              { out[key] = obj[key];        }
            }
        }
    }

    return out;
}



export function getSiblings(el, filter)
{
    var sibs = [];
    el = el.parentNode.firstChild;
    do 
    {
        if (!filter || filter(el))  { sibs.push(el); }
    } while (el = el.nextSibling)
    return sibs;
}