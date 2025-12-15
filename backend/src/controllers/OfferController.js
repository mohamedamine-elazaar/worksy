import Offer from "../models/Offer.js";

export const createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate("entrepriseId");
    res.json(offers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
