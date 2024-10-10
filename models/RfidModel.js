class RfidModel {
    constructor() {
      this.latestRfid = null;
    }
  
    setRfid(rfidCode) {
      this.latestRfid = rfidCode;
    }
  
    getLatestRfid() {
      return this.latestRfid;
    }
  
    deleteRfid() {
      const deletedRfid = this.latestRfid;
      this.latestRfid = null;
      return deletedRfid;
    }
  }
  
  
  module.exports = new RfidModel();