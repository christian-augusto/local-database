const axios = require('axios');
const qs = require('qs');
const fs = require('fs');

function buildTuple(person) {
    person.nome = person.nome.replace("'", "\\'");
    person.endereco = person.endereco.replace("'", "\\'");

    return `('${person.nome}','${person.cpf}','${person.endereco}','${person.celular}')`;
}

async function getPersons() {
    const apiSize = 30;

    const response = await axios({
        method: 'POST',
        url: 'https://www.4devs.com.br/ferramentas_online.php',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
            acao: 'gerar_pessoa',
            sexo: 'I',
            pontuacao: '5',
            idade: '18',
            cep_estado: '',
            txt_qtde: `${apiSize}`,
            cep_cidade: '',
        }),
        timeout: 10000, // 10 seg em ms
    });

    return response.data;
}

async function writeInserts(runningCache, promiseIndex) {
    console.log(`Iniciando promise ${promiseIndex}`);

    const head =
        'insert into test_1.tb_person (`name`,`cpf`,`address`,`telephone`)';

    fs.writeFileSync(runningCache.singleInsertsFilePath, '', 'utf8');
    fs.writeFileSync(
        runningCache.largeInsertFilePath,
        `${head} values `,
        'utf8'
    );

    while (runningCache.personsRetrieved < runningCache.target) {
        const persons = await getPersons();

        persons.forEach(function (person) {
            const personTuple = buildTuple(person);

            fs.appendFileSync(
                runningCache.singleInsertsFilePath,
                `${head} values ${personTuple};`,
                'utf8'
            );
            fs.appendFileSync(
                runningCache.largeInsertFilePath,
                `${personTuple},`,
                'utf8'
            );
        });

        runningCache.personsRetrieved += runningCache.responseLen;
    }

    console.log(`Finalizando promise ${promiseIndex}`);
}

async function main() {
    console.log('Iniciando');

    const runningCache = {
        personsRetrieved: 0,
        target: 10000,
        responseLen: 30,
        singleInsertsFilePath: './sql/single-inserts.sql',
        largeInsertFilePath: './sql/large-insert.sql',
    };

    const promises = [];

    for (let i = 0; i < 50; i++) {
        promises.push(writeInserts(runningCache, i));
    }

    await Promise.all(promises);

    console.log('Finalizando');
}

main();
