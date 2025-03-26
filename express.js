import express from "express";
export const app = express();
import cors from "cors";
import { router } from "./Routes/data.js";
import { WebSocketServer } from "ws";
import http from "http";
import { supabase } from "./Supabase.js/supabase.js";

// Setup HTTP and WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// CORS setup
app.use(
    cors({
        origin: "http://nutrigen.myprojects.studio",
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Supabase real-time data change listener
supabase
    .channel("realtime:my_table")
    .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Data" },
        (payload) => {
            console.log("Change received!", payload);

            // Broadcast payload to all connected WebSocket clients
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

    // Send welcome message
    ws.send(JSON.stringify({ message: "Welcome to live updates!" }));
    ws.isAlive = true;

    // Handle messages from clients
    ws.on("message", (data) => {
        console.log(`Client says: ${data}`);
    });

    // Handle pong to confirm client is still alive
    ws.on("pong", () => {
        ws.isAlive = true;
    });

    // Handle client disconnection
    ws.on("close", () => console.log("Client disconnected"));
});

// Heartbeat (ping) to check client health every 30 seconds
setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
            console.log("Stale client detected, disconnecting...");
            return ws.terminate(); // Force disconnect
        }

        ws.isAlive = false; // Mark as inactive
        ws.ping(); // Send ping to check if client responds
    });
}, 30000);

// Test route
app.get("/", (req, res) => {
    res.send("WebSocket server is running");
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () =>
    console.log(`Server running on port ${PORT}`)
);

// Route
app.use("/Data", router);
