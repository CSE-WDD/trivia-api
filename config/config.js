const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default: {
        SECRET: 'mysecretkey',
        DATABASE: 'mongodb+srv://matthewrapp:GK2uY8VGgnCKYKwf@cluster0.hw43b.mongodb.net/auth'
    }
}

exports.get = function get(env) {
    return config[env] || config.default
}