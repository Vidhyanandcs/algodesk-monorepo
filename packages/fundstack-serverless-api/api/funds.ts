import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import {config as dotenvConfig} from 'dotenv';

dotenvConfig();

export default async (request: VercelRequest, response: VercelResponse) => {
    try {
        const {data} = await axios({
            method: 'post',
            url: process.env.MONGO_DB_URL,
            headers: {
                'api-key': process.env.MONGO_API_KEY,
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*'
            },
            data: JSON.stringify({
                "dataSource": process.env.CLUSTER_NAME,
                "database": process.env.DB_NAME,
                "collection": "funds"
            })
        });
        response.status(200).send(data);
    }
    catch (e) {
        response.status(400).send(e);
    }
};