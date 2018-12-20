const _devroot = __dirname + "/src/";// __dirname代表项目的根目录
const gulp = require("gulp");// 引入gulp
const del = require("del");// 删除文件或文件夹的插件
const rename = require("gulp-rename");// 文件重命名的插件
const uglify = require("gulp-uglify");// js文件的压缩
const minify_html = require("gulp-htmlmin");// html文件的压缩
const minify_css = require("gulp-minify-css");// css文件的压缩
const imagesmin = require("gulp-imagemin");// 图片的压缩
const connect = require("gulp-connect");// 实现自动刷新的插件
const sass = require("gulp-sass");// 实现编译sass的插件
const babel = require("gulp-babel");// 实现es6语法转es5语法的插件，需要安装babel-preset-env和babel-core，并在项目根目录创建.babelrc文件内容为{"presets": ["env"]}；需要注意的是该插件编译不了所有的es6语法，比如说new Promise。
const rev = require("gulp-rev");//为静态文件随机添加一串hash值
const revCollector = require("gulp-rev-collector");// 根据rev生成的manifest.json文件中的映射, 去替换文件名称, 也可以替换路径
const gulpSequence = require('gulp-sequence');// 顺序执行gulp中任务的插件
const autoprefixer = require("gulp-autoprefixer");// 自动补充css的前缀

// 自动补充css前缀
gulp.task("autoprefixer",function () {
    return(
        gulp.src(__dirname + "/dist/**/*.css")
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'Android >= 4.0'],
                cascade: true, //是否美化属性值 默认：true 像这样：
                //-webkit-transform: rotate(45deg);
                //        transform: rotate(45deg);
                remove:true //是否去掉不必要的前缀 默认：true
            }))
            .pipe(gulp.dest(__dirname + "/dist"))
    )
})

// 对开发环境中的静态图片，css，js等生成hash值
gulp.task("revimg",function () {
    return(
        gulp.src(_devroot + "images/*")
            .pipe(rev())// 给选择的图片文件添加hash后缀
            .pipe(imagesmin({
                optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
                interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
            }))// 压缩图片
            .pipe(gulp.dest(__dirname + "/dist/images"))// 移动到指定目录
            .pipe(rev.manifest())// 生成映射文件
            .pipe(gulp.dest(__dirname + "/rev/img"))//将映射文件导出到项目根目录下的rev/img
    )
})
gulp.task("revcss",function () {
    return(
        gulp.src(_devroot + "**/*.css")
            .pipe(rev())// 给选择的css文件添加hash后缀
            .pipe(minify_css())// 压缩css
            .pipe(gulp.dest(__dirname + "/dist"))// 移动到指定目录
            .pipe(rev.manifest())// 生成映射文件
            .pipe(gulp.dest(__dirname + "/rev/css"))//将映射文件导出到项目根目录下的rev/css
    )
})
gulp.task("revjs",function () {
    return (
        gulp.src(_devroot + "{js,libs}/**/*.js")
            .pipe(rev())// 给选择的js文件添加hash后缀
            .pipe(uglify())// 压缩js
            .pipe(gulp.dest(__dirname + "/dist"))// 移动到指定目录
            .pipe(rev.manifest())// 生成映射文件
            .pipe(gulp.dest(__dirname + "/rev/js"))//将映射文件导出到项目根目录下的rev/js
    )
})

// 将dist目录下的所有文件按照json进行替换
gulp.task("rev",function () {
    return(
        gulp.src([__dirname + '/rev/**/*.json', __dirname + '/dist/**'])
            .pipe(revCollector({
                replaceReved: true,//允许替换, 已经被替换过的文件
                /*dirReplacements: {
                    'css': '/dist/css',
                    'js': '/dist/js'
                }*/
            }))
            .pipe(gulp.dest(__dirname + "/dist"))
    )
})


// 删除发布环境的根目录和rev
gulp.task("clean",function () {
    return (
        del([__dirname + "/dist",__dirname + "/rev"])
    )
})
// 将所有的sass文件编译为css文件放在src/css文件中
gulp.task("sass",function () {
    return (
        gulp.src(_devroot + "**/*.scss")
            .pipe(sass())
            .pipe(gulp.dest(_devroot + "css"))
    )
})
//  定义livereload 任务，启动一个服务
gulp.task("server",function () {
    return (
        connect.server({
            root: _devroot,// 根目录
            port: 8000,// 端口号
            livereload:true// 自动刷新
        })
    )
})
// 定义刷新任务 src目录下的所有文件（包括子目录文件）发生改变进行刷新
gulp.task("reload",function () {
    return (
        gulp.src(_devroot+"**")
            .pipe(connect.reload())
    )
})
// 定义监听watch_reload任务 src目录下的所有文件（包括子目录文件）发生改变调用reload任务，文件保存时调用sass任务
gulp.task("watch_reload",function () {
    return(
        gulp.watch(_devroot+"**",["reload","sass"])
    )
})
// 定义监听任务
gulp.task("watch",["server","watch_reload"])
// 对所有的html文件进行压缩
gulp.task("minify_html",function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    }
    return (
        gulp.src(_devroot + "**/*.html")
            .pipe(minify_html(options))
            .pipe(gulp.dest(__dirname + "/dist"))
    )
})
// 该任务功能是是执行 sass、imgmin、minify_html、rev、rev_html等任务，gulpSequence:[]中是并行任务，()中是顺序执行的任务
gulp.task("start",gulpSequence("sass","minify_html","revimg","revcss","revjs","rev","autoprefixer"));
// 执行该任务命令 gulp或者gulp default，任务名必须是default保证输入命令窗口输入gulp时可以执行命令，该任务功能是执行start任务
gulp.task("default",["start"]);
/* 执行该任务命令 gulp es6
* 任务功能：将es6文件夹下面的js代码转为es5风格
*
gulp.task("es6",function () {
    return (
        gulp.src(_devroot + "es6/*.js")
            .pipe(babel())
            .pipe(gulp.dest(_devroot + "js"))
    )
})
*/
