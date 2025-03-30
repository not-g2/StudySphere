function checkBadgeFromLevel(level){
    const badgeMap = {
        1 : '67e409a102cd398c11be688c',
        5 : '67e409a802cd398c11be688d',
        10 : '67e409b102cd398c11be688e',
        20 : '67e409be02cd398c11be688f',
        50 : '67e409d402cd398c11be6890',
        100 : '67e409f202cd398c11be6891'
    }
    return badgeMap[level] || null;
}

module.exports = checkBadgeFromLevel;