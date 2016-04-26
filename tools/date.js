//=============================================================================
//    Date
//=============================================================================

Date.prototype.toDateFormat = function(format) {
   var monthAbbrNames = ['Month', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
   var monthFullNames = ['Month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
   
   var yyyy = this.getFullYear().toString();
   var month = (this.getMonth()+1); // getMonth() is zero-based
   MM = month < 10 ? "0" + month : month;
   var dd  = this.getDate();
   dd  = dd > 9 ? dd : "0" + dd;
   var HH = this.getHours();
   HH  = HH > 9 ? HH : "0" + HH;
   var mm = this.getMinutes();
   mm  = mm > 9 ? mm : "0" + mm;
   var ss = this.getSeconds();
   ss  = ss > 9 ? ss : "0" + ss;
   var fff = this.getMilliseconds().toString();

   var formattedDate = format;
   formattedDate = formattedDate.replace('MMMM', monthFullNames[month]);
   formattedDate = formattedDate.replace('MMM', monthAbbrNames[month]);
   formattedDate = formattedDate.replace('yyyy', yyyy);
   formattedDate = formattedDate.replace('MM', MM);
   formattedDate = formattedDate.replace('dd', dd);
   formattedDate = formattedDate.replace('HH', HH);
   formattedDate = formattedDate.replace('mm', mm);
   formattedDate = formattedDate.replace('ss', ss);
   formattedDate = formattedDate.replace('fff', fff);
   
   return formattedDate;
};
