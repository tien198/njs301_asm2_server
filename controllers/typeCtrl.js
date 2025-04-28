import Type from '../models/mogooseModels/Type.js';

export function getTypes(req, res) {
    Type.find()
        .then(types => res.status(200).json(types))
        .catch(err => {
            error(err)
            res.status(500).json({ error: err });
        })
}

export default { getTypes }