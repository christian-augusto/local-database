const mysql = require('mysql');

module.exports = function (query) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'x0r7ICkAAU2j0oHancK2fJ6lp4hoLWN1SH6M1q3VWLI7Ixyo24',
            database: 'test_1',
        });

        connection.connect(function (error) {
            if (error) {
                console.log(`Error in connect mysql, ${error}`);

                connection.end();
                reject(error);

                return;
            }

            const queryStart = new Date();

            connection.query(query, function (err, results) {
                const queryEnd = new Date();
                const secondsDiff = (queryEnd - queryStart) / 1000;

                console.log(`Query execution time ${secondsDiff}sec`);

                if (err) {
                    console.log(err);
                    connection.end();
                    reject(err);
                    return;
                }

                connection.end();

                resolve(results);
            });
        });
    });
};
