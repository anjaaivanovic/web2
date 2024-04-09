const express = require("express")
const router = express.Router()
const Comment = require("../services/comment.service")

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Operations related to comments
 */

/**
 * @swagger
 * /comment:
 *   post:
 *     tags: [Comment]
 *     summary: Post a comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully saved the comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *       501:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 */

router.post("/", async (req, res) => {
    try{
        var result = await Comment.saveComment(req.body)
        if (result) res.send({result: result})
        else res.status(501).send()
    }
    catch (err) {
        console.log(err)
        res.status(501).send({err: err})
    }
})

/**
 * @swagger
 * /comment:
 *   delete:
 *     tags: [Comment]
 *     summary: Delete a comment
 *     parameters:
 *       - in: query
 *         name: commentId
 *         schema:
 *           type: string
 *         description: ID of the comment to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted th comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       501:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 */
router.delete("/", async (req, res) => {
    try{
        var succes = await Comment.deleteComment(req.query.commentId)
        res.send({success: succes})
    }
    catch (err){
        console.log(err)
        res.status(501).send({err: err})
    }
})

module.exports = router
