const RfidModel = require('../models/RfidModel');

exports.postRfid = (req, res) => {
  const { rfidCode } = req.body;
  
  if (!rfidCode) {
    return res.status(400).json({ error: 'RFID code is required' });
  }

  RfidModel.setRfid(rfidCode);
  console.log('Received RFID:', rfidCode);
  res.status(200).json({ message: 'RFID code received successfully' });
};

exports.getLatestRfid = (req, res) => {
  const latestRfid = RfidModel.getLatestRfid();
  if (latestRfid) {
    res.json({ rfidCode: latestRfid });
  } else {
    res.status(404).json({ error: 'No RFID code available' });
  }
};

exports.deleteRfid = (req, res) => {
  const deletedRfid = RfidModel.deleteRfid();
  if (deletedRfid) {
    res.json({ message: 'RFID code deleted successfully', deletedRfid });
  } else {
    res.status(404).json({ error: 'No RFID code available to delete' });
  }
};