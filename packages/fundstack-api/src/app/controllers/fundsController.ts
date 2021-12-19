import Fund from '../schemas/fundSchema';
import {prepareError} from "../utils/errorUtils";


export function getFunds(req, res, next) {
    Fund.find({}, function (err, funds) {
        if (err){
            res.status(400).json(prepareError(err.message));
            return;
        }

        res.json(funds);
    });
}