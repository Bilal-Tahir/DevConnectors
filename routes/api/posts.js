const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');

// GET Route ( Private | token needed) for api/posts
// Get all posts
router.get('/', auth, async (req, res) => {
  try {
    // Sorting more recent one first
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET Route for Single Post ( Private | token needed) for api/posts/:id
// Get post by id
router.get('/:id', auth, async (req, res) => {
  try {
    // Sorting more recent one first
    const post = await Post.findById(req.params.id);

    if (!post) {
      // If we pass an ID that is not a valid objectID then catch part run
      // This part run if we enter a valid objectID but not associated with any post
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);

    //For Invalid ObjectID
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    res.status(500).send('Server Error');
  }
});

// POST Route ( Private | token needed) for api/posts
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Delete Route ( Private | token needed) for api/posts
// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    // Make Sure the user deleting the post is the user that is deleting the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User Not authorized' });
    }

    // post.remove has been deprecated
    // await post.remove();

    await Post.deleteOne({ _id: req.params.id });

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);

    //For Invalid ObjectID
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    res.status(500).send('Server Error');
  }
});

// PUT request api/posts/like/:id
// Private Route

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    // check if the post if already liked by user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);

    //For Invalid ObjectID
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    res.status(500).send('Server Error');
  }
});

// PUT request for post unlike api/posts/like/:id
// Private Route

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    // check if the post if already liked by user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not liked yet' });
    }

    //Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);

    //For Invalid ObjectID
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    res.status(500).send('Server Error');
  }
});

// Comment Route ( Private | token needed) for api/posts/comment/:id
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Comment Route | Delete ( Private | token needed) for api/posts/comment/:id/:comment_id
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: 'User not authorized to delete the comment' });
    }

    //Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
