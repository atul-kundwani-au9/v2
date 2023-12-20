const clientModel = require('../models/clientModel');

const createClient = async (req, res) => {
  try {
    const { ClientName, ContactPerson, ContactEmail } = req.body;
    const client = await clientModel.createClient({
      ClientName,
      ContactPerson,
      ContactEmail,
    });
    res.json({ status: 'success', message: 'Client created successfully', data: client });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getClientList = async (req, res) => {
  try {
    const clients = await clientModel.getClients();
    res.json({ status: 'success',  data: clients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createClient,
  getClientList,
};
