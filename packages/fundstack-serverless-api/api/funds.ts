import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default (request: VercelRequest, response: VercelResponse) => {
    const data = JSON.stringify({
        "collection": "funds",
        "database": "fundstack",
        "dataSource": "dappstack"
    });

    const config = {
        method: 'post',
        url: 'https://data.mongodb-api.com/app/data-kgdxf/endpoint/data/beta/action/find',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': 'vmZt9AnyDatza1tqUDtssw3fCgR4A65KTNOpu6QUuaFCYoi3KRz1BCw0Z87PZHLy'
        },
        data : data
    };

    // @ts-ignore
    axios(config)
        .then(function ({data}) {
            response.status(200).send(data);
        })
        .catch(function (error) {
            response.status(400).send(error);
        });
};