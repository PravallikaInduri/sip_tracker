const express = require("express");
const router = express.Router();
const sipinvestorController = require("../controllers/sipinvestorcontroller");
const sipfundController = require("../controllers/sipfundcontroller");
const sipController = require("../controllers/sipcontroller");


router.post("/login", sipinvestorController.login);
router.get("/details", sipinvestorController.getDetails);

// --- Required 4 APIs Consolidated ---
router.post("/investors", sipinvestorController.createInvestor);
router.get("/investors", sipinvestorController.getAllInvestors);
router.get("/investors/:investor_id", sipinvestorController.getInvestorById);
router.get("/investors/:investor_id/holdings", sipinvestorController.getHoldings);
router.get("/investors/:investor_id/networth", sipinvestorController.getNetworth);
router.get("/transactions", sipinvestorController.getAllTransactions);
// ------------------------------------

router.post("/funds", sipfundController.createFund);
router.get("/funds", sipfundController.getFunds);
router.put("/funds/:fundId/nav", sipfundController.updateNav);

router.post("/sips", sipController.createSip);
router.post("/sip", sipController.createSip); 
router.get("/sips/:sipId", sipController.getSipById);
router.post("/sips/:sipId/process", sipController.processSipInstallment);
router.get("/investors/sips/:sipId/transactions", sipController.getSipTransactions);

module.exports = router;