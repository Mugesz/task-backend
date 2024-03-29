var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const URL = process.env.DB

mongoose
  .connect(URL)
  .then(() => {
    console.log("MongoDb connected");
  })
  .catch((err) => {
    console.error(err);
  });


// mongoose.connect('mongodb://localhost:27017/Authentication', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   // Set the write concern here
//   w: 'majority', // or w: 1, depending on your requirements
// });


const taskScheme = new mongoose.Schema({
  title: { type: String, required: true },
  about: { type: String, required: true },
  date: { type: Date, required: true },
});

const Task = mongoose.model("task", taskScheme);

//view all
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (error) {
    console.log(error);
  }
});

// create task
router.post("/create-task", async (req, res) => {
  try {
    console.log(req.body)
    const task = new Task({
      title: req.body.title,
      about: req.body.about,
      date: req.body.date,
    });


    await task.save();
    res.status(200).json({ message: "task submitted successfully", task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong in createing task" });
  }
});

//view one
router.get("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!taskId) {
      return res.status(400).json({ message: "Task ID not provided" });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {id} = req.params
    
    const edittask = {
      title:req.body.title,
      about:req.body.about,
      date:req.body.date
    }
    const task = await Task.findByIdAndUpdate(id,edittask)
    res.send(task)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:"something went wrong"
    })
  }
});



router.delete("/:id", async (req, res) => {
try {
  const {id} = req.params
  const del = await Task.findByIdAndDelete(id)
} catch (error) {
  console.log(error)
  res.json({
    message:"something went wrong"
  })
}
});

module.exports = router;
