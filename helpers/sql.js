const { BadRequestError } = require("../expressError");

//Helper for making selective update queries.

//The calling function can use it to make the SET clause of an SQL UPDATE statement.

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
    const keys = Object.keys(dataToUpdate);
    if (keys.length === 0) throw new BadRequestError("No data");

    //{email: 'aliya@gmail.com', firstname: 'Aliya'} => ['"email"=$1', '"firstname"=$2']
    const cols = keys.map(
        (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
    );

    return {
        setCols: cols.join(", "),
        values: Object.values(dataToUpdate),
    };
}

module.exports = { sqlForPartialUpdate };
