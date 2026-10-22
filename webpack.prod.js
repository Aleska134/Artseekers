const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');
module.exports = merge(common, {
    mode: 'production',
    output: {
        publicPath: '/'
    },
    plugins: [
        // systemvars:true lets webpack read env vars from the system (e.g.
        // Heroku Config Vars) at build time — so the production bundle picks up
        // BACKEND_URL/BASENAME when Heroku rebuilds the frontend on deploy.
        // We intentionally drop `safe:true`: it required EVERY variable listed
        // in .env.example (including backend-only keys like DATABASE_URL and
        // treating empty values like BASENAME= as "missing"), which made the
        // frontend build fail even though it only needs BACKEND_URL/BASENAME.
        new Dotenv({
            systemvars: true
        })
    ]
});
