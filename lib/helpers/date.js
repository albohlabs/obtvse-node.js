
/**
 * date helper
 */

var
    monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
  , date = new Date()
  , month = date.getMonth()
  , day = date.getDay() + 1
  , year = date.getFullYear()

/**
* get current date
*
* @return curDate
*/

this.getDate = function() {
    day = String(day).length < 2
        ? '0' + day
        : day

    return monthNames[month] + ' ' + day + ', ' + year
}

