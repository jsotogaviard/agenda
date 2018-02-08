import moment from "moment/moment";
import knex from "knexClient";
import {day, hourMinute, format, isCoherent,
    OPENING, APPOINTMENT, MINUTES, SEVEN_DAYS,
    DAYS, EVENTS, WEEKLY_RECURRING,
    KIND, STARTS_AT, ENDS_AT} from "./utils";

/**
 * Init the availabilities to current week
 *
 * @param initial
 * @returns {{}}
 */
export function init(initial){
    let availabilities = {}
    for(let i= 0 ; i < SEVEN_DAYS ; i++ ){
        let date = format(moment(initial).add(i, DAYS).toDate());
        availabilities[date] = []
    }
    return availabilities
}

/**
 * Get the relevant events from db
 *
 * @param from
 * @param to
 * @returns {Promise<{appointment: Array, opening: Array}>}
 */
export async function relevantEvents(from, to){

    let events = await knex
        .select()
        .from(EVENTS)

        // Retrieve all events in current week
        .where(function() {
            this.where(STARTS_AT, '>=', from)
                .andWhere(ENDS_AT, '<=', to)})

        // Retrieve all recurring opening events
        // that occur prior to this week
        .orWhere(function() {
            this.where(KIND, OPENING)
                .andWhere(ENDS_AT, '<=', from)
                .andWhere(WEEKLY_RECURRING, true)})

    let relevantEvents = {}
    relevantEvents[APPOINTMENT] = []
    relevantEvents[OPENING] = []

    events = events || []
    for(let eventIdx in events){
        let event = events[eventIdx]
        if(!isCoherent(event)){
            throw new Error("Not coherent event " + JSON.stringify(event))
        }
        relevantEvents[event.kind].push(event)
    }
    return relevantEvents
}

/**
 * Contribute events to availabilities
 *
 * @param from
 * @param to
 * @param events
 * @param availabilities
 * @param contribution
 */
export function contribute(from, to, events, availabilities, contribution){
    for(let eventIdx in events){

        let event = events[eventIdx]
        let eventDay = day(event[STARTS_AT])
        let availability = availabilities[format(eventDay)]
        if(!availability)
            throw new Error("No availability found for " + eventDay)
        let appStarts = new Date(event[STARTS_AT])
        let appEnds = new Date(event[ENDS_AT])
        while(appStarts < appEnds){

            let hm = hourMinute(appStarts)
            contribution(availability, hm)
            appStarts = moment(appStarts).add(30, MINUTES).toDate()
        }
    }
}

/**
 * Transform the availibilities
 *
 * @param initial
 * @param availabilities
 * @returns {Array}
 */
export function transform(initial, availabilities){
    let transformed = [];
    let i = 0
    for(let idx in availabilities){
        transformed[i] = {
            date : moment(initial).add(i, DAYS).toDate(),
            slots : availabilities[idx]
        }
        i++
    }
    return transformed
}


/**
 * Adapt the week dates
 * We only need to adapt the openings
 *
 * @param from
 * @param to
 * @param events
 * @returns {*}
 */
export function adaptToWeek(from, to, events){

    // Only need to adapt opening events
    for(let openingIdx in events[OPENING]) {

        let opening = events[OPENING][openingIdx]
        let openingStarts = new Date(opening[STARTS_AT])
        let openingEnds = new Date(opening[ENDS_AT])

        // Find the opening in the current week
        while (!(from <= openingStarts && openingStarts < to)) {
            openingStarts = moment(openingStarts).add(SEVEN_DAYS, DAYS).toDate()
            openingEnds = moment(openingEnds).add(SEVEN_DAYS, DAYS).toDate()
        }

        opening[STARTS_AT] = openingStarts.getTime()
        opening[ENDS_AT] = openingEnds.getTime()

    }
    return events

}