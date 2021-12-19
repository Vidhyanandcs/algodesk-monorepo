import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FundSchema = new Schema({
    app_id: {
        type: Number,
        required: true,
        unique: true
    },
    asset_id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
});

const Fund = mongoose.model('Fund', FundSchema);

export default Fund;