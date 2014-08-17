/**
 * SAWS Parallel Text Viewer IE8 Compatability Functions
 *
 * Project: KCL/SAWS
 * Last Changed: $LastChangedDate: 2013-04-26 18:53:06 +0100 (Fri, 26 Apr 2013) $
 * SVN Revision: $Rev: 535 $
 *
 * This library contains fixes required to allow the viewer to run on IE8.
 * 
 */

if (typeof console === "undefined"){
    console = function(){
        this.log = function(){
            return;
        };
        this.warn = function(){
            return;
        };
        this.error = function(){
            return;
        };
    }
}

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}