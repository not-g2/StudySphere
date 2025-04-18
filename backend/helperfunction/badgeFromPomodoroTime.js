function checkBadgeFromPomodoroTime(totalTimeSpent){
    const badgeId = {
        1500 : '67e4096902cd398c11be6888',//25 minutes in seconds
        10800 : '67e4098302cd398c11be6889',//3 hours in seconds
        86400 : '67e4098a02cd398c11be688a',//24 hours in seconds
        604800 : '67e4099302cd398c11be688b',// 7 days in seconds
    }

    // apply binary search on the time spent to find the correct time (O(logN))
    let arr = [1500,10800,86400,604800];

    // if the user has not used the pomodoro enough
    if(totalTimeSpent<arr[0]){
        return null;
    }
    // if user has spent more time than needed for the max badge , 
    if(totalTimeSpent>arr[arr.length-1]){
        return badgeId[arr[arr.length-1]];
    }
    let left = 0 , right = arr.length;
    while(left<right){
        let mid = Math.floor((left+right)/2);
        if(arr[mid]<=totalTimeSpent){
            left = mid+1;
        }
        else{
            right = mid;
        }
    }
    left--;

    if (left === arr.length) left = arr.length - 1;
    return badgeId[arr[left]];
}

// testing the function
// console.log(checkBadgeFromPomodoroTime(86400));
// console.log(checkBadgeFromPomodoroTime(200));
// console.log(checkBadgeFromPomodoroTime(604686799));
module.exports = checkBadgeFromPomodoroTime;