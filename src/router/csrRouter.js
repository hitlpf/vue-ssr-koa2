
const fs = require('fs');
const path = require('path');

class csrRouter {
    init(router){
        // 在服务端，将前端可能的所有路由，都走index.html的渲染，html到前端时，前端vue会处理这个路由
        router.get(/\/index|\/foo|\/bar/, (ctx, next) => {
            let html = fs.readFileSync(path.resolve(__dirname, '../../dist/index.html'), 'utf-8');
            ctx.type = 'html';
            ctx.status = 200;
            ctx.body = html;
        });
    }
}
module.exports = new csrRouter();