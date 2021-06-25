var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
const Device = mongoose.model('Device');
const User = mongoose.model('User');
const Pkg = mongoose.model('Pkg');
router.get('/number', async function (req, res, next) {
    const token = req.get("Authorization");
    if (token) {
        const udoc = await User.findOne({ email: token }).exec();
        if (udoc) {
            const uid = udoc._id;
            const ds = await Device.find({ owner: uid }).exec();
            const nd = ds.length;
            let np = 0;
            let ndata = 0;
            for (const device of ds) {
                np += device.packages.length;
                ndata += device.data;
            }
            res.status(200);
            res.json([ nd, np, ndata ]);
        }
        else {
            res.status(401);
            res.json({ message: "获取用户信息失败" });
        }
    }
    else {
        res.status(401);
        res.json({ message: "获取token信息失败" });
    }

});
module.exports = router;