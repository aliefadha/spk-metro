-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jun 02, 2025 at 05:47 PM
-- Server version: 8.0.40
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spk-metro`
--

-- --------------------------------------------------------

--
-- Table structure for table `assesment`
--

CREATE TABLE `assesment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `metricId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` int NOT NULL,
  `assesmentDate` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `assesment`
--

INSERT INTO `assesment` (`id`, `projectId`, `metricId`, `userId`, `value`, `assesmentDate`, `created_at`, `updated_at`) VALUES
('02f7b35e-e00b-48a3-a770-ee82e3e3a034', '53c5456e-c40a-456b-9c30-b647fd1b4637', '0eb5863d-b6c2-4325-b043-f2196bfca8c3', 'be4e3112-45fa-44ae-8048-aaeb9b8dd706', 34, '2025-05-18', '2025-05-18 09:17:29.861', '2025-05-18 09:18:08.967'),
('0f96d901-ca39-4657-a8f3-8ecc88007381', '53c5456e-c40a-456b-9c30-b647fd1b4637', '24d540f9-777d-4938-a2fb-a4dc042f07b4', '52b3927e-6f55-4dac-9ecc-fc47f10170a3', 42, '2025-05-18', '2025-05-18 09:17:29.861', '2025-05-18 09:17:53.269'),
('1730e99f-125c-4e62-994a-58fd6bfd9c49', 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', 'f37e9484-183e-47f1-90c6-fc30e0be0036', '447384ec-4fe3-4663-9807-5c02cddf07af', 55, '2025-05-17', '2025-05-17 10:30:37.114', '2025-05-18 02:03:43.885'),
('18ccc6d3-0d07-4005-b4a3-15bd0ba027df', '53c5456e-c40a-456b-9c30-b647fd1b4637', 'bd894298-8249-445f-ade8-f9feaf87ba6c', 'be4e3112-45fa-44ae-8048-aaeb9b8dd706', 22, '2025-05-18', '2025-05-18 09:17:29.861', '2025-05-18 09:18:08.967'),
('4c2e1df1-18a9-4716-bb8d-ef1085baf367', '53c5456e-c40a-456b-9c30-b647fd1b4637', 'f37e9484-183e-47f1-90c6-fc30e0be0036', 'be4e3112-45fa-44ae-8048-aaeb9b8dd706', 34, '2025-05-18', '2025-05-18 09:17:29.861', '2025-05-18 09:18:08.967'),
('53b81400-b33b-41f3-aee7-1f1d7a8a2338', '53c5456e-c40a-456b-9c30-b647fd1b4637', 'b1dcf949-4cbd-4913-980f-33f9b60aec50', '52b3927e-6f55-4dac-9ecc-fc47f10170a3', 23, '2025-05-18', '2025-05-18 09:17:29.861', '2025-05-18 09:17:53.269'),
('5ce483c8-bc9e-43b3-a5c3-1e91d8dff325', 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', '0eb5863d-b6c2-4325-b043-f2196bfca8c3', '447384ec-4fe3-4663-9807-5c02cddf07af', 54, '2025-05-17', '2025-05-17 10:30:37.114', '2025-05-18 02:03:43.885'),
('7a0aa078-2c43-442f-8457-4b133b3ba0f8', 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', '24d540f9-777d-4938-a2fb-a4dc042f07b4', '24a916f3-0a96-4bca-9b15-3c991455d0e6', 54, '2025-05-17', '2025-05-17 10:30:37.114', '2025-05-17 10:31:06.219'),
('8fc70b27-831b-4527-80e9-8cd3ff96685d', '53c5456e-c40a-456b-9c30-b647fd1b4637', 'bd894298-8249-445f-ade8-f9feaf87ba6c', '52b3927e-6f55-4dac-9ecc-fc47f10170a3', 45, '2025-05-18', '2025-05-18 09:17:29.861', '2025-05-18 09:17:53.269'),
('95eb21e7-ae1e-4629-adaf-a84836884e3d', '53c5456e-c40a-456b-9c30-b647fd1b4637', '24d540f9-777d-4938-a2fb-a4dc042f07b4', 'be4e3112-45fa-44ae-8048-aaeb9b8dd706', 54, '2025-05-18', '2025-05-18 09:17:29.861', '2025-05-18 09:18:08.967'),
('98c43fe1-3692-44cc-887f-98e67481e6f2', 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', '24d540f9-777d-4938-a2fb-a4dc042f07b4', '447384ec-4fe3-4663-9807-5c02cddf07af', 22, '2025-05-17', '2025-05-17 10:30:37.114', '2025-05-18 02:03:43.885'),
('9cce6072-b013-492e-9cdb-91559d6bb590', 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', 'f37e9484-183e-47f1-90c6-fc30e0be0036', '24a916f3-0a96-4bca-9b15-3c991455d0e6', 89, '2025-05-17', '2025-05-17 10:30:37.114', '2025-05-17 10:31:06.219'),
('9e580018-c421-4ff3-bb67-64d9cbaabb38', '53c5456e-c40a-456b-9c30-b647fd1b4637', 'f37e9484-183e-47f1-90c6-fc30e0be0036', '52b3927e-6f55-4dac-9ecc-fc47f10170a3', 15, '2025-05-18', '2025-05-18 09:17:29.861', '2025-05-18 09:17:53.269'),
('9e60ceec-91da-4679-9bc2-78e39e8c0a32', 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', 'bd894298-8249-445f-ade8-f9feaf87ba6c', '24a916f3-0a96-4bca-9b15-3c991455d0e6', 67, '2025-05-17', '2025-05-17 10:30:37.114', '2025-05-17 10:31:06.219'),
('a7714d16-0163-4e12-8d84-094ad48195e7', 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', 'b1dcf949-4cbd-4913-980f-33f9b60aec50', '447384ec-4fe3-4663-9807-5c02cddf07af', 58, '2025-05-17', '2025-05-17 10:30:37.114', '2025-05-18 02:03:43.885'),
('b6c47555-01fe-4398-8b90-0d51b57a3d71', 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', 'b1dcf949-4cbd-4913-980f-33f9b60aec50', '24a916f3-0a96-4bca-9b15-3c991455d0e6', 12, '2025-05-17', '2025-05-17 10:30:37.114', '2025-05-17 10:31:06.219'),
('cdb3c681-754e-4d6d-9456-4e8d844245bf', 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', 'bd894298-8249-445f-ade8-f9feaf87ba6c', '447384ec-4fe3-4663-9807-5c02cddf07af', 50, '2025-05-17', '2025-05-17 10:30:37.114', '2025-05-18 02:03:43.885'),
('e5af3638-3fc7-484b-9b2a-0474e053b8b3', '53c5456e-c40a-456b-9c30-b647fd1b4637', '0eb5863d-b6c2-4325-b043-f2196bfca8c3', '52b3927e-6f55-4dac-9ecc-fc47f10170a3', 12, '2025-05-18', '2025-05-18 09:17:29.861', '2025-05-18 09:17:53.269'),
('e6766bd6-e77e-4cf7-86da-119ce57511f0', 'beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', '0eb5863d-b6c2-4325-b043-f2196bfca8c3', '24a916f3-0a96-4bca-9b15-3c991455d0e6', 34, '2025-05-17', '2025-05-17 10:30:37.114', '2025-05-17 10:31:06.219'),
('f7111428-c39d-4d9d-8730-382a474b1eb3', '53c5456e-c40a-456b-9c30-b647fd1b4637', 'b1dcf949-4cbd-4913-980f-33f9b60aec50', 'be4e3112-45fa-44ae-8048-aaeb9b8dd706', 56, '2025-05-18', '2025-05-18 09:17:29.861', '2025-05-18 09:18:08.967');

-- --------------------------------------------------------

--
-- Table structure for table `assesmentResult`
--

CREATE TABLE `assesmentResult` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skor` double NOT NULL,
  `status` enum('ACHIEVED','NOTACHIEVED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `isPersonal` tinyint(1) NOT NULL,
  `assesmentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `division`
--

CREATE TABLE `division` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `divisionName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalMember` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `division`
--

INSERT INTO `division` (`id`, `divisionName`, `totalMember`) VALUES
('bc2c2aeb-74d4-4238-a420-b01fe5e270a5', 'Marketing', 3),
('e0b4374f-3403-4e5d-97af-398e0cec468d', 'Developer', 7);

-- --------------------------------------------------------

--
-- Table structure for table `metric`
--

CREATE TABLE `metric` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kodeKpi` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `kpiName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target` double NOT NULL,
  `bobot` double NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `char` enum('Cost','Benefit') COLLATE utf8mb4_unicode_ci NOT NULL,
  `divisionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `metric`
--

INSERT INTO `metric` (`id`, `kodeKpi`, `kpiName`, `target`, `bobot`, `created_at`, `updated_at`, `char`, `divisionId`) VALUES
('0eb5863d-b6c2-4325-b043-f2196bfca8c3', 'K001', 'Velocity', 90, 5, '2025-02-15 10:36:52.204', '2025-05-13 09:27:57.497', 'Benefit', 'e0b4374f-3403-4e5d-97af-398e0cec468d'),
('24d540f9-777d-4938-a2fb-a4dc042f07b4', 'K004', 'On-Time Delivery', 90, 5, '2025-02-15 10:43:46.505', '2025-05-13 09:28:02.140', 'Benefit', 'e0b4374f-3403-4e5d-97af-398e0cec468d'),
('b1dcf949-4cbd-4913-980f-33f9b60aec50', 'K005', 'Team Collaboration', 90, 5, '2025-02-15 10:44:24.428', '2025-05-13 09:28:06.730', 'Benefit', 'e0b4374f-3403-4e5d-97af-398e0cec468d'),
('bd894298-8249-445f-ade8-f9feaf87ba6c', 'K003', 'Code Quality', 85, 5, '2025-02-15 10:43:11.980', '2025-05-13 09:28:10.746', 'Benefit', 'e0b4374f-3403-4e5d-97af-398e0cec468d'),
('f37e9484-183e-47f1-90c6-fc30e0be0036', 'K002', 'Change Failure Rate (CFR)', 85, 5, '2025-02-15 10:42:16.655', '2025-05-13 09:28:15.277', 'Cost', 'e0b4374f-3403-4e5d-97af-398e0cec468d');

-- --------------------------------------------------------

--
-- Table structure for table `metricNormalization`
--

CREATE TABLE `metricNormalization` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` double NOT NULL,
  `assesmentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `metricResult`
--

CREATE TABLE `metricResult` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalUtility` double NOT NULL,
  `vikorIndex` double NOT NULL,
  `maximumDeviation` double NOT NULL,
  `assesmentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bobot` double NOT NULL,
  `deadline` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('DONE','ONPROGRESS','BACKLOG') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`id`, `projectName`, `bobot`, `deadline`, `status`, `created_at`, `updated_at`) VALUES
('53c5456e-c40a-456b-9c30-b647fd1b4637', 'Ilmu Komunikasi', 1, '2025-05-18', 'DONE', '2025-05-18 09:17:29.846', '2025-05-18 09:17:37.859'),
('beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', 'PT Ajakan Digital Indonesia', 3, '2025-05-17', 'DONE', '2025-05-17 10:30:37.102', '2025-05-18 09:16:55.713');

-- --------------------------------------------------------

--
-- Table structure for table `projectCollaborator`
--

CREATE TABLE `projectCollaborator` (
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isProjectManager` tinyint(1) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projectCollaborator`
--

INSERT INTO `projectCollaborator` (`projectId`, `userId`, `isProjectManager`, `created_at`, `updated_at`) VALUES
('53c5456e-c40a-456b-9c30-b647fd1b4637', '52b3927e-6f55-4dac-9ecc-fc47f10170a3', 0, '2025-05-18 09:17:37.859', '2025-05-18 09:17:37.859'),
('53c5456e-c40a-456b-9c30-b647fd1b4637', '700d9d1e-e177-433c-898c-4db78fdc12dd', 1, '2025-05-18 09:17:37.859', '2025-05-18 09:17:37.859'),
('53c5456e-c40a-456b-9c30-b647fd1b4637', 'be4e3112-45fa-44ae-8048-aaeb9b8dd706', 0, '2025-05-18 09:17:37.859', '2025-05-18 09:17:37.859'),
('beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', '24a916f3-0a96-4bca-9b15-3c991455d0e6', 0, '2025-05-18 09:16:55.713', '2025-05-18 09:16:55.713'),
('beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', '447384ec-4fe3-4663-9807-5c02cddf07af', 0, '2025-05-18 09:16:55.713', '2025-05-18 09:16:55.713'),
('beb519c6-b78e-44c1-b9e5-22d33d8c6aa6', '700d9d1e-e177-433c-898c-4db78fdc12dd', 1, '2025-05-18 09:16:55.713', '2025-05-18 09:16:55.713');

-- --------------------------------------------------------

--
-- Table structure for table `token`
--

CREATE TABLE `token` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `token`
--

INSERT INTO `token` (`id`, `token`, `userId`, `created_at`, `updated_at`) VALUES
('1128a667-d0ba-46da-a4b6-e92aeead3a80', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODg1OTYzLCJleHAiOjE3NDk0OTA3NjN9.CNMPVkykY23FiH67nJD5P8SkJeJTXa9-W3cYIZ5DLbbF31KYc70qZQyJ02iIuHbKwQIofO5LrkklxOJLEerpcg', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 17:39:23.521', '2025-06-02 17:39:23.521'),
('200b0630-bea2-4903-baa4-0ba813c6f290', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4Nzk0NDE0LCJleHAiOjE3NDkzOTkyMTR9.bU2fzcEkddoGJ4BU-CI7sBqjZsWjJxf-paLnYmDOpKhs87CNZ3IYEJOQ5oSnMW8W7NeFv-Zpd_anI4l2hUPlJQ', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-01 16:13:34.909', '2025-06-01 16:13:34.909'),
('30775d4f-b8b5-4ffe-9fb8-16073097c248', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODg2MTk1LCJleHAiOjE3NDk0OTA5OTV9.TFQKr5xzHFUIJaBjVyTc4y04XkRDGu2KXhuJsgDTYe2VLqJEYfwaE66TUwJUlX3cY_I9t909ac1Eeb182xefVw', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 17:43:15.560', '2025-06-02 17:43:15.560'),
('34ac7e02-7a8e-42b9-96bd-30ab47159902', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODgzNTA3LCJleHAiOjE3NDk0ODgzMDd9.5wf73nJTDgn1W_bA3cS3OhgXfnjg_o_9Cyltxab56IoV2XXR7mIf1a2BALzs3E2POIIJ454qsF7yXdW76wPpWA', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 16:58:27.095', '2025-06-02 16:58:27.095'),
('38e9a835-b6e4-4dd4-ac21-c09ce35dd8b3', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4Nzk0NTI4LCJleHAiOjE3NDkzOTkzMjh9.2iOqgnJWkK1Yum4RvZeNDDQxOXOWRqkVaAo9PuRpf1XyzbIe0whK7VW5wo6Jjkd5m2xh2Xd3RZJZr6-1qCw54Q', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-01 16:15:28.799', '2025-06-01 16:15:28.799'),
('3bc13411-08d6-4b40-a056-5365c8d82513', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4Nzk0NjQxLCJleHAiOjE3NDkzOTk0NDF9.64wPzxTR6JsaWvkTxHkWVEgeMl__s4y8Ko-36ZZbssk88GjUGA3RyxLq6-xaVyM_FfLV2cKxvqf0p7COndmQtA', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-01 16:17:21.170', '2025-06-01 16:17:21.170'),
('3bea180c-91b9-4dac-ba0b-62faea152f28', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4Nzk0NDM3LCJleHAiOjE3NDkzOTkyMzd9.SbwhnAsWCK4SqcLllhzZ33yRsW97W2HPMCli_XWk4v8lxL4hhkFDwZczwn5QotGjVwp-Uhht9K0OVaJphjxr5w', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-01 16:13:57.977', '2025-06-01 16:13:57.977'),
('3f4d5681-1015-4f70-8efa-b3c3652c730f', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODc2ODE3LCJleHAiOjE3NDk0ODE2MTd9.zAAPct48Xi8k9qakP73kWegFTSWDg_rMZmFz_pjHIaCpG9iHJbQrx5A-pjigIEm4LO14b_DoLz_fKIKUmZVdGQ', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 15:06:57.665', '2025-06-02 15:06:57.665'),
('4a432e41-1352-42ff-802e-5ba65cc800b7', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODg1OTUxLCJleHAiOjE3NDk0OTA3NTF9.l9EIUlpT20GW6cQDVpsH2OouvFo4QRrkZxmgiBmOy3lWwdiEYs3lfDak3_7TdBFwU0GKslj_tjWFFJBsD4Qa7w', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 17:39:11.099', '2025-06-02 17:39:11.099'),
('4e9b9741-f249-45fc-b4a6-f2b18be2934d', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODg2MzQyLCJleHAiOjE3NDk0OTExNDJ9.D76xuTJkRa3YM8jL8HT6Wpr6HZ_mktZmSSEv3CCU8v589c2BSuRO2wdo5VSFNHSrU0cbm9mYxtq9A0yxd_koOQ', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 17:45:42.176', '2025-06-02 17:45:42.176'),
('57a7d66f-6a74-4450-aea3-aefda3776872', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODc2ODAzLCJleHAiOjE3NDk0ODE2MDN9.90wbZjJ-nbN_PJo7rB3SIRFUwO-1osRXwQKf4yiLsQoWeHsfWHfh9eJ86v0QqHcWc6-LYVbBbbwx2aag6CeD1g', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 15:06:43.636', '2025-06-02 15:06:43.636'),
('5f81c996-3263-454a-8594-777ee66072f5', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODg2MDQzLCJleHAiOjE3NDk0OTA4NDN9.nqVfRn5ZAgwwAdOLz4xMFKQSu8HFOly0yjkMZu-PuosGxTlMYhMtcc9rkspYQsQVcMIAjTgUmI3JnZFS6-X4kw', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 17:40:43.881', '2025-06-02 17:40:43.881'),
('621d9bd6-c436-4845-b820-8cfc8444b2b3', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODg2MDY4LCJleHAiOjE3NDk0OTA4Njh9.kp_e5i3jz_m21Tex24X9-JF1GxaUrcJRdmoLZEAJhnpEi7DjTC9a4nkHYc_wArdoRjpBTalqb5Pjl81qFlhz3A', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 17:41:08.383', '2025-06-02 17:41:08.383'),
('63495f4f-8486-44d1-848b-80426ffddbc7', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4Nzk0NDExLCJleHAiOjE3NDkzOTkyMTF9.pEEcYwbpzw374dKJkPG3M3LlfeqwN6hz10BF7qnC08SkIUPkBxAidR7PrlHUzqcOfBkmE5TuedXsCDua12nJVA', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-01 16:13:31.224', '2025-06-01 16:13:31.224'),
('66aa84d0-1c41-4d75-ad37-68c23a38d5fa', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4Nzk0NTU2LCJleHAiOjE3NDkzOTkzNTZ9.qcL5AQxaA7nqS635eeTGIstFHRsJOUM92ypcW6klL584haKB8HVu5LlWA_-Mhlba74WV97fDmH1JaOrOtcg_3Q', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-01 16:15:56.815', '2025-06-01 16:15:56.815'),
('6c3de9bf-63fc-4511-99ff-581bd2116eb2', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODg2MDM4LCJleHAiOjE3NDk0OTA4Mzh9.qAUqAUcJuKGS5Zvxf0E02_vdTJHHq49VSFuz8PYweLSBc3FL42t_y-j03-_sr4Q4fdwoI3pbAvkyJJEHF_LRuA', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 17:40:38.213', '2025-06-02 17:40:38.213'),
('7d81c41b-6803-4608-a023-b5e2cd7226d7', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4Nzk0NDM1LCJleHAiOjE3NDkzOTkyMzV9.JqG45SV2p-cP8yoL44JCQjQkogCXdJviqMXEmVNzdmnYbBOv9UhUaAeWanijQvOqVAzdOp03LC39ayCKCHl4uw', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-01 16:13:55.294', '2025-06-01 16:13:55.294'),
('7e41a357-3ce0-4673-b4ba-3034ffd9e394', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODg2MTE4LCJleHAiOjE3NDk0OTA5MTh9.j4j_PlZ_lNXdN9d0UltRnL9XiKotT4YXYqLt54mTv3fxcWJJfzflT1QcNKAgchkZwWJ1pDOqEoXS6k11JU4vlg', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 17:41:58.823', '2025-06-02 17:41:58.823'),
('802b9ddc-1220-4806-b7a2-78bfd57a5f32', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4Nzk0NDY3LCJleHAiOjE3NDkzOTkyNjd9.IYraHtAzKc9uw-cFj7yj26UC6oZ2kCpPmxwRwqVcVZRh4l7S5KHi90syF9PCaSpjD4RwK5MpUtDgVnpN7LRhdQ', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-01 16:14:27.250', '2025-06-01 16:14:27.250'),
('85685d0a-80c0-480e-81af-cb060650b29d', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODg2MDY1LCJleHAiOjE3NDk0OTA4NjV9.5LKkHVkkyfnu8RgsyKVYCDPdrSoMCInlTGk_uBCBHB3j4bf6kIz87AJj27jYnDXpB8IEivaX1eWD3C0EN94HsA', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 17:41:05.766', '2025-06-02 17:41:05.766'),
('88a5343d-e1dd-4566-bf44-64a36a3ec033', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4NzkzNjEzLCJleHAiOjE3NDkzOTg0MTN9.3M-8zzoMZLVNr_tAbduKVuJj5TeWLxDbhn2-RuFRsvnTfNPCETSzlJU5cyrK7zrs6y4ikPPHtvqUv6i1YHi9qQ', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-01 16:00:13.312', '2025-06-01 16:00:13.312'),
('91de2592-6c54-410e-9178-8e4969c137f3', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODg1NzA4LCJleHAiOjE3NDk0OTA1MDh9.soTBXH9f9YF7Q4Vn2Vo6AHM1q5lpc01fdhY7yxrgBZgLO5K6NMhPMsCbm2zR6SZrZKjmKquHnH9DnFD8LfYz3A', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 17:35:08.004', '2025-06-02 17:35:08.004'),
('9d635465-baef-43a3-bd0c-6efcb76ae0bc', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNTRmYjI4NGQtZDQ3ZS00ZGQ1LWE0ZTctZGMxNWI0ZTdlMWM1Iiwicm9sZSI6Ik1FTUJFUiJ9LCJpYXQiOjE3NDg4ODYzNTgsImV4cCI6MTc0OTQ5MTE1OH0.TzE9IqnhYOHxUTDzG_X10I81YD_nhg01SrH8At_Qv93KdBUiAdILy5FT88A67szkzeCuv0W9jTmqPuACg3dcAg', '54fb284d-d47e-4dd5-a4e7-dc15b4e7e1c5', '2025-06-02 17:45:58.111', '2025-06-02 17:45:58.111'),
('afd2fcc9-5d07-4328-8884-77b3017eb14c', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4Nzk0NjU2LCJleHAiOjE3NDkzOTk0NTZ9.6jLpWxXh2JkwxFXZ-Kc7qFlr3pX4TrpIjfHNs-YRu3h_ecikwkbQck_n4Md5tktiTKvXNtZD4MVeCgAO_WhbhQ', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-01 16:17:36.160', '2025-06-01 16:17:36.160'),
('b28a02fa-1e02-486f-8acd-4136af15255e', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODg2MDg2LCJleHAiOjE3NDk0OTA4ODZ9.lBd5-CwCf3h-4Na7qDUB4-FDZqWQrZ9PfLgPjFE7z_R7DxaUg-mdOaXpvqqtSLyiRIbSXVVnESPeqGXkND6hzw', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 17:41:26.355', '2025-06-02 17:41:26.355'),
('b367faf8-fafd-4c27-bbb7-411be4338110', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4Nzk0NTExLCJleHAiOjE3NDkzOTkzMTF9.w4AtaW67VD8CeYhVxpIrqHNHveqpL530MJAdtFV2SoQTLEN-fe3EtZnDVLDaUHyyqlit5sbetPuyHuMVBC7K6Q', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-01 16:15:11.292', '2025-06-01 16:15:11.292'),
('c0ed4696-319b-4caa-82a8-6fb2a1e3d01b', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4Nzk0NTgwLCJleHAiOjE3NDkzOTkzODB9.pL82THZJ83ywi9xFtC4TpT328NalVbowlSAkr4JmL2v5pCRVaFRnXBXIhODe_qCH0-3HwaxZb29wag8CwNXQIA', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-01 16:16:20.540', '2025-06-01 16:16:20.540'),
('e51f1c87-7d99-4e9b-afa7-77686251efb3', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODg2MjU0LCJleHAiOjE3NDk0OTEwNTR9.2WHPeFlepaOnR_2XBx2mhbl_7WagXq7KumJ7KP8rHk-m7YaVhC6gStgJLNCV5N2mOA1ey23dW2QLY9P6CIaTJQ', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 17:44:14.312', '2025-06-02 17:44:14.312'),
('e673a834-cbb3-43ea-a80f-4d3475fda932', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4ODc0MjI4LCJleHAiOjE3NDk0NzkwMjh9.J86OK-IzSeWPoGTA8WGyrwC8yRA6eOx6rMKpdvVo2aHQVstLsgfqpE7hKr2PehH397puaIAsDFQoKIxFFUdXUg', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-02 14:23:48.191', '2025-06-02 14:23:48.191'),
('fee07d3b-f9b6-4b2d-be72-44e4f29d75f0', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjp7ImlkIjoiNjI1YjgwZGUtMTgxMi00MGJmLTgzOTctZTlkOTEzMmZmM2ViIiwicm9sZSI6IlNVUEVSQURNSU4ifSwiaWF0IjoxNzQ4Nzk0NDMxLCJleHAiOjE3NDkzOTkyMzF9.5fsse-2fa7zZTrLmIMyWw9vd-rXBA0JZ8vuoll6zJ3qPLH7VnYQhK32Ybze2jWvD4jqu5dXW_NwcQnoq94ErLw', '625b80de-1812-40bf-8397-e9d9132ff3eb', '2025-06-01 16:13:51.439', '2025-06-01 16:13:51.439');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fullName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('SUPERADMIN','MEMBER','PM') COLLATE utf8mb4_unicode_ci NOT NULL,
  `divisionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `fullName`, `role`, `divisionId`, `created_at`, `updated_at`) VALUES
('24a916f3-0a96-4bca-9b15-3c991455d0e6', 'mhdulilabshar@example.com', '$2b$10$vtsG6DUGH0WpUdu4MQL/W.09Bc4QN0wmK0mdpGUExcvr7gIKXHd1y', 'Mhd Ulil Abshar', 'MEMBER', 'e0b4374f-3403-4e5d-97af-398e0cec468d', '2025-02-15 11:08:47.742', '2025-04-22 19:37:03.651'),
('447384ec-4fe3-4663-9807-5c02cddf07af', 'aliefadha@example.com', '$2b$10$HbkwXkK6AwIDIA7EqA5MTusGrGwNtBr0.4KmpUtpIkZ00EvphaSCC', 'Alief Adha', 'MEMBER', 'e0b4374f-3403-4e5d-97af-398e0cec468d', '2025-02-15 11:09:37.599', '2025-02-17 02:51:55.395'),
('48620d76-1a4a-49dc-ad17-50a3a3bf8854', 'nadiniannisabyant@example.com', '$2b$10$mtCNzpHXtSkEacWGvmUbkeDaepa0e9yOgv5mZyjJ31G7ZDmgp59wq', 'Nadini Annisa Byant', 'MEMBER', 'e0b4374f-3403-4e5d-97af-398e0cec468d', '2025-02-15 11:08:30.709', '2025-02-15 11:08:30.709'),
('52b3927e-6f55-4dac-9ecc-fc47f10170a3', 'iqbaldefriprasetya@example.com', '$2b$10$A/qfA5xeLyac3R3inm99KuKsvKdGasZcbzSgmropAH5A3pDoAKDki', 'Iqbal Defri Prasetya', 'MEMBER', 'e0b4374f-3403-4e5d-97af-398e0cec468d', '2025-02-15 11:08:39.931', '2025-02-15 11:08:39.931'),
('54fb284d-d47e-4dd5-a4e7-dc15b4e7e1c5', 'hagisirajsumanta@example.com', '$2b$10$RQbxJFoth8UBFJ5knEmCRuBo8lNUyBIXjjXNR.BNiTysTU8zFJMBa', 'Hagi Siraj Sumanta', 'MEMBER', 'bc2c2aeb-74d4-4238-a420-b01fe5e270a5', '2025-02-15 11:08:08.399', '2025-02-15 11:08:08.399'),
('625b80de-1812-40bf-8397-e9d9132ff3eb', 'superadmin@gmail.com', '$2b$10$2mTxKyjZnCYOOXzhc6R6cOsFvQbIbvUOWaDx2CY1z6Q77nMXmXboy', 'Super Admin', 'SUPERADMIN', NULL, '2025-02-13 17:29:22.447', '2025-02-13 17:29:22.447'),
('700d9d1e-e177-433c-898c-4db78fdc12dd', 'daffarizamuliya@example.com', '$2b$10$XKFNFpx7fHn7LCe4yaPkyul9bR2FR/8VvIav/Ta49o4LyEHy1b.tW', 'Daffa Riza Muliya', 'MEMBER', 'bc2c2aeb-74d4-4238-a420-b01fe5e270a5', '2025-02-15 11:07:53.390', '2025-02-15 11:07:53.390'),
('9637f8d1-8e31-4136-9fa3-7bb6716558b5', 'deliciasyifamaghfira@example.com', '$2b$10$DO10JavDmAMHbnZ3VIMEmuRM5gn7lseRtUnab6z1RUuHLoNOASkAS', 'Delicia Syifa Maghfira', 'MEMBER', 'e0b4374f-3403-4e5d-97af-398e0cec468d', '2025-02-15 11:09:50.281', '2025-02-15 11:09:50.281'),
('be4e3112-45fa-44ae-8048-aaeb9b8dd706', 'hamzahabdillaharif@example.com', '$2b$10$kzwYZWv7lkrFoxY3N5PdfOk0OHex7cKwP3XNkApqCSZvsTuSoNO9i', 'Hamzah Abdillah Arif', 'MEMBER', 'e0b4374f-3403-4e5d-97af-398e0cec468d', '2025-02-15 11:09:22.744', '2025-02-15 11:09:22.744'),
('c1744d47-0ce6-4e45-adf1-ed4b13c6e916', 'fajaralifriyandi@example.com', '$2b$10$h84rsovt7OLI4BVZyHTAqeHcEvA6uk08rskLaQGMo9wxpt5IUAjcq', 'Fajar Alif Riyandi', 'MEMBER', 'e0b4374f-3403-4e5d-97af-398e0cec468d', '2025-02-15 11:08:57.990', '2025-02-15 11:08:57.990'),
('f7e2f29b-c164-496d-a617-2559b296e1cb', 'muhammadfaizabrar@example.com', '$2b$10$rvcos0F2JC5Ugpf0GY7uDO0hFDtL2QNf8CUgVGz3NVHcOcol8JBOS', 'Muhammad Faiz Abrar', 'MEMBER', 'bc2c2aeb-74d4-4238-a420-b01fe5e270a5', '2025-02-15 11:08:21.023', '2025-02-15 11:08:21.023');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('31760969-9849-4b8e-8264-bc5f6b79ea17', '714a6947ac56057e156c843991847b9542c1463fefbd79504ce0baf9d3063cfb', '2025-02-13 17:23:21.921', '20250210133409_tes', NULL, NULL, '2025-02-13 17:23:21.916', 1),
('70f26a99-fa81-4e78-88da-8c73eae1510a', 'b286f9d56211131b5bf46a16f087fa8e3c6ab79db70f7fbe915545529faf9d28', '2025-02-13 17:23:29.399', '20250213172329_mac_migrate', NULL, NULL, '2025-02-13 17:23:29.280', 1),
('91d9333c-eddc-49af-99a2-8e95b26c79ee', '4bc0d52981749ca463049ee8e7f35fbd78ddf3d45e45bdc303a36c3270567d08', '2025-02-13 17:23:21.936', '20250211140807_nope', NULL, NULL, '2025-02-13 17:23:21.921', 1),
('9ee751cc-908d-47b5-98b9-4f2239d7932a', 'abb0274f8a63d46d474d38033727ef49d64c028505ddb9b7f5eb1d3fca608087', '2025-02-13 17:23:21.887', '20241221112535_change_field_divisioo', NULL, NULL, '2025-02-13 17:23:21.870', 1),
('a38cd08c-a315-4bd2-9787-f9ee19bbeb04', 'c7c25961a70bc9fab2ed67a22c7043a214070809f486d95228d308816e03be86', '2025-02-13 17:23:21.699', '20241221092600_create_db', NULL, NULL, '2025-02-13 17:23:21.563', 1),
('a48d3ff7-1252-43ef-bb3d-d00ed6e07475', '0f8d6329d95a1180f46547296a985c3f0d8b296ecae966cadea383db59835af4', '2025-02-13 17:23:21.718', '20241221100216_add_model_token', NULL, NULL, '2025-02-13 17:23:21.700', 1),
('a6fef3d5-c756-4cb2-878e-8303cddb3668', 'c4b5cb9d3869bf1b0ea07eb76dbdc57552d3c7c2466eaf93f02e5d174276874d', '2025-02-13 17:23:21.915', '20241221112754_change_field_assestment', NULL, NULL, '2025-02-13 17:23:21.887', 1),
('d9f1b520-214a-4f1c-876c-0118dcf9915a', 'ecd1f47c7aacbff6c83b50486c27f9c0970057ac7b2e6d10d8498ec5c0fe30ec', '2025-02-13 17:23:21.822', '20241221100455_add_field', NULL, NULL, '2025-02-13 17:23:21.718', 1),
('df74a510-cc15-46de-98ac-92b64700820e', '72d6ac086f3189811dd94d2e1537f6a6770f01b2ce24701c1757ba32897f0ca0', '2025-02-13 17:23:21.870', '20241221111536_change_field', NULL, NULL, '2025-02-13 17:23:21.823', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assesment`
--
ALTER TABLE `assesment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assesment_projectId_fkey` (`projectId`),
  ADD KEY `assesment_metricId_fkey` (`metricId`);

--
-- Indexes for table `assesmentResult`
--
ALTER TABLE `assesmentResult`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assesmentResult_assesmentId_fkey` (`assesmentId`);

--
-- Indexes for table `division`
--
ALTER TABLE `division`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `division_divisionName_key` (`divisionName`);

--
-- Indexes for table `metric`
--
ALTER TABLE `metric`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `metric_kodeKpi_key` (`kodeKpi`);

--
-- Indexes for table `metricNormalization`
--
ALTER TABLE `metricNormalization`
  ADD PRIMARY KEY (`id`),
  ADD KEY `metricNormalization_assesmentId_fkey` (`assesmentId`);

--
-- Indexes for table `metricResult`
--
ALTER TABLE `metricResult`
  ADD PRIMARY KEY (`id`),
  ADD KEY `metricResult_assesmentId_fkey` (`assesmentId`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projectCollaborator`
--
ALTER TABLE `projectCollaborator`
  ADD PRIMARY KEY (`projectId`,`userId`),
  ADD KEY `projectCollaborator_userId_fkey` (`userId`);

--
-- Indexes for table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `token_userId_fkey` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_email_key` (`email`),
  ADD KEY `user_divisionId_fkey` (`divisionId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assesment`
--
ALTER TABLE `assesment`
  ADD CONSTRAINT `assesment_metricId_fkey` FOREIGN KEY (`metricId`) REFERENCES `metric` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `assesment_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `assesmentResult`
--
ALTER TABLE `assesmentResult`
  ADD CONSTRAINT `assesmentResult_assesmentId_fkey` FOREIGN KEY (`assesmentId`) REFERENCES `assesment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `metricNormalization`
--
ALTER TABLE `metricNormalization`
  ADD CONSTRAINT `metricNormalization_assesmentId_fkey` FOREIGN KEY (`assesmentId`) REFERENCES `assesment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `metricResult`
--
ALTER TABLE `metricResult`
  ADD CONSTRAINT `metricResult_assesmentId_fkey` FOREIGN KEY (`assesmentId`) REFERENCES `assesment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `projectCollaborator`
--
ALTER TABLE `projectCollaborator`
  ADD CONSTRAINT `projectCollaborator_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `projectCollaborator_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `division` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

-- Create assesmentNonDev table
CREATE TABLE `assesmentNonDev` (
    `id` VARCHAR(191) NOT NULL,
    `metricId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `value` INTEGER NOT NULL,
    `assesmentDate` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add assesmentNonDevId to assesmentResult
ALTER TABLE `assesmentResult`
  ADD COLUMN `assesmentNonDevId` VARCHAR(191) NULL,
  ADD KEY `assesmentResult_assesmentNonDevId_fkey` (`assesmentNonDevId`);

-- Add assesmentNonDevId to metricNormalization
ALTER TABLE `metricNormalization`
  ADD COLUMN `assesmentNonDevId` VARCHAR(191) NULL,
  ADD KEY `metricNormalization_assesmentNonDevId_fkey` (`assesmentNonDevId`);

-- Add assesmentNonDevId to metricResult
ALTER TABLE `metricResult`
  ADD COLUMN `assesmentNonDevId` VARCHAR(191) NULL,
  ADD KEY `metricResult_assesmentNonDevId_fkey` (`assesmentNonDevId`);

-- Add foreign key constraints
ALTER TABLE `assesmentNonDev`
  ADD CONSTRAINT `assesmentNonDev_metricId_fkey` FOREIGN KEY (`metricId`) REFERENCES `metric`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `metricResult`
  ADD CONSTRAINT `metricResult_assesmentNonDevId_fkey` FOREIGN KEY (`assesmentNonDevId`) REFERENCES `assesmentNonDev`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `metricNormalization`
  ADD CONSTRAINT `metricNormalization_assesmentNonDevId_fkey` FOREIGN KEY (`assesmentNonDevId`) REFERENCES `assesmentNonDev`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `assesmentResult`
  ADD CONSTRAINT `assesmentResult_assesmentNonDevId_fkey` FOREIGN KEY (`assesmentNonDevId`) REFERENCES `assesmentNonDev`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Add foreign key constraints
ALTER TABLE `assesmentNonDev`
  ADD CONSTRAINT `assesmentNonDev_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
