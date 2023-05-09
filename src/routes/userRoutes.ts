import { Router } from "express";
const router = Router();

router.post('/', (req, res) => {
    res.status(501).json({error: 'User not implemented'})

})

router.get('/', (req, res) => {
    console.log('User not implemented')

})

router.get('/:id', (req, res) => {
    const {id} = req.params
    res.status(501).json({error: `User not implemented ${id}`})
})

router.put('/:id', (req, res) => {
    const {id} = req.params
    res.status(501).json({error: `User not implemented ${id}`})
})

router.delete('/:id', (req, res) => {
    const {id} = req.params
    res.status(501).json({error: `User not implemented ${id}`})
})


export default router;

