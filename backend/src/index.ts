import express, { Application } from "express";
import "reflect-metadata";
import { container } from "tsyringe";
import App from "./app";
import AppRouter from "./Routers/index.router";

const app = container.resolve(App);

const PORT = process.env.PORT || 3000;

app.start(PORT);
