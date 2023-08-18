let neo4j = require('neo4j-driver');
let { creds } = require("./../config/credentials");
let driver = neo4j.driver("bolt://0.0.0.0:7687", neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw));
//Get all number of nodes//
exports.get_num_nodes = async function () {
  let session = driver.session();
  const result = await session.run('MATCH (n) RETURN n, n.properties', {});  // Fetches nodes and properties
  session.close();
  
  const nodes = result.records.map((record) => {
    const node = record.get(0); // Get the node object
    const properties = record.get(1); // Get the properties of the node
    return {
      node,
      properties
    };
  });
  
  console.log("Nodes with Properties:", nodes);
  return nodes;
};
    /*let session = driver.session();
    const result = await session.run('MATCH (n) RETURN n', {
    });
    session.close();
    const nodes = result.records.map((record) => record.get(0));
   console.log("Nodes:", nodes);
    return nodes;    
};*/
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


  

