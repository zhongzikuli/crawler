var https = require('https');
var fs = require('fs');
var baseUrl = "https://ssl-meta.che300.com/meta/model/model_series";
var count = 1;
var limit = 50000;

start(count);

function start(num) {
    https.get(baseUrl + num + '.json', function (res) {
        res.setEncoding('utf-8');// 设置编码
        var model = '';
        var modelArr = [];
        res.on('data', function (chunk) {
            model += chunk;
        });
        res.on('end', function () {
            if (model) {
                model = JSON.parse(model);
                if (Object.prototype.toString.call(model) === '[object Array]') {
                    model.forEach(function (item) {
                        if (item.model_name) {
                            modelArr.push(item.model_name)
                        }
                    });
                    model = JSON.stringify(modelArr);
                    fs.appendFile('model.txt', model, function (err) {
                        if (err) {
                            console.log('出现错误!')
                        } else {
                            console.log('第"' + num + '"页数据写入成功!');
                            continueFn(num)
                        }
                    })
                } else {
                    console.log('第"' + num + '"页数据出错了!');
                    continueFn(num)
                }
            }else{
                console.log('第"' + num + '"页空白数据!');
                continueFn(num)
            }
        })
    }).on('error', function () {
        console.log('第"' + num + '"页网络请求出错了!');
        continueFn(num)
    })
}

function continueFn(num) {
    if (num && (num < limit)) {
        num++;
        start(num)
    }
}