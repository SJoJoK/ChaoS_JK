const _ = require('./config/mongoose.js');
const db = _();
const mongoose = require('mongoose');
const Auth = mongoose.model('Auth');
const Device = mongoose.model('Device');
const User = mongoose.model('User');
const Pkg = mongoose.model('Pkg');
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle)
const moment = require('moment');
const { mqtt } = require('../.config.js')
server.listen(mqtt.port, function () {
    console.log('server started and listening on port ', mqtt.port)
})
//信息验证
aedes.authenticate = function (client, username, password, callback) {
    Auth.findOne({ username, password },
        function (err, doc) {
            if (err) return console.error(err);
            if (doc)//存在该用户名与密码
            {
                callback(null,true)
            }
            else
            {
                callback(null, false)
            }
        });
}
//客户端连接
aedes.on('clientReady', (client)=>{
    console.log('Client Connected: ' + (client ? client.id : client));
    const tmpArr = client.id.split('-');
    const username = tmpArr[0];
    const udid = tmpArr[tmpArr.length - 1];
    User.findOne({name:username}, function (err, user) {
        const uid = user._id;
        Device.updateOne(
            {
                owner: uid,
                id: parseInt(udid)
            },
            {
                online: true
            }
        ).exec();
    })
});

// 客户端断开
aedes.on('clientDisconnect', (client)=>{
    console.log('Client Disconnected: ' + (client ? client.id : client));
    [username, udid] = client.id.split('-');
    User.findOne({ name: username }, function (err, user) {
        const uid = user._id;
        Device.updateOne({owner: uid,id: parseInt(udid)},{online: false}).exec();
    })
});

// 有消息发布
aedes.on('publish', (packet, client) => {
    console.log(packet.payload + '', client ? client.id : 'internal');
    //进行数据持久化
    if (client)
    {
        [username, udid] = client.id.split('-');
        User.findOne({ name: username }, function (err, user) {
            const uid = user._id;
            Device.findOne({ id: parseInt(udid), owner: uid, }, function (err, d) {
                const payload = JSON.parse(packet.payload+'');
                const did = d._id;
                const NEW_Pkg = new Pkg({
                    owner:uid,
                    sender: did,
                    topic: packet.topic,
                    payload
                })
                NEW_Pkg.save();
                d.time = moment();
                console.log(d.time);
                d.markModified('time');
                const NEW_Pos = { type: 'Point', coordinates: payload.location };
                d.location.push(NEW_Pos);
                d.location = d.location.slice(-10);
                d.packages.push(NEW_Pkg);
                d.warning.push(payload.warning);
                d.warning = d.warning.slice(-10);
                d.data += packet.payload.length;
                d.save();
            })
        })
    }
})

