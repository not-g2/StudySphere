function checkBadgeFromPomodoroTime(totalTimeSpent){
    const badgeId = {
        1500 : '67e4096902cd398c11be6888',//25 minutes in seconds
        10800 : '67e4098302cd398c11be6889',//3 hours in seconds
        86400 : '67e4098a02cd398c11be688a',//24 hours in seconds
        604800 : '67e4099302cd398c11be688b',// 7 days in seconds
    }

    return badgeId[totalTimeSpent] || null;
}

module.exports = checkBadgeFromPomodoroTime;