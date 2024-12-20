import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {type:String,required:true,unique:true},
  password: {type:String,required:true}
});

const contentTypes = ['youtube', 'twitter', 'documents','links'];

const contentSchema = new mongoose.Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  description:{type:String},
  title: { type: String, required: true },
  tags: [{ type:  mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const tagSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true }
  });


  const linkSchema = new mongoose.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,unique:true},
  });

export const User = mongoose.model('User', userSchema);
export const Content = mongoose.model('Content', contentSchema);
export const Tag = mongoose.model('Tag', tagSchema);
export const Link = mongoose.model('Link', linkSchema);

