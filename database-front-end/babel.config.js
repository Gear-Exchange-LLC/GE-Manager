module.exports = function(api) {
    api.cache.never();
    return {
        plugins: ['macros']
     };
};