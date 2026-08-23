import { Router } from 'express';
import { adminController } from '../controllers/AdminController.js';
import { jobController } from '../controllers/JobController.js';
import { auditLogController } from '../controllers/AuditLogController.js';
import { analyticsController } from '../controllers/AnalyticsController.js';
import { feedbackController } from '../controllers/FeedbackController.js';
import { errorLogController } from '../controllers/ErrorLogController.js';
import { requireAuth } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { UserRole } from '../utils/constants.js';

const router = Router();

// Protect all admin endpoints with ADMIN and SUPER_ADMIN role guard
router.use(requireAuth, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get('/stats', adminController.getDashboardStats.bind(adminController));
router.post('/sync-database', adminController.syncDatabase.bind(adminController));

// Submissions review
router.get('/submissions', adminController.getSubmissions.bind(adminController));
router.post('/submissions/:id/approve', adminController.approveSubmission.bind(adminController));
router.post('/submissions/:id/reject', adminController.rejectSubmission.bind(adminController));

// Claims review
router.get('/claims', adminController.getClaims.bind(adminController));
router.post('/claims/:id/approve', adminController.approveClaim.bind(adminController));
router.post('/claims/:id/reject', adminController.rejectClaim.bind(adminController));

// User management
router.get('/users', adminController.getUsers.bind(adminController));
router.patch('/users/:id/role', adminController.updateUserRole.bind(adminController));

// Jobs moderation
router.get('/jobs', jobController.adminListJobs.bind(jobController));
router.post('/jobs/:id/hide', jobController.adminHideJob.bind(jobController));
router.post('/jobs/:id/restore', jobController.adminRestoreJob.bind(jobController));

// Detailed API Access Audit Logging
router.get('/audit-logs', auditLogController.getAuditLogs.bind(auditLogController));
router.get('/audit-logs/stats', auditLogController.getAuditStats.bind(auditLogController));

// User Feedback Intelligence (Admin Only)
router.get('/feedback', feedbackController.getAdminFeedback.bind(feedbackController));
router.get('/feedback/stats', feedbackController.getFeedbackStats.bind(feedbackController));
router.patch('/feedback/:id', feedbackController.updateFeedbackStatus.bind(feedbackController));

// System Error Logs & Crash Triage (Admin Only)
router.get('/errors', errorLogController.getAdminErrors.bind(errorLogController));
router.get('/errors/stats', errorLogController.getErrorStats.bind(errorLogController));
router.patch('/errors/:id', errorLogController.updateErrorStatus.bind(errorLogController));

// Platform Ecosystem Telemetry & Traffic
router.get('/analytics', analyticsController.getEcosystemAnalytics.bind(analyticsController));
router.get('/startups/:id/analytics', analyticsController.getStartupAnalytics.bind(analyticsController));

export default router;
