function rewardfunc(dueDate, submissionDate, maxBonus = 10, decayRate = 0.02) {
    // this decayRate is assumed only under the assumption that difference between submissionDate and dueDate is not more than 3 months
    // Convert date strings to Date objects
    if(submissionDate>dueDate){
        return 0;
    }
    const dueDateObj = new Date(dueDate);
    const submissionDateObj = new Date(submissionDate);

    const timeDifference = dueDateObj - submissionDateObj;
    const daysToDueDate = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert ms to days
    // Exponential decay calculation
    const bonusPoints = maxBonus * Math.exp(decayRate * daysToDueDate);

    return Math.round(bonusPoints); 
}

//console.log(rewardfunc('2024-12-31', '2024-10-27'));
module.exports = rewardfunc;

// console.log(calculateExponentialEarlyBonus('2024-12-31', '2024-12-24'));
