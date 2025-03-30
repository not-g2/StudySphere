function checkBadgeFromSubmissions(submissionCount){
    const badgeMap = {
        1 : '67e408f702cd398c11be6881',
        5 : '67e408fe02cd398c11be6882',
        50 : '67e4090502cd398c11be6883',
        100 : '67e4090e02cd398c11be6884'
    } 

    return badgeMap[submissionCount] || null;
}

module.exports = checkBadgeFromSubmissions;