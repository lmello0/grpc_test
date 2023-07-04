const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const express = require('express');

const luxon = require('luxon');

const packageDefinition = protoLoader.loadSync(require('path').resolve('./proto/user.proto'));

const UserProto = grpc.loadPackageDefinition(packageDefinition);

const client = new UserProto.UserService('localhost:50051', grpc.credentials.createInsecure());

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    const date = luxon.DateTime.now().toFormat('dd/MM/yyyy HH:mm:ss')

    console.log(`[${req.method}] - ${req.url} - ${date}`)

    next();
})

app.get('/user', (req, res) => {
    client.list({}, (err, response) => {
        if (err) throw err;

        res.json(response);
    });
});

app.get('/user/:id', (req, res) => {
    const { id } = req.params.id;

    client.find({ id }, (err, response) => {
        if (err) throw err;

        if (!response.id) {
            res.json('User not found');
            return;
        }

        res.json(response);
    })
});

app.post('/user', (req, res) => {
    const { name, age, height } = req.body;

    client.insert({ name, age, height }, (err, response) => {
        if (err) throw err;

        res.json('User inserted with id ' + response.id);
    });
});

app.delete('/user/:id', (req, res) => {
    const { id } = req.params;

    client.delete({ id }, (err, response) => {
        if (err) throw err;

        if (!response.id) {
            res.json(`Not found user with ${id}`);
            return;
        }

        res.json(`User with index ${id} deleted`);
    });
});

app.put('/user/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, height } = req.body;

    client.update({ id, name, age, height }, (err, response) => {
        if (err) throw err;
        
        if(!response.id) {
            res.json(`Not found user with ${id}`);
            return;
        }

        res.json(`User ${id} updated!`);
    });
})

app.listen(3000, () => {
    console.log('Running on port 3000...');
    console.log('Press Ctrl + C to exit');
});