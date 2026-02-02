    import mongoose from "mongoose";

    const gameSchema = new mongoose.Schema({
        id: { type: String, required: true , unique:true },
        title: { type: String },
        description: String,
        instructions: String,
        url: String,
        image: String,
        categoryId: { type: String, required: true ,index:true },
        tags: String,
        thumb: String,
        width: String,
        height: String,
        Popularity:String,
        gameControls:[{ key: String, action: String }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    }, {
        timestamps: true,
        versionKey: false
    });

    gameSchema.index({ categoryId: 1, createdAt: -1 });
    export default mongoose.model("Game", gameSchema);

