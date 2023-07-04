# GRPC_TEST

Projeto simples de uma API utilizando gRPC e REST.

A arquitetura da API funciona da seguinte forma, um serviço funcionará como gateway que receberá as requisições em REST (`client.js`) e o mesmo fará chamadas via gRPC para os microsserviços responsáveis (`server.js`) e depois retornará a response para o solicitante.
