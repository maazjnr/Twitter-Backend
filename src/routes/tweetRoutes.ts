import { Router } from "express";
const router = Router();

//Creating tweet
router.post('/', (req, res) => {
    res.status(501).json({error: 'User not implemented'})
})

//List tweet
router.get('/', (req, res) => {
    console.log('User not implemented')
})

//get one tweets
router.get('/:id', (req, res) => {
    const {id} = req.params
    res.status(501).json({error: `User not implemented ${id}`})
})

//Update tweets
router.put('/:id', (req, res) => {
    const {id} = req.params
    res.status(501).json({error: `User not implemented ${id}`})
})

//Delete tweets
router.delete('/:id', (req, res) => {
    const {id} = req.params
    res.status(501).json({error: `User not implemented ${id}`})
})


export default router;

