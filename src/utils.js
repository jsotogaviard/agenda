import moment from "moment/moment";


/**
 * Contants
 */

export const OPENING = "opening"

export const APPOINTMENT = "appointment"

export const EVENTS = "events"

export const STARTS_AT = "starts_at"

export const ENDS_AT = "ends_at"

export const KIND = "kind"

export const WEEKLY_RECURRING = "weekly_recurring"

export const MINUTES = "minutes"

export const SEVEN_DAYS = 7

export const DAYS = "days"

/**
 * Format the date to a string
 *
 * @param date
 * @returns {string}
 */
export function format(date){
    return moment(date).format('YYYY-MM-DD');
}

/**
 * Return the day of year
 *
 * @param time
 * @returns {number}
 */
function doy(time){
    let date = new Date(time)
    let start = new Date(date.getFullYear(), 0, 0);
    let diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    let oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Events must happen the same day or different day
 * but must end at midnight
 * @param event
 * @returns {boolean}
 */
export function isCoherent(event){
    let fromDay = doy(event[STARTS_AT])
    let toDay = doy(event[ENDS_AT])
    if(fromDay === toDay)
        return true

    let d = new Date(event[ENDS_AT])
    if((toDay - fromDay === 1) && d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0){
        return true
    }

    return false
}

/**
 * Compute the day
 *
 * @param dateTime
 * @returns {Date}
 */
export function day(dateTime){
    let tmp = new Date()
    tmp.setTime(dateTime)
    tmp.setHours(0)
    tmp.setMinutes(0)
    tmp.setSeconds(0)
    tmp.setMilliseconds(0)
    return tmp
}

/**
 * Compute the hour minute as string
 *
 * @param date
 * @returns {string}
 */
export function hourMinute(date){
    let minutes
    if(date.getMinutes() < 10){
        minutes = "0" + date.getMinutes()
    } else {
        minutes = date.getMinutes()
    }
    return date.getHours().toString() + ":" + minutes
}

/**
 * Print results
 *
 * @param availabilities
 */
export function printAvailabilities(availabilities){
    for(let avIdx in availabilities){
        let av = availabilities[avIdx]
        console.log(avIdx + ':' + JSON.stringify(av))
    }
}