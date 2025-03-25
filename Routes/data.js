import express from "express";
export const router = express.Router();
import { supabase } from "../Supabase.js/supabase.js";

// Middleware to fetch data
async function getData(req, res, next) {
    try {
        const { data: users, error } = await supabase.from("Data").select("*");

        console.log("am here");
        if (error) throw error;

        req.data = users;
        next();
    } catch (err) {
        console.error("Error fetching data:", err.message);
        return res.status(400).json({ success: false, data: err.message });
    }
}

// Define the route
router.get("/getsingle", getData, (req, res) => {
    console.log("Get Data List");
    console.log(req.data);

    res.status(200).json({ success: true, data: req.data });
});
