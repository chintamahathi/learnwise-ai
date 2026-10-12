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

export default router;
