const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/iot', { useNewUrlParser: true, useUnifiedTopology: true, keepAlive:120});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

//验证信息
const authSchema = new mongoose.Schema({
  account: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
});

//用户信息
const userSchema = new mongoose.Schema({
  name : String,
  email: {
    type: String,
    unique: true
  },
  role: String,
  devices: [{ type: Schema.Types.ObjectId, ref: 'Device' }]
}
)

//地理坐标
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

//设备信息
const deviceSchema = new mongoose.Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
  online: Boolean,
  packages: [{ type: Schema.Types.ObjectId, ref: 'Pkg' }],
  location: [pointSchema]
});

//MQTT包信息
const PkgSchema = new mongoose.Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'Device' },
  payload: {}
});

userSchema.methods.generateToken = function () {
  return this.email;
}

const Auth = mongoose.model('Auth', authSchema);

const User = mongoose.model('User', userSchema);

const Device = mongoose.model('Device', deviceSchema);

const Pkg = mongoose.model('Pkg', PkgSchema);

