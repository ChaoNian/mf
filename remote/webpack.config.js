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
    devtool: 'eval-cheap-module-source-map', // 开发环境推荐 
    // devtool:false, // 借助插件
    entry: './src/index.js',
    output: {
        // 当我们把生成后的bundle.js 文件引入html的时候， 需要添加的前缀
        publicPath: 'http://localhost:3000/',
        clean: true, // 打包前是否自动清理打包目录，以避免产生垃圾文件
        // 指定异步加载的技术方案，当打包出的产物中包含异步加载的模块时，Webpack会根据vhunkLoading 属性的值
        // 来决定如何加载这些模块，可选的值有：false、jsonp、require
        /**
         * false：不使用异步加载，即将所有模块打包到一个文件中，这种方式的优点是简单易用，缺点是可能会导致打包文件过大，影响页面加载速度
         * jsonp：使用JSONP 技术实现异步加载，Webpack会将异步模块打包成单独的文件，并通过JSONP方式在页面中动态加载，
         * 这种方式的优点：可以将异步模块分离出来，减少主包的大小，缺点：是需要在服务端配置JSONP回调函数，可能存在跨域问题
         * require： 使用require.ensure 实现异步加载，类似于JSONP方式，Webpack会将异步模块打包成单独的文件，但是加载方式不同，
         * 这种方式优点是与 CommonJS 规范兼容，可以在Node.js中使用，缺点是使用不方便
         */
        chunkLoading: 'jsonp', 
        // path: path.resolve('dist') // 指定打包后存放的的本地路径
        // contentBase 以前是指静态文件根目录，现在已经废弃，改为statc
    },
    devServer: {
        port: 3000,
        static: path.resolve('./assets')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-react',
                                    {
                                        // https://babeljs.io/docs/babel-preset#both-runtimes
                                        // 如果想引用React classis， 如果不想引入可以使用automatic
                                        'funtime': 'automatic'
                                    }

                                ],
                                
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
        // new webpack.SourceMapDevToolPlugin({
        //     filename: '[file].map[query]', // 文件名 query 是查询参数
        //     // append: '\n//# sourceMappingURL=http://127.0.0.1:8081/[url]' // 在构建文末尾处生成 url 是文件地址
        //     append: false //在main 文件末尾里不会生成url
        // }),
        // 当发布测试环境时，会将dist文件发布，但是不想将map文件发布环境，可以配置一下代码，将map文件复制到指定文件，删除dist 文件下的目录；
        // new FileManagerWebpackPlugin({
        //     events: {
        //         onEnd: {// 构建结束后
        //             copy: [
        //                 {
        //                     source: './dist/*.map', // 拷贝的源文件
        //                     destination: path.resolve('./sourcemaps') // 复制到指定文件目录
        //                 }
        //             ],
        //             delete: ['./dist/*.map'] // 删除dist文件下 map文件

        //         }
        //     }
        // })
        new ModuleFederationPlugin({
            filename: 'remoteEntry.js',// 远程的文件名
            name: 'remote', // 远程的名称
            exposes: { // 要向外暴露那些组件
                './NewsList': './src/NewsList', // 在host 文件里使用方式 remote/NewsList'
                './click': './src/click' 
            },
            shared: {

            }
        })

    ]
}