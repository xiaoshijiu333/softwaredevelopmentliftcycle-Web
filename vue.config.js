const path = require('path')
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave:false,
    // 配置svg
    chainWebpack: (config) => {
        config.resolve.alias.set('@images', resolve('./src/assets/images'));
        config.resolve.alias.set('@svg', resolve('./src/icons/svg'));
        config.module.rules.delete('svg'); // 重点:删除默认配置中处理svg,
        config.module
            .rule('svg-sprite-loader')
            .test(/\.svg$/)
            .include
            .add(resolve('src/icons/svg')) // 处理svg目录
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            });
    }
}