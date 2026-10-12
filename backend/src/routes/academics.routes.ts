import { Router } from "express";
import {
  listRecords,
  createRecord,
  removeRecord,
  listTopicStats,
  listSubjectStats,
  listResources,
  listQuestions,
  listSubjects,
  listGaps,
  listRecommendations,
  getPracticeSet,
  submitAttempt,
  listAttempts,
} from "../controllers/academics.controller.js";

const router = Router();

router.get("/subjects",         listSubjects);
router.get("/records",          listRecords);
router.post("/records",         createRecord);
router.delete("/records/:id",   removeRecord);
router.get("/stats/topics",     listTopicStats);
router.get("/stats/subjects",   listSubjectStats);
router.get("/resources",        listResources);
router.get("/questions",        listQuestions);
router.get("/gaps",             listGaps);
router.get("/recommendations",  listRecommendations);
router.get("/practice-set",     getPracticeSet);
router.post("/attempts",        submitAttempt);
router.get("/attempts",         listAttempts);

export default router;
