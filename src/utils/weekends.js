const moment = require('moment')

const holidays = [{
    date: '2018-01-01',
    meta: {
      title: 'New Year\'s Day'
    }
  }, {
    date: '2018-01-15',
    meta: {
      title: 'Birthday of Martin Luther King, Jr.'
    }
  }, {
    date: '2018-02-19',
    meta: {
      title: 'Washington\'s Birthday'
    }
  }, {
    date: '2018-05-05',
    meta: {
      title: 'Cinco de Mayo'
    }
  }, {
    date: '2018-05-28',
    meta: {
      title: 'Memorial Day'
    }
  }, {
    date: '2018-07-04',
    meta: {
      title: 'Independence Day'
    }
  }, {
    date: '2018-09-03',
    meta: {
      title: 'Labor Day'
    }
  }, {
    date: '2018-10-08',
    meta: {
      title: 'Columbus Day'
    }
  }, {
    date: '2018-11-12',
    meta: {
      titile: 'Veterans Day'
    }
  }, {
    date: '2018-11-22',
    meta: {
      title: 'Thanksgiving Day'
    }
  }, {
    date: '2018-12-25',
    meta: {
      title: 'Christmas Day'
    }
  }
]

const getRangeOfDates = (start, end, key, arr = [start.startOf(key)]) => {
  if (start.isAfter(end)) throw new Error('start must precede end')
  
  const next = moment(start).add(1, key).startOf(key)
  
  if (next.isAfter(end, key)) return arr

  return getRangeOfDates(next, end, key, arr.concat(next))
}

const buildWeekends = (startDate, endDate, holidays = [], format = 'YYYY-MM-DD') => {
  const days = getRangeOfDates(startDate, endDate, 'days')

  const holidaysAsMoment = holidays.map(holiday => moment(holiday.date))

  const weekends = []

  let weekend = Object.assign({}, {
    startDate: moment().format(format),
    endDate: 'XXXX-XX-XX',
    meta: {
      title: ''
    }
  })

  days.forEach(day => {
    let dayStart = 5

    let dayEnd = 0

    const isAHoliday = holidaysAsMoment.some(holiday => holiday.format(format) === day.format(format))

    const nextDayIsAHoliday = holidaysAsMoment.some(holiday => holiday.format(format) === moment(day).add(1, 'days').format(format))

    if (day.day() === dayStart && isAHoliday) {
      weekend.startDate = moment(day).subtract(1, 'days').format(format)
    } else if (day.day() === dayStart) {
      weekend.startDate = day.format(format)
    }

    if (day.day() === dayEnd && nextDayIsAHoliday) {
      weekend.endDate = moment(day).add(1, 'days').format(format)

      weekends.push(weekend)

      weekend = Object.assign({}, {
        startDate: moment().format(format),
        endDate: 'XXXX-XX-XX',
        meta: {
          title: ''
        }
      })
    } else if (day.day() === dayEnd) {
      weekend.endDate = day.format(format)

      weekends.push(weekend)

      weekend = Object.assign({}, {
        startDate: moment().format(format),
        endDate: 'XXXX-XX-XX',
        meta: {
          title: ''
        }
      })
    }
  })

  return weekends
}

module.exports = (startDate, endDate) => buildWeekends(startDate, endDate, holidays)
