declare let SystemJS: any

SystemJS.config({
    paths: {
        'reflect-metadata': '/node_modules/reflect-metadata/Reflect.js', 
        'lodash': '/node_modules/lodash/lodash.min.js'
    }, 
    packages: {
        build: {
            defaultExtension: 'js'
        }
    }
})
