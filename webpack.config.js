const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 提出单独的css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 去除重复代码 压缩css
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 压缩js

module.exports = (env, argv) => ({
  entry: './src/App.jsx',

  output: {
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js', // 指定分离出来的代码文件的名称
    path: path.resolve(__dirname, 'dist'),
    publicPath: '' // 解释： https://juejin.im/post/5ae9ae5e518825672f19b094
  },

  module: {
    rules: [
      {
        test: /\.(post)?css$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
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
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true, // 是否禁用
              mozjpeg: { // 压缩 jpeg 的配置
                progressive: true,
                quality: 65
              },
              pngquant: { // 使用 imagemin-pngquant 压缩 png
                quality: '65-90',
                speed: 4
              },
              gifsicle: { // 压缩 gif 的配置
                interlaced: false,
              }
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
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].[id].css'
    }),
    new HtmlWebpackPlugin({
      filename: `index.html`,
      title: 'my App',
      template: path.resolve(__dirname, 'src/assets/template/index.html')
    })
  ],

  // 优化部分
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css\.*(?!.*map)/g,  //注意不要写成 /\.css$/g
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          discardComments: {removeAll: true},
          // 避免 cssnano 重新计算 z-index
          safe: true,
          // cssnano 集成了autoprefixer的功能
          // 会使用到autoprefixer进行无关前缀的清理
          // 关闭autoprefixer功能
          // 使用postcss的autoprefixer功能
          autoprefixer: false
        },
        canPrint: true
      }),
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        cache: true
      })
    ],

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
    extensions: ['.js', '.jsx'],

    // 避免新增默认文件，编码时使用详细的文件路径，代码会更容易解读，也有益于提高构建速度 （默认就是index）
    mainFiles: ['index']
  }
})
