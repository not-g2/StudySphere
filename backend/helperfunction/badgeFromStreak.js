function checkBadgeFromStreak(strkcnt) {
    const badgeMap = {
        10: '67e4086302cd398c11be6876',
        30: '67e4087102cd398c11be6877',
        100: '67e4087802cd398c11be6878',
        365: '67e4088202cd398c11be6879',
        1000: '67e4088a02cd398c11be687a'
    };
    return badgeMap[strkcnt] || null;  // Return badge ID if exists, else null
}

module.exports = checkBadgeFromStreak;