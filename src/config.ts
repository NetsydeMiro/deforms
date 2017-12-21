declare let SystemJS: any

SystemJS.config({
    paths: {
        'reflect-metadata': '/node_modules/reflect-metadata/Reflect.js'
    }, 
    packages: {
        build: {
            defaultExtension: 'js'
        }
    }
})
