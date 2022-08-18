import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, index: true },
    displayName: { type: String, index: true },
    userId: { type: Number, index: true },
    image: { type: String, index: true },
    banned: { type: Boolean, index: true },
    spaceUsed: { type: Number, index: true },
    moderator: { type: Boolean, index: true },
    count: { type: Number, index: true },

    color: { type: String, index: true, default: "#ffffff" },
    roles: { type: Array, index: true, default: [] },
    userRoles: { type: [mongoose.Schema.Types.ObjectId], index: true, default: [], ref: "Role" },
    files: { type: Array, index: true, default: [] }
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

mongoose.connection.useDb('Users');

// delete mongoose.connection.models['User'];
// delete mongoose.connection.models['Role'];

export const User = mongoose.models.User || mongoose.model("User", UserSchema); // mongoose.models.User || 


export const Role = mongoose.models.Role || mongoose.model("Role", RoleSchema) // mongoose.models.Role || 