function checkBadgeFromGroupMembers(groupmembers) {
    const badgeMap = {
        10 : '67e408d302cd398c11be687e',
        50 : '67e408dd02cd398c11be687f',
        100 : '67e408e502cd398c11be6880'
    };
    return badgeMap[strkcnt] || null;  // Return badge ID if exists, else null
}

module.exports = checkBadgeFromGroupMembers;