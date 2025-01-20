const path = require('path')
const webpack = require('webpack')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 构建之后做一些文件读写删除操作
const FileManagerWebpackPlugin = require('filemanager-webpack-plugin')
const { clear } = require('console')

module.exports = {
    mode: 'development',
    // devtool: 'cheap-module-source-map', // 包含es6 代码。
    // devtool: 'inline-source-map', // 内链url
    /**
     * source-map：生成映射文件，
     * cheap：不包含列信息，
     * module：包含有loader模块之间对应的sourceMap 
     * eval：因为在开发环境要频繁修改代码，频繁重新构建，所以需要缓存提升重新构建的速度
     */
    // devtool: 'eval-cheap-module-source-map', // 开发环境推荐 
    devtool:false, // 借助插件
    entry: './src/index.js',
    output: {
        // 当我们把生成后的bundle.js 文件引入html的时候， 需要添加的前缀
        publicPath: 'http://localhost:3000/',
        clean: true
    },
    devServer: {
        port:3000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-react',
                                '@babel/preset-env'
                            ]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            // html模版文件，构建后自动输出html文件到目录
            template: './src/index.html'
        }),
        // 通过插件，自己生成sourceMap
        // SourceMapDevToolPlugin 是一个内置插件，可以更加精细控制sourcemap的生成
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map[query]', // 文件名 query 是查询参数
            // append: '\n//# sourceMappingURL=http://127.0.0.1:8081/[url]' // 在构建文末尾处生成 url 是文件地址
            append: false //在main 文件末尾里不会生成url
        }),
        // 当发布测试环境时，会将dist文件发布，但是不想将map文件发布环境，可以配置一下代码，将map文件复制到指定文件，删除dist 文件下的目录；
        new FileManagerWebpackPlugin({
            events: {
                onEnd: {// 构建结束后
                    copy: [
                        {
                            source: './dist/*.map', // 拷贝的源文件
                            destination: path.resolve('./sourcemaps') // 复制到指定文件目录
                        }
                    ],
                    delete: ['./dist/*.map'] // 删除dist文件下 map文件

                }
            }
        })

    ]
}