let neo4j = require('neo4j-driver');
let { creds } = require("./../config/credentials");
let driver = neo4j.driver("neo4j://localhost:11003", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));
//Get all number of nodes//
/*exports.get_num_nodes = async function () {
  let session = driver.session();
  const result = await session.run('MATCH (n) RETURN n', {
  });
  session.close();
  const nodes = result.records.map((record) => record.get(0));
  console.log("Nodes:", nodes);
  return nodes;
};*/
exports.get_num_nodes = async function () {
  let session = driver.session();
  const result = await session.run(
    'MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m'
  );
  session.close();
  
  const nodes = result.records.map((record) => {
    const node = record.get('n');
    const relationship = record.get('r');
    const connectedNode = record.get('m');
    return { node, relationship, connectedNode };
  });

  console.log("Nodes and Relationships:", nodes);
  return nodes;
};

exports.addNewNode = async function (label, properties) {
  let session = driver.session();
  console.log ("Labels from api",label)
  console.log("properties from api",properties)
  const result = await session.run('CREATE (n:' + label + ' $props) RETURN n',
    { props: properties });
  session.close();
  const newNode = result.records[0].get('n').properties; return newNode;
};


// Define a method to update node properties
exports.updateNodeProperties =async function updateNodeProperties(nodeId, updatedProperties) {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (n) WHERE ID(n) = toInteger($nodeId) SET n += $updatedProperties RETURN n`,
      { nodeId, updatedProperties }
    );
    return result.records[0].get('n').properties;
  } finally {
    session.close();
  }
}

//Create a user//
exports.create_user = async function (name) {
  let session = driver.session();
  let user = "No User Was Created";
  try {
    user = await session.run('MERGE (n:user {name: $id}) RETURN n', {
      id: name
    });
  }
  catch (err) {
    console.error(err);
    return user;
  }
  return user.records[0].get(0).properties.name;
}
//Delete a node//
exports.deleteNode = async function (nodeId) {
  let session = driver.session();
  const result = await session.run('MATCH (n) WHERE ID(n) = $nodeId DELETE n', { nodeId: neo4j.int(nodeId) });
  session.close();

  console.log(`Deleted ${result.summary.counters.nodesDeleted()} node(s).`);
  return result.summary.counters.nodesDeleted();
};
//Get all nodes by name//
exports.getNodeAndRelationsByName = async function (nodeName) {
  let session = driver.session();
  const result = await session.run(
    'MATCH (n {Name: $nodeName})-[r]-(relatedNode) RETURN n, r, relatedNode',
    { nodeName }
  );
  session.close();
  const nodes = [];
  const relationships = [];
  result.records.forEach((record) => {
    const node = record.get('n').properties;
    const relation = record.get('r').properties;
    const relatedNode = record.get('relatedNode').properties;
    nodes.push(node);
    relationships.push({ relation, relatedNode });
  });
  return { nodes, relationships };
};
//Get all nodes by label//
exports.getNodesByLabel = async function (label) {
  let session = driver.session();
  const result = await session.run(
    'MATCH (n:' + label + ') RETURN n'
  );
  session.close();
  const nodes = result.records.map((record) => record.get('n').properties);
  return nodes;
};

//Create a user//
exports.create_user = async function (name) {
  let session = driver.session();
  let user = "No User Was Created";
  try {
    user = await session.run('MERGE (n:user {name: $id}) RETURN n', {
      id: name
    });
  }
  catch (err) {
    console.error(err);
    return user;
  }
  return user.records[0].get(0).properties.name;
}
//Delete a node//
exports.deleteNode = async function (nodeId) {
  let session = driver.session();
  const result = await session.run('MATCH (n) WHERE ID(n) = $nodeId DELETE n', { nodeId: neo4j.int(nodeId) });
  session.close();

  //console.log(`Deleted ${result.summary.counters.nodesDeleted()} node(s).`);
  console.log (result.summary.counters)
  return "Node " +nodeId+ " deleted successfully"
};
//Get all nodes by name//
exports.getNodeAndRelationsByName = async function (nodeName) {
  let session = driver.session();
  const result = await session.run(
    'MATCH (n {Name: $nodeName})-[r]-(relatedNode) RETURN n, r, relatedNode',
    { nodeName }
  );
  session.close();
  const nodes = [];
  const relationships = [];
  result.records.forEach((record) => {
    const node = record.get('n').properties;
    const relation = record.get('r').properties;
    const relatedNode = record.get('relatedNode').properties;
    nodes.push(node);
    relationships.push({ relation, relatedNode });
  });
  return { nodes, relationships };
};
//Get all nodes by label//
exports.getNodesByLabel = async function (label) {
  let session = driver.session();
  const result = await session.run(
    'MATCH (n:' + label + ') RETURN n'
  );
  session.close();
  const nodes = result.records.map((record) => record.get('n').properties);
  return nodes;

};

// Function to create a relationship between nodes
exports.addRelationship = async function addRelationship(startNodeId, endNodeId, relationshipType) {
  const session = driver.session();
  try {
    const result = await session.writeTransaction(tx =>
      tx.run(
        'MATCH (a), (b) WHERE ID(a) = $startNodeId AND ID(b) = $endNodeId CREATE (a)-[:' + relationshipType + ']->(b) RETURN a, b',
        { startNodeId, endNodeId }
      )
    );
    return result.records.map(record => record.toObject());
  } finally {
    session.close();
  }
}




