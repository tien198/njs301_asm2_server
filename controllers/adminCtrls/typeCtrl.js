import Type from '../../models/mogooseModels/Type.js';

export function getTypeNames(req, res) {
    Type.find().select('name').lean()
        .then(types => res.status(200).json(types))
        .catch(err => {
            next(err)
        })
}

export default { getTypeNames }