const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

module.exports = (env, argv) => ({
  devtool: 'cheap-module-source-map',

  entry: './src/App.js',

  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js', // 指定分离出来的代码文件的名称
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/' // 解释： https://juejin.im/post/5ae9ae5e518825672f19b094
  },

  devServer: {
    hot: true,
    publicPath: '/',
    proxy: {
      '/api': {
        target: "http://10.0.0.130:8555", // 将 URL 中带有 /api 的请求代理到本地的 3000 端口的服务上
        compress: true,
        pathRewrite: {'^/api': ''}, // 把 URL 中 path 部分的 `api` 移除掉
      },
    }
  },

  module: {
    rules: [
      {
        test: /\.(post)?css$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true, // 使用css modules
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /.*\.(gif|png|jpe?g|svg|webp)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name].[hash:7].[ext]',
              outputPath: 'images'
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`,
      title: 'my App',
      template: path.resolve(__dirname, 'src/assets/template/index.html')
    }),
    new webpack.NamedModulesPlugin(), // 用于启动 HMR 时可以显示模块的相对路径
    new webpack.HotModuleReplacementPlugin(), // Hot Module Replacement 的插件
    new OpenBrowserPlugin({url: 'http://localhost:8080/'})
  ],

  // 优化部分
  optimization: {
    minimize: false,

    // 提取公共模块
    splitChunks: {
      chunks: 'all', // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
      cacheGroups: {
        // js提取
        reactBase: {
          name: 'reactBase',
          test: (module) => {
            return /react|redux|prop-types/.test(module.context);
          },
          chunks: 'initial',
          priority: 10,
        },
        common: {
          name: 'common',
          chunks: 'initial',
          priority: 2,
          minChunks: 2,
        },
        // css 提取
        styles: {
          name: 'styles',
          test: /\.(post)?css$/,
          chunks: 'all',
          enforce: true,
          priority: 20,
        }
      }
    }
  },

  // 处理解析
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'), // 使用绝对路径指定 node_modules，不做过多查询
    ],

    // 删除不必要的后缀自动补全，少了文件后缀的自动匹配，即减少了文件路径查询的工作
    // 其他文件可以在编码时指定后缀，如 import('./index.scss')
    extensions: ['.js'],

    // 避免新增默认文件，编码时使用详细的文件路径，代码会更容易解读，也有益于提高构建速度 （默认就是index）
    mainFiles: ['index'],

    // 默认路径 方便管理路径
    alias: {
      Component: path.resolve(__dirname, 'src/component/'),
      Page: path.resolve(__dirname, 'src/page/')
    }
  }
})