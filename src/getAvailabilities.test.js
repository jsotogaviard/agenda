import knex from 'knexClient'
import getAvailabilities from './getAvailabilities'

describe('getAvailabilities', () => {
    beforeEach(() => knex('events').truncate())

    describe('simple case', () => {
        beforeEach(async () => {
            await knex('events').insert([
                {
                    kind: 'opening',
                    starts_at: new Date('2014-08-04 09:30'),
                    ends_at: new Date('2014-08-04 12:30'),
                    weekly_recurring: true,
                },
                {
                    kind: 'appointment',
                    starts_at: new Date('2014-08-11 10:30'),
                    ends_at: new Date('2014-08-11 11:30'),
                },
            ])
        })

        it('should fetch availabilities correctly', async () => {
            const availabilities = await getAvailabilities(new Date('2014-08-10'))
            expect(availabilities.length).toBe(7)

            expect(String(availabilities[0].date)).toBe(
                String(new Date('2014-08-10')),
            )
            expect(availabilities[0].slots).toEqual([])

            expect(String(availabilities[1].date)).toBe(
                String(new Date('2014-08-11')),
            )
            expect(availabilities[1].slots).toEqual([
                '9:30',
                '10:00',
                '11:30',
                '12:00',
            ])

            expect(String(availabilities[2].date)).toBe(
                String(new Date('2014-08-12')),
            )

            expect(String(availabilities[3].date)).toBe(
                String(new Date('2014-08-13')),
            )

            expect(String(availabilities[4].date)).toBe(
                String(new Date('2014-08-14')),
            )

            expect(String(availabilities[5].date)).toBe(
                String(new Date('2014-08-15')),
            )

            expect(String(availabilities[6].date)).toBe(
                String(new Date('2014-08-16')),
            )
        })
    })

    describe('Events in the same week', () => {
        beforeEach(async () => {
            await knex('events').insert([
                {
                    kind: 'opening',
                    starts_at: new Date('2014-08-11 09:30'),
                    ends_at: new Date('2014-08-11 12:30'),
                    weekly_recurring: true,
                },
                {
                    kind: 'appointment',
                    starts_at: new Date('2014-08-11 10:30'),
                    ends_at: new Date('2014-08-11 11:30'),
                },
            ])
        })

        it('should fetch availabilities correctly', async () => {
            const availabilities = await getAvailabilities(new Date('2014-08-10'))
            expect(availabilities.length).toBe(7)

            expect(String(availabilities[0].date)).toBe(
                String(new Date('2014-08-10')),
            )
            expect(availabilities[0].slots).toEqual([])

            expect(String(availabilities[1].date)).toBe(
                String(new Date('2014-08-11')),
            )
            expect(availabilities[1].slots).toEqual([
                '9:30',
                '10:00',
                '11:30',
                '12:00',
            ])

            expect(String(availabilities[2].date)).toBe(
                String(new Date('2014-08-12')),
            )

            expect(String(availabilities[3].date)).toBe(
                String(new Date('2014-08-13')),
            )

            expect(String(availabilities[4].date)).toBe(
                String(new Date('2014-08-14')),
            )

            expect(String(availabilities[5].date)).toBe(
                String(new Date('2014-08-15')),
            )

            expect(String(availabilities[6].date)).toBe(
                String(new Date('2014-08-16')),
            )
        })
    })

    describe('Working from 23:30 to 00:00', () => {
        beforeEach(async () => {
            await knex('events').insert([
                {
                    kind: 'opening',
                    starts_at: new Date('2014-08-09 23:30'),
                    ends_at: new Date('2014-08-10 00:00'),
                    weekly_recurring: true,
                },
                {
                    kind: 'appointment',
                    starts_at: new Date('2014-08-16 23:30'),
                    ends_at: new Date('2014-08-17 00:00'),
                },
            ])
        })

        it('edge case 1', async () => {
            const availabilities = await getAvailabilities(new Date('2014-08-10'))
            expect(availabilities.length).toBe(7)

            expect(String(availabilities[0].date)).toBe(
                String(new Date('2014-08-10')),
            )
            expect(availabilities[0].slots).toEqual([])

            expect(String(availabilities[1].date)).toBe(
                String(new Date('2014-08-11')),
            )
            expect(availabilities[1].slots).toEqual([])

            expect(String(availabilities[2].date)).toBe(
                String(new Date('2014-08-12')),
            )
            expect(availabilities[2].slots).toEqual([])

            expect(String(availabilities[3].date)).toBe(
                String(new Date('2014-08-13')),
            )
            expect(availabilities[3].slots).toEqual([])

            expect(String(availabilities[4].date)).toBe(
                String(new Date('2014-08-14')),
            )
            expect(availabilities[4].slots).toEqual([])

            expect(String(availabilities[5].date)).toBe(
                String(new Date('2014-08-15')),
            )
            expect(availabilities[5].slots).toEqual([])

            expect(String(availabilities[6].date)).toBe(
                String(new Date('2014-08-16')),
            )
            expect(availabilities[6].slots).toEqual([])
        })
    })

    describe('Complex case', () => {
        beforeEach(async () => {
            await knex('events').insert([
                {
                    kind: 'opening',
                    starts_at: new Date('2014-08-01 10:30'),
                    ends_at: new Date('2014-08-01 16:00'),
                    weekly_recurring: true,
                },
                {
                    kind: 'appointment',
                    starts_at: new Date('2014-08-15 14:00'),
                    ends_at: new Date('2014-08-15 16:00'),
                },
                {
                    kind: 'opening',
                    starts_at: new Date('2014-08-20 10:30'),
                    ends_at: new Date('2014-08-20 16:00'),
                    weekly_recurring: true,
                }
            ])
        })

        it('edge case 1', async () => {
            const availabilities = await getAvailabilities(new Date('2014-08-10'))
            expect(availabilities.length).toBe(7)

            expect(String(availabilities[0].date)).toBe(
                String(new Date('2014-08-10')),
            )
            expect(availabilities[0].slots).toEqual([])

            expect(String(availabilities[1].date)).toBe(
                String(new Date('2014-08-11')),
            )
            expect(availabilities[1].slots).toEqual([])

            expect(String(availabilities[2].date)).toBe(
                String(new Date('2014-08-12')),
            )
            expect(availabilities[2].slots).toEqual([])

            expect(String(availabilities[3].date)).toBe(
                String(new Date('2014-08-13')),
            )
            expect(availabilities[3].slots).toEqual([])

            expect(String(availabilities[4].date)).toBe(
                String(new Date('2014-08-14')),
            )
            expect(availabilities[4].slots).toEqual([])

            expect(String(availabilities[5].date)).toBe(
                String(new Date('2014-08-15')),
            )
            expect(availabilities[5].slots).toEqual([
                '10:30',
                '11:00',
                '11:30',
                '12:00',
                '12:30',
                '13:00',
                '13:30',
            ])

            expect(String(availabilities[6].date)).toBe(
                String(new Date('2014-08-16')),
            )
            expect(availabilities[6].slots).toEqual([])
        })
    })

    describe('Working from 23:30 to 00:30', () => {
        beforeEach(async () => {
            await knex('events').insert([
                {
                    kind: 'opening',
                    starts_at: new Date('2014-08-01 23:30'),
                    ends_at: new Date('2014-08-02 00:30'),
                    weekly_recurring: true,
                },
            ])
        })

        it('edge case 2', async () => {
            getAvailabilities(new Date('2014-08-10')).then().catch(error => {
                console.log(error)
                expect(error).not.toBeNull()
            })
        })
    })

    describe('Two appointments at the same time', () => {
        beforeEach(async () => {
            await knex('events').insert([
                {
                    kind: 'opening',
                    starts_at: new Date('2014-08-01 10:30'),
                    ends_at: new Date('2014-08-01 11:30'),
                    weekly_recurring: true,
                },
                {
                    kind: 'appointment',
                    starts_at: new Date('2014-08-15 10:30'),
                    ends_at: new Date('2014-08-15 11:00'),
                },
                {
                    kind: 'appointment',
                    starts_at: new Date('2014-08-15 10:30'),
                    ends_at: new Date('2014-08-15 11:30'),
                }
            ])
        })

        it('edge case 2', async () => {
            getAvailabilities(new Date('2014-08-10')).then().catch(error => {
                console.log(error)
                expect(error).not.toBeNull()
            })
        })
    })

    describe('Appointments with no opening', () => {
        beforeEach(async () => {
            await knex('events').insert([
                {
                    kind: 'appointment',
                    starts_at: new Date('2014-08-15 10:30'),
                    ends_at: new Date('2014-08-15 11:30'),
                }
            ])
        })

        it('edge case 2', async () => {
            getAvailabilities(new Date('2014-08-10')).then().catch(error => {
                console.log(error)
                expect(error).not.toBeNull()
            })
        })
    })

})
