import QuerySchema from "../models/QuerySchema";

export const createQuery = async (req, res, next) => {
  const newQuery = new QuerySchema(req.body);

  try {
    const savedQuery = await newQuery.save();
    res.status(200).json(savedQuery);
  } catch (err) {
    next(err);
  }
};
export const updateQuery = async (req, res, next) => {
  try {
    const updatedQuery = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedQuery);
  } catch (err) {
    next(err);
  }
};
export const deleteQuery = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Query has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getQuery = async (req, res, next) => {
  try {
    const hotel = await QuerySchema.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};


  
