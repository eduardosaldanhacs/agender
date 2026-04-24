/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80200 (8.2.0)
 Source Host           : localhost:3306
 Source Schema         : agender

 Target Server Type    : MySQL
 Target Server Version : 80200 (8.2.0)
 File Encoding         : 65001

 Date: 17/04/2026 16:28:16
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cache
-- ----------------------------
DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache`  (
  `key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cache
-- ----------------------------

-- ----------------------------
-- Table structure for cache_locks
-- ----------------------------
DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks`  (
  `key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cache_locks
-- ----------------------------

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `categories_user_id_name_unique`(`user_id`, `name`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES (1, 1, 'Salario', '#16A34A', '2026-03-31 16:11:11', '2026-03-31 16:11:11');
INSERT INTO `categories` VALUES (2, 1, 'Moradia', '#DC2626', '2026-03-31 16:11:11', '2026-03-31 16:11:11');
INSERT INTO `categories` VALUES (3, 1, 'Lazer', '#2563EB', '2026-03-31 16:11:11', '2026-03-31 16:11:11');
INSERT INTO `categories` VALUES (4, 3, 'Cartão de Crédito', '#0ea5e9', '2026-03-31 16:23:33', '2026-03-31 16:23:33');
INSERT INTO `categories` VALUES (5, 3, 'Salário', '#5ae70d', '2026-03-31 16:31:50', '2026-03-31 16:31:50');
INSERT INTO `categories` VALUES (6, 3, 'Vivo', '#d90de7', '2026-04-10 17:47:35', '2026-04-10 17:47:35');
INSERT INTO `categories` VALUES (7, 3, 'MEI (mãe)', '#e70d6c', '2026-04-10 17:48:26', '2026-04-10 17:48:26');
INSERT INTO `categories` VALUES (8, 3, 'Academia', '#e7970d', '2026-04-10 17:48:41', '2026-04-10 17:48:41');
INSERT INTO `categories` VALUES (9, 3, 'Comida', '#0de79f', '2026-04-10 17:49:18', '2026-04-10 17:49:18');

-- ----------------------------
-- Table structure for events
-- ----------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `event_date` date NOT NULL,
  `event_time` time NOT NULL,
  `reminder_at` timestamp NULL DEFAULT NULL,
  `reminder_sent` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `events_user_id_event_date_index`(`user_id`, `event_date`) USING BTREE,
  INDEX `events_reminder_at_index`(`reminder_at`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of events
-- ----------------------------
INSERT INTO `events` VALUES (1, 1, 'Consulta medica', 'Levar exames anteriores.', '2026-04-03', '09:30:00', '2026-04-01 16:11:11', 1, '2026-03-31 16:11:11', '2026-03-31 16:30:01');
INSERT INTO `events` VALUES (2, 1, 'Reuniao de planejamento', 'Revisar metas do mes.', '2026-04-07', '14:00:00', '2026-04-02 16:11:11', 0, '2026-03-31 16:11:11', '2026-03-31 16:11:11');
INSERT INTO `events` VALUES (3, 3, 'PROVA ALEST', 'PROVA 1 - CONTEUDO ALGORITMOS', '2026-05-05', '19:00:00', '2026-05-05 21:00:00', 0, '2026-03-31 16:25:00', '2026-03-31 16:25:00');
INSERT INTO `events` VALUES (4, 3, 'teste', 'teste123', '2026-03-03', '20:00:00', NULL, 0, '2026-03-31 16:26:16', '2026-03-31 16:26:16');
INSERT INTO `events` VALUES (5, 3, 'teste123', 'teste', '2026-04-01', '09:00:00', NULL, 0, '2026-03-31 16:27:57', '2026-03-31 16:27:57');

-- ----------------------------
-- Table structure for failed_jobs
-- ----------------------------
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of failed_jobs
-- ----------------------------

-- ----------------------------
-- Table structure for financial_goals
-- ----------------------------
DROP TABLE IF EXISTS `financial_goals`;
CREATE TABLE `financial_goals`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NULL DEFAULT NULL,
  `title` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `goal_type` enum('saving','expense_limit') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'saving',
  `target_amount` decimal(12, 2) NOT NULL,
  `current_amount` decimal(12, 2) NOT NULL DEFAULT 0.00,
  `start_date` date NULL DEFAULT NULL,
  `end_date` date NULL DEFAULT NULL,
  `status` enum('active','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `financial_goals_category_id_foreign`(`category_id`) USING BTREE,
  INDEX `financial_goals_user_id_status_index`(`user_id`, `status`) USING BTREE,
  INDEX `financial_goals_user_id_end_date_index`(`user_id`, `end_date`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of financial_goals
-- ----------------------------
INSERT INTO `financial_goals` VALUES (1, 3, NULL, 'Moto', 'saving', 10000.00, 2500.00, '2026-04-10', NULL, 'active', NULL, '2026-04-10 17:32:30', '2026-04-10 17:32:30');

-- ----------------------------
-- Table structure for job_batches
-- ----------------------------
DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `cancelled_at` int NULL DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of job_batches
-- ----------------------------

-- ----------------------------
-- Table structure for jobs
-- ----------------------------
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED NULL DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `jobs_queue_index`(`queue`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of jobs
-- ----------------------------

-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of migrations
-- ----------------------------
INSERT INTO `migrations` VALUES (1, '0001_01_01_000000_create_users_table', 1);
INSERT INTO `migrations` VALUES (2, '0001_01_01_000001_create_cache_table', 1);
INSERT INTO `migrations` VALUES (3, '0001_01_01_000002_create_jobs_table', 1);
INSERT INTO `migrations` VALUES (4, '2026_03_31_153315_create_personal_access_tokens_table', 1);
INSERT INTO `migrations` VALUES (5, '2026_03_31_153712_create_events_table', 1);
INSERT INTO `migrations` VALUES (6, '2026_03_31_153713_create_categories_table', 1);
INSERT INTO `migrations` VALUES (7, '2026_03_31_153714_create_recurring_rules_table', 1);
INSERT INTO `migrations` VALUES (8, '2026_03_31_153714_create_transactions_table', 1);
INSERT INTO `migrations` VALUES (9, '2026_04_10_180000_create_notes_table', 2);
INSERT INTO `migrations` VALUES (10, '2026_04_10_190000_create_financial_goals_table', 3);

-- ----------------------------
-- Table structure for notes
-- ----------------------------
DROP TABLE IF EXISTS `notes`;
CREATE TABLE `notes`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `title` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_pinned` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `notes_user_id_is_pinned_index`(`user_id`, `is_pinned`) USING BTREE,
  INDEX `notes_user_id_updated_at_index`(`user_id`, `updated_at`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notes
-- ----------------------------
INSERT INTO `notes` VALUES (1, 3, 'teste', 'teste123', '#FEF3C7', 0, '2026-04-10 17:18:29', '2026-04-10 17:18:29');

-- ----------------------------
-- Table structure for password_reset_tokens
-- ----------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens`  (
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of password_reset_tokens
-- ----------------------------

-- ----------------------------
-- Table structure for personal_access_tokens
-- ----------------------------
DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `personal_access_tokens_token_unique`(`token`) USING BTREE,
  INDEX `personal_access_tokens_tokenable_type_tokenable_id_index`(`tokenable_type`, `tokenable_id`) USING BTREE,
  INDEX `personal_access_tokens_expires_at_index`(`expires_at`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of personal_access_tokens
-- ----------------------------
INSERT INTO `personal_access_tokens` VALUES (1, 'App\\Models\\User', 2, 'api-token', '522f40127dcb1827e335fed653915bed4e0d73dccb49daa4c8a99aa38b7030f5', '[\"*\"]', NULL, NULL, '2026-03-31 16:18:12', '2026-03-31 16:18:12');
INSERT INTO `personal_access_tokens` VALUES (3, 'App\\Models\\User', 3, 'api-token', '94d7f642b98d0ee0c93cdfd040fef4eafd82e859978971e53168748a8d916338', '[\"*\"]', '2026-04-13 11:26:15', NULL, '2026-04-10 17:53:37', '2026-04-13 11:26:15');

-- ----------------------------
-- Table structure for recurring_rules
-- ----------------------------
DROP TABLE IF EXISTS `recurring_rules`;
CREATE TABLE `recurring_rules`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NULL DEFAULT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12, 2) NOT NULL,
  `type` enum('income','expense') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `frequency` enum('daily','weekly','monthly','yearly') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `next_run_date` date NOT NULL,
  `end_date` date NULL DEFAULT NULL,
  `last_generated_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `recurring_rules_category_id_foreign`(`category_id`) USING BTREE,
  INDEX `recurring_rules_user_id_next_run_date_index`(`user_id`, `next_run_date`) USING BTREE,
  INDEX `recurring_rules_is_active_next_run_date_index`(`is_active`, `next_run_date`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of recurring_rules
-- ----------------------------
INSERT INTO `recurring_rules` VALUES (1, 1, 2, 'Assinatura streaming', 39.90, 'expense', 'monthly', '2026-05-01', NULL, NULL, 1, '2026-03-31 16:11:11', '2026-03-31 16:11:11');
INSERT INTO `recurring_rules` VALUES (2, 3, 6, 'Vivo', 149.70, 'expense', 'monthly', '2026-05-15', NULL, NULL, 1, '2026-04-10 18:15:19', '2026-04-10 18:15:19');
INSERT INTO `recurring_rules` VALUES (3, 3, 5, 'Salário', 2500.00, 'income', 'monthly', '2026-05-10', NULL, NULL, 1, '2026-04-10 18:33:44', '2026-04-10 18:33:44');
INSERT INTO `recurring_rules` VALUES (4, 3, 8, 'Academia', 129.00, 'expense', 'monthly', '2026-05-10', NULL, NULL, 1, '2026-04-13 11:24:02', '2026-04-13 11:24:02');

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NULL DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sessions_user_id_index`(`user_id`) USING BTREE,
  INDEX `sessions_last_activity_index`(`last_activity`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sessions
-- ----------------------------

-- ----------------------------
-- Table structure for transactions
-- ----------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NULL DEFAULT NULL,
  `recurring_rule_id` bigint UNSIGNED NULL DEFAULT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12, 2) NOT NULL,
  `transaction_date` date NOT NULL,
  `type` enum('income','expense') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `transactions_category_id_foreign`(`category_id`) USING BTREE,
  INDEX `transactions_recurring_rule_id_foreign`(`recurring_rule_id`) USING BTREE,
  INDEX `transactions_user_id_transaction_date_index`(`user_id`, `transaction_date`) USING BTREE,
  INDEX `transactions_user_id_type_index`(`user_id`, `type`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of transactions
-- ----------------------------
INSERT INTO `transactions` VALUES (1, 1, 1, NULL, 'Salario mensal', 5500.00, '2026-03-01', 'income', '2026-03-31 16:11:11', '2026-03-31 16:11:11');
INSERT INTO `transactions` VALUES (2, 1, 2, NULL, 'Aluguel', 1800.00, '2026-03-31', 'expense', '2026-03-31 16:11:11', '2026-03-31 16:11:11');
INSERT INTO `transactions` VALUES (3, 1, 3, NULL, 'Cinema', 80.00, '2026-03-29', 'expense', '2026-03-31 16:11:11', '2026-03-31 16:11:11');
INSERT INTO `transactions` VALUES (4, 3, 4, NULL, 'UBER', 35.25, '2026-03-31', 'expense', '2026-03-31 16:24:00', '2026-03-31 16:24:00');
INSERT INTO `transactions` VALUES (8, 3, 8, 4, 'Academia', 129.00, '2026-04-10', 'expense', '2026-04-13 11:24:02', '2026-04-13 11:24:02');
INSERT INTO `transactions` VALUES (6, 3, 6, 2, 'Vivo', 149.70, '2026-04-15', 'expense', '2026-04-10 18:15:19', '2026-04-10 18:15:19');
INSERT INTO `transactions` VALUES (7, 3, 5, 3, 'Salário', 2500.00, '2026-04-10', 'income', '2026-04-10 18:33:44', '2026-04-10 18:33:44');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `users_email_unique`(`email`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'Julia Teste', 'julia@example.com', '2026-03-31 16:11:10', '$2y$12$YLgnv3UOUqveFALRDil.Tu9NPdhE3Ji.oHCVNZsFAs9Xn7.IQbuQq', 'gcSFJ0UkTc', '2026-03-31 16:11:11', '2026-03-31 16:11:11');
INSERT INTO `users` VALUES (2, 'Teste User', 'teste+1774973891@mail.com', NULL, '$2y$12$6i5doOba3DU1vGWO2qb8xeC4KTr/zySZCvwWRED/opPft3pNdeyNi', NULL, '2026-03-31 16:18:12', '2026-03-31 16:18:12');
INSERT INTO `users` VALUES (3, 'Eduardo Saldanha', 'eduardosaldanhacs@gmail.com', NULL, '$2y$12$wGIRlryY1nmHyOU6tT1bUOf7xJN3LSf2tNNGA4jOT1M7XP1i7Tpay', NULL, '2026-03-31 16:21:19', '2026-03-31 16:21:19');

SET FOREIGN_KEY_CHECKS = 1;
