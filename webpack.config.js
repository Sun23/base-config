const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 提出单独的css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 去除重复代码 压缩css
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => ({
  entry: {
    pageOne: './src/app.js',
  },

  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ''
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
            loader: MiniCssExtractPlugin.loader
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
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[name].[hash:7].[ext]'
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
        include: [path.resolve(__dirname, 'src')],
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
      chunkFilename: '[id].css'
    }),
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
    new HtmlWebpackPlugin({
      filename: `${env.target}.html`,
      title: 'my App',
      template: ''
    })
  ]
})