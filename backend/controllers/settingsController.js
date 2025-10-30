import Settings from "../models/Settings.js";

export const getSettings = async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.json(settings);
};

export const updateSettings = async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  const { maxBooksPerUser, loanPeriodDays, finePerDay } = req.body;
  if (maxBooksPerUser !== undefined) settings.maxBooksPerUser = maxBooksPerUser;
  if (loanPeriodDays !== undefined) settings.loanPeriodDays = loanPeriodDays;
  if (finePerDay !== undefined) settings.finePerDay = finePerDay;
  await settings.save();
  res.json(settings);
};
