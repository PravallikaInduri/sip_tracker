const express = require("express");
const router = express.Router();
const sipinvestorController = require("../controllers/sipinvestorcontroller");
const sipfundController = require("../controllers/sipfundcontroller");
const sipController = require("../controllers/sipcontroller");


router.post("/login", sipinvestorController.login);
router.get("/details", sipinvestorController.getDetails);

router.post("/api/investors", sipinvestorController.createInvestor);
router.get("/api/investors/:investorId", sipinvestorController.getInvestorById);
router.get("/api/investors/:investorId/holdings", sipinvestorController.getHoldings);
router.get("/api/investors/:investorId/networth", sipinvestorController.getNetworth);

router.post("/api/funds", sipfundController.createFund);
router.get("/api/funds", sipfundController.getFunds);
router.put("/api/funds/:fundId/nav", sipfundController.updateNav);

router.post("/api/sips", sipController.createSip);
router.post("/api/sip", sipController.createSip); 
router.get("/api/sips/:sipId", sipController.getSipById);
router.post("/api/sips/:sipId/process", sipController.processSipInstallment);
router.get("/api/sips/:sipId/transactions", sipController.getSipTransactions);

module.exports = router;