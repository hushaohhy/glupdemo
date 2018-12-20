# glupdemo
原生html5开发，使用gulp进行自动刷新开发项目和打包压缩发布项目。

一、gulp的安装
1、npm(cnpm) install gulp -g   全局安装gulp
2、新建项目gulpdemo
3、根目录下 npm init   新建package.json文件
4、根目录下 npm(cnpm) install gulp --save-dev   项目中安装gulp
5、根据需要安装必要的插件，详情见package.json文件内容
6、根目录下新建gulpfile.js文件(执行gulp命令的入口文件)。
7、编写gulpfile.js文件内容。
8、主要用到的gulp语法：
        ① gulp.src("文件路径") 将文件转为流
        ② gulp.pipe(code) 对流进行处理
        ③ gulp.dest("路径") 输出路径
        ④ gulp.task("taskname",["task1","task2"...],function(){}) 第二个和第三个参数为选填。

注意事项：有时候安装的插件的最新版本与gulp的版本并不兼容，可以适当的对插件或者gulp进行降版本。

二、package.json的一些配置说明
在scripts中自定义了两个命令(在命令行中输入)：
1、npm run dev       启动开发环境的服务(热更新，保存刷新)，实际执行的是gulp sass和gulp watch命令。
2、npm run build     打包为可发布的状态，执行的是gulp clean和gulp命令。

三、使用
1、npm(cnpm) install 安装package.json中的全部依赖
2、开发时：npm run dev
3、发布时：npm run build

四、说明
1、安装gulp前提（安装node.js和npm）
2、src目录开发环境，dist为打包之后的目录（用来发布代码）。
3、gulpfile.js中定义的每一项任务执行命令为：gulp "任务名"，例如：gulp sass就是执行定义的sass任务。
4、通配符的一些说明：
通配符**代表匹配当前目录下的文件及当前目录下的子目录及文件。
*.scss 匹配当前目录下所有以.scss结尾的文件
**/*.scss 匹配前目录及所有子目录下，所有以.scss结尾的文件
!not-me.scss不包含名为not-me.scss文件
*.+(scss|sass) 匹配当前目录下所有以.scss或者.sass结尾的文件
5、编译es6的插件有点问题，并不能编译Promise等语法。慎用
6、gulp-htmlmin插件，可以压缩html页面内部的css和js，需要注意不要在内部写sass语法。
7、es6用到的插件gulp-babel、babel-preset-env、babel-core需要在项目根目录下新增.babelrc文件并且文件内容为{"presets": ["env"]}。
8、解决项目部署后客户端本地存在缓存的问题用到了gulp-rev、gulp-rev-collector两个插件
      gulp-rev：为静态文件随机添加一串hash值
      gulp-rev-collector：根据rev生成的manifest.json文件中的映射, 去替换文件名称, 也可以替换路径
9、gulp-sequence是用来顺序执行gulp中任务的插件，每个任务必须有return
10、各项任务的含义：
①