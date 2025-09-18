export const checkGreaterTimes = (time1, time2) => {
    if (time1 != '' && time2 != '') {
        let time3 = new Date(time1);
        let time4 = new Date(time2);
        const diffTime = Math.abs(time4 - time3);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays < 1095) {
            return true;
        }
    }
    return false;
}

export const checkGreaterStartEndTimes = (time1, time2) => {
    if (time1 != '' && time2 != '') {
        let time3 = new Date(time1);
        let time4 = new Date(time2);
        
        if (time3.getTime() < time4.getTime()) {
            return true;
        }
    }
    
    if(typeof time2 == 'undefined'){
        return true;
    }

    return false;
}

