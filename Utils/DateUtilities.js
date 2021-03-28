// Returns the day of the week by receiving the 
// date object as input.
function getDayOfWeek(date) {
    const dayOfWeek = new Date(date).getDay();    
    return isNaN(dayOfWeek) ? null : 
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];
}

// Returns the full name of the week day 
// by receiving the short name of the week day
function getFullNameOfWeekDay(shortWeekDay){
  switch (shortWeekDay) {
    case 'Sun':
      return 'Sunday'
    case 'Mon':
      return 'Monday'
    case 'Tue':
      return 'Tuesday'
    case 'Wed':
      return 'Wednesday'
    case 'Thu':
      return 'Thursday'
    case 'Fri':
      return 'Friday'
    case 'Sat':
      return 'Saturday'
    default:
      return null;
  }
}

module.exports.getDayOfWeek = getDayOfWeek;
module.exports.getFullNameOfWeekDay = getFullNameOfWeekDay;