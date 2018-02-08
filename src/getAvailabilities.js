import moment from 'moment'
import {day, APPOINTMENT, DAYS, OPENING, SEVEN_DAYS} from './utils'
import {init, relevantEvents, contribute, transform, adaptToWeek} from './core'

/**
 * The main function :
 *
 *  - compute from and to
 *  - get from db the relevant events
 *  - initialize the internal object for availabilities
 *  - adapt openings to current week
 *  - contribute openings and appointments to availabilities
 *  - transform internal object
 *
 * @param initial
 * @returns {Promise<Array>}
 */
export default async function getAvailabilities(initial) {
    // Init from and to
    let from = day(initial)
    let to =  moment(from).add(SEVEN_DAYS, DAYS).toDate()

    // Get relevant events
    let events = await relevantEvents(from, to)

    //Initialize availabilities
    let availabilities = init(initial)

    // Adapt openings to be to current week
    events = adaptToWeek(from, to, events);

    // Contribute openings
    contribute(from, to, events[OPENING], availabilities, function(availability, hm){
        availability.push(hm)
    })

    // Contribute appointments
    contribute(from, to, events[APPOINTMENT], availabilities, function(availability, hm){
        let index = availability.indexOf(hm)
        if(index >= 0){
            availability.splice(index, 1)
        } else {
            throw Error("Removing a not available time")
        }
    })

    // Transform the internal availabilities
    return transform(initial, availabilities);
}