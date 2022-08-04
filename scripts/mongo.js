import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const counter = mongoose.models.counter || mongoose.model('counter', CounterSchema);

const UserSchema = new mongoose.Schema({
  username: { type: String, index: true },
  displayName: { type: String, index: true },
  userId: { type: Number, index: true },
  image: { type: String, index: true },
  banned: { type: Boolean, index: true },

  color: { type: String, index: true, default: "#ffffff" },
  roles: { type: Array, index: true, default: [] },
  userRoles: { type: [mongoose.Schema.Types.ObjectId], index: true, default: [], ref: "Role" },
  files: {type: Array, index: true, default: [] }
})


const RoleSchema = new mongoose.Schema({
  name: { type: String, index: true },
  perm: { type: Number, index: true },
  color: { type: String, index: true },
  admin: { type: Boolean, index: true, default: false },
  desc: { type: String, index: true }
})

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

export const Role = mongoose.models.Role || mongoose.model("Role", RoleSchema)