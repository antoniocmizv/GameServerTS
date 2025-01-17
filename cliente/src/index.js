import { ConnectionHandler } from "./services/ConectionHandler.js";

ConnectionHandler.init("http://localhost:3000", () => {
    console.log("Connected to server");
}, () => {
    console.log("Disconnected from server");
});
