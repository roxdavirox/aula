const CourseRepository = require('./../../repositories/CourseRepository')

module.exports = {
    find(req, res, next) {
        CourseRepository.find()
            .then(courses => res.json(courses))
            .catch(next)
    },

    create(req, res, next) {
        const course = { name } = req.body

        CourseRepository.create(course)
            .then(_course => res.status(201).json(_course))
            .catch(next)
    }
}