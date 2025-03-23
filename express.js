import express from express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    console.log("here");
    res.send("Welcome to the homepage!"); // Responding to the client
});

app.listen(3000, () => console.log("Server running on port 3000"));