const timeFunctions = {
    convertEmployeeDatesToMMDDYYYY(employee) {
        const valuesToFromat = ['dateofbirth', 'dateofemployment'];
        for (let date of valuesToFromat) {
            employee[date] = new Date(employee[date]);
            let day = employee[date].getDate();
            console.log('day',day)
            if (day.toString().length === 1) {
                console.log('day add 0', day.length)
                day = `0${day}`;
            }
            let month = employee[date].getMonth()+1;
            if (month.toString().length === 1) {
                month = `0${month}`;
            }
            const year = employee[date].getFullYear();

            const formattedDate = `${day}/${month}/${year}`;

            employee[date] = formattedDate;
        }
    }
}

// Fri, 01 Jan 2010 07:00:00 GMT

module.exports = {
    timeFunctions
}