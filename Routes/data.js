import express from "express"
export const router = express.Router();

import { supabase } from "../Supabase.js/supabase.js"

async function getData(req, res, next) {
    const { data: users, error } = await supabase
        .from('Data')
        .select('*')
    console.log("am here")
    req.data = data;
    next()
}
router.post("/", getData, (req, res) => {
    console.log("Get Data List");
    console.log(req.data)
    if (error) {
        return res.status(400).json({ success: false, data: error.message });
    }

    res.status(200).json({ success: true, data: req.data });
})