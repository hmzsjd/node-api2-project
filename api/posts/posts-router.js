// implement your posts router here


const express = require('express')
const router = express.Router()
const Posts = require('./posts-model')

// GET ALL POSTS
router.get('/', (req, res) => {
  Posts.find()
    .then(post => {
      res.status(200).json(post)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: 'Error retrieving the posts',
      })
    })
})


// GET POST BY ID
router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
      .then(post => {
        if (post) {
            res.status(200).json(post)
          } else {
            res.status(404).json({ message: 'The post with the specified ID does not exist' })
          }
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          message: 'The post information could not be retrieved',
        })
      })
  })


// CREATE NEW POST
router.post('/', (req, res) => {
    const {title, contents} = req.body;

    if (!title || !contents) {
        res.status(400).json({ message: 'Please provide title and contents for the post' })
      } else {
        Posts.insert({title, contents})
        .then(newPost => {
            return Posts.findById(newPost.id)
        })
        .then(newP => {
            res.status(201).json(newP)
        })
        .catch(err => {
            res.status(500).json({
                message: 'There was an error while saving the post to the database',
                err: err.message
              })
            
        })
      }
     
  })



// UPDATE POST BY ID

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { title, contents } = req.body


        if (!title || !contents) {
        res.status(400).json({ message: 'Please provide title and contents for the post' })
      } else {
        Posts.update(id, {title, contents})
        .then(next => {
            if (next !== 1) {
                res.status(404).json({ message: 'The post with the specified ID does not exist' })
            }
            return Posts.findById(id)
        })
        .then(updatedP => {
            res.status(201).json(updatedP)
        })
        .catch(err => {
            res.status(500).json({
                message: 'The post information could not be modified',
                err: err.message
              })
            
        })
      }
    
  })



  

module.exports = router

