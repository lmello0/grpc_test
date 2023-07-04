const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(require('path').resolve('./proto/user.proto'), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const UserProto = grpc.loadPackageDefinition(packageDefinition).UserService;

const users = [
    { id: 1, name: 'joao', age: 21, height: 165 },
    { id: 2, name: 'antonio', age: 60, height: 165 },
    { id: 3, name: 'maria', age: 57, height: 154 }
]

function List(_, callback) {
    return callback(null, { users });
}

function Find(call, callback) {
    let { id } = call.request;

    let user = users.find((user) => { return user.id == id });

    if (typeof user == 'undefined') {
        user = {};
    }
    
    return callback(null, user)
}

function Insert(call, callback) {
    const user = {
        id: users.length + 1,
        name: call.request.name,
        age: call.request.age,
        height: call.request.height
    }

    users.push(user);

    return callback(null, user);
}

function Delete(call, callback) {
    const { id } = call.request;

    let user = users.find((user) => user.id === id);
    const index = users.indexOf(user);

    if (typeof user != 'undefined') {
        users.splice(index, 1);
    } else {
        user = {};
    }

    return callback(null, user);
}

function Update(call, callback) {
    const { id, name, age, height } = call.request;

    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex != -1) {
        users[userIndex] = { id, name, age, height };
    }

    return callback(null, userIndex != -1 ? users[userIndex] : {});
}

const server = new grpc.Server();

server.addService(UserProto.service, { List, Find, Insert, Delete, Update });

server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('Running...');
    console.log('Press Ctrl + C to exit');
});