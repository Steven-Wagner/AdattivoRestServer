const timeFunctions = {
    convertEmployeeDatesToMMDDYYYY(employee) {
        //Accepts an employee object with keys ['dateofbirth', 'dateofemployment'] and converts thier date values to MM/DD/YYYY format
        const valuesToFromat = ['dateofbirth', 'dateofemployment'];
        for (let date of valuesToFromat) {
            employee[date] = new Date(employee[date]);
            let day = employee[date].getDate();
            if (day.toString().length === 1) {
                day = `0${day}`;
            }
            let month = employee[date].getMonth()+1;
            if (month.toString().length === 1) {
                month = `0${month}`;
            }
            const year = employee[date].getFullYear();

            const formattedDate = `${month}/${day}/${year}`;

            //Employee object now has dates in MM/DD/YYYY format
            employee[date] = formattedDate;
        }
    },
}

module.exports = {
    timeFunctions
}