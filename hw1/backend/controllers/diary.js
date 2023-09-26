import DiaryModel from "../models/diaryModel.js";

// Get all todos
export const getDiarys = async (req, res) => {
  try {
    // Find all todos
    const Diarys = await DiaryModel.find({});

    // Return todos
    return res.status(200).json(Diarys);
  } catch (error) {
    // If there is an error, return 500 and the error message
    // You can read more about HTTP status codes here:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // Or this meme:
    // https://external-preview.redd.it/VIIvCoTbkXb32niAD-rxG8Yt4UEi1Hx9RXhdHHIagYo.jpg?auto=webp&s=6dde056810f99fc3d8dab920379931cb96034f4b
    return res.status(500).json({ message: error.message });
  }
};
// Create a todo
export const createDiary = async (req, res) => {
  const { date, title, mood, description } = req.body;

  // console.log(date);
  // console.log(title);
  // console.log(mood);
  // console.log(description);

  // Check title and description
  if (!date || !title || !mood || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required!" });
  }

  // Create a new todo
  try {
    const newDiary = await DiaryModel.create({
      date,
      title,
      mood,
      description,
    });
    return res.status(201).json(newDiary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a todo
export const updateDiary = async (req, res) => {
  const { id } = req.params;
  const { newdate, newtitle, newmood, newdescription} = req.body;

  console.log(newdescription);

  try {
    // Check if the id is valid
    const existedDiary = await DiaryModel.findById(id);
    if (!existedDiary) {
      return res.status(404).json({ message: "Diary not found!" });
    }

    // Update the 
  
    if (newdate !== undefined) existedDiary.date = newdate;
    if (newtitle !== undefined) existedDiary.title = newtitle;
    if (newmood !== undefined) existedDiary.mood = newmood;
    if (newdescription !== undefined) existedDiary.description = newdescription;

    // Save the updated todo
    await existedDiary.save();

    // Rename _id to id
    existedDiary.id = existedDiary._id;
    delete existedDiary._id;

    return res.status(200).json(existedDiary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a todo
export const deleteDiary = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the id is valid
    const existedDiary = await DiaryModel.findById(id);
    if (!existedDiary) {
      return res.status(404).json({ message: "Diary not found!" });
    }
    // Delete the todo
    await DiaryModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Diary deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
