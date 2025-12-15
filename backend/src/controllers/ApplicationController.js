import Application from "../models/Application.js";

export const applyToOffer = async (req, res) => {
  try {
    const { offerId, userId } = req.body;

    const application = await Application.create({
      offerId,
      userId
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
