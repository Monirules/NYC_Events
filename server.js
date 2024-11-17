const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb+srv://mim9:Mahmud2001@nosqlassignment.rpdca.mongodb.net/nyc_event_hub?retryWrites=true&w=majority";
const client = new MongoClient(MONGO_URI);

// Middleware
app.use(express.json());
app.use(cors());
//app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(express.static("public"));


// MongoDB Connection
async function main() {
    try {
        await client.connect();
        const db = client.db("nyc_event_hub");
        const users = db.collection("users");
        const contacts = db.collection("contacts");
        const events = db.collection('events');
        // Registration Endpoint
        app.post("/register", async (req, res) => {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).send("All fields are required.");
            }

            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const userExists = await users.findOne({ email });

                if (userExists) {
                    return res.status(400).send("Email already registered.");
                }

                await users.insertOne({ name, email, password: hashedPassword });
                res.status(201).send("success");
            } catch (err) {
                console.error("Error during registration:", err);
                res.status(500).send("Error during registration. Please try again later.");
            }
        });

        // Login Endpoint
        // app.post("/login", async (req, res) => {
        //     const { email, password } = req.body;

        //     if (!email || !password) {
        //         return res.status(400).send("Both email and password are required.");
        //     }

        //     try {
        //         const user = await users.findOne({ email });

        //         if (user && await bcrypt.compare(password, user.password)) {
        //             res.status(200).send("success");
        //         } else {
        //             res.status(401).send("Invalid email or password");
        //         }
        //     } catch (err) {
        //         console.error("Error during login:", err);
        //         res.status(500).send("Error during login. Please try again later.");
        //     }
        // });


        // Login Endpoint
        app.post("/login", async (req, res) => {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).send("Both email and password are required.");
            }

            try {
                const user = await users.findOne({ email });

                if (user && await bcrypt.compare(password, user.password)) {
                    // Send user details (name and email) on successful login
                    res.status(200).json({ name: user.name, email: user.email });
                } else {
                    res.status(401).send("Invalid email or password");
                }
            } catch (err) {
                console.error("Error during login:", err);
                res.status(500).send("Error during login. Please try again later.");
            }
        });




        // Event Submission Endpoint
        app.post('/submit-event', async (req, res) => {
            const { eventName, eventPlace, eventDescription } = req.body;
        
            if (!eventName || !eventPlace || !eventDescription) {
                return res.status(400).json({ message: 'All fields are required.' });
            }
        
            try {
                const eventsCollection = db.collection('events');  // Make sure the 'events' collection exists
                const newEvent = { eventName, eventPlace, eventDescription, createdAt: new Date() };
                await eventsCollection.insertOne(newEvent);
        
                res.status(201).json({ message: 'Event form submitted successfully.' });
            } catch (err) {
                console.error('Error saving event data:', err);
                res.status(500).json({ message: 'Error submitting event. Please try again later.' });
            }
        });
        



        // Fetch all events from the events collection
        app.get("/get-events", async (req, res) => {
            try {
                // Retrieve all events from the collection
                const eventsList = await events.find().toArray();

                res.status(200).json(eventsList); // Return the events as a JSON response
            } catch (err) {
                console.error("Error fetching events:", err);
                res.status(500).json({ message: "Error fetching events. Please try again later." });
            }
        });


        // Fetch user profile based on the logged-in user's session or token
        app.get("/get-profile", async (req, res) => {
            try {
                // Assuming the user ID is stored in the session (you can also get it from a token)
                const userId = req.session.userId;  // or extract from JWT token if using that approach

                if (!userId) {
                    return res.status(401).json({ message: "User not authenticated." });
                }

                // Find the user from the database
                const user = await users.findOne({ _id: new ObjectId(userId) });

                if (!user) {
                    return res.status(404).json({ message: "User not found." });
                }

                // Send user data as response
                res.status(200).json({
                    name: user.name,
                    email: user.email,
                });
            } catch (err) {
                console.error("Error fetching user profile:", err);
                res.status(500).json({ message: "Error fetching profile. Please try again later." });
            }
        });




        // Contact Form Submission Endpoint
        // Contact Form Submission Endpoint
        app.post("/submit", async (req, res) => {
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).send("All fields are required.");
            }

            try {
                // Insert the contact form data into the 'contacts' collection
                const contact = { name, email, message, createdAt: new Date() };
                await contacts.insertOne(contact);

                res.status(201).json({ message: "Contact form submitted successfully." }); // Return a JSON response
            } catch (err) {
                console.error("Error saving contact form data:", err);
                res.status(500).json({ message: "Error submitting contact form. Please try again later." });
            }
        });

        
        // Start the server
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if connection to DB fails
    }
}

main();

