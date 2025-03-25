import express from "express"
export const app = express();
import cors from "cors";
import { router } from "./Routes/data.js";
import { WebSocketServer } from "ws";
import http from "http";
import { supabase } from "./Supabase.js/supabase.js";
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
app.use(
    cors({
        origin: "http://nutrigen.myprojects.studio", // Allow only this domain
        methods: ["GET", "POST"], // Allow specific methods
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
supabase
    .channel("realtime:my_table")
    .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Data" },
        (payload) => {
            console.log("Change received!", payload);

            // Broadcast the change to all WebSocket clients
            wss.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify(payload));
                }
            });
        }
    )
    .subscribe();

// WebSocket connection setup
wss.on("connection", (ws) => {
    console.log("New client connected!");

    ws.send(JSON.stringify({ message: "Welcome to live updates!" }));

    ws.on("message", (data) => {
        console.log(`Client says: ${data}`);
    });

    ws.on("close", () => console.log("Client disconnected"));
});
// Route
app.get("/", (req, res) => {
    res.send("WebSocket server is running");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

app.use("/Data", router);
