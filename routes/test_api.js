const express = require('express');
const router = express.Router();
const neo4j_calls = require('./../neo4j_calls/neo4j_api');
router.get('/', async function (req, res, next) {
    res.status(200).send("Root Response from :8080/test_api")
    return 700000;
})


//Api end point Get all nodes//
router.get('/neo4j_get', async function (req, res, next) {
    let result = await neo4j_calls.get_num_nodes();
    console.log("RESULT IS", result)
    res.status(200).send({ result })    //Can't send just a Number; encapsulate with {} or convert to String.     
    return { result };
})
//Api end point to create a user 
router.post('/neo4j_post', async function (req, res, next) {
    //Passing in "name" parameter in body of POST request
    let { name } = req.body;
    let string = await neo4j_calls.create_user(name);
    res.status(200).send("User named " + string + " created")
    return 700000;
    //res.status(200).send("test delete")
})

//Api end point to delete a node
router.delete('/neo4j_delete/:nodeId', async function (req, res, next) {
  const nodeId = req.params.nodeId; // Get the node ID from the request parameters
  let nodesDeleted;
  try {
    nodesDeleted = await neo4j_calls.deleteNode(nodeId);
    console.log(`Deleted ${nodesDeleted} node(s).`);
  } catch (error) {
    console.error('Error deleting node:', error);
    res.status(500).send({ error: 'Failed to delete node.' });
    return;
  }
  res.status(200).send({ nodesDeleted });
});
/*//Api end point to get all nodes by name
router.get('/neo4j_getnodename/:nodeName', async function (req, res, next) {
  const nodeName = req.params.nodeName;
  try {
    const result = await neo4j_calls.getNodeAndRelationsByName(nodeName);
    console.log("RESULT IS", result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error retrieving node and relationships:', error);
    res.status(500).json({ error: 'Failed to retrieve node and relationships.' });
  }
});*/
//Api end point to get all nodes by label
router.get('/neo4j_getlabel/:label', async function (req, res, next) {
  const label = req.params.label;
  try {
    const result = await neo4j_calls.getNodesByLabel(label);
    console.log("RESULT IS", result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error retrieving nodes:', error);
    res.status(500).json({ error: 'Failed to retrieve nodes.' });
  }
});




module.exports = router;