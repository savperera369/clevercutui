import mongoose, { Schema } from 'mongoose';

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const pointSchema = new Schema({
    x: {
        type: Number,
        required: true,
    },
    y: {
        type: Number,
        required: true,
    },
    z: {
        type: Number,
        required: true,
    }
});

const meshSchema = new Schema(
    {
        name: String,
        points: [pointSchema],
    },
    {
        timestamps: true
    }
);

const Mesh = mongoose.models.Mesh || mongoose.model('Mesh', meshSchema);
export default Mesh;