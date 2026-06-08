-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 08, 2026 at 03:43 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_heart_prediction`
--

-- --------------------------------------------------------

--
-- Table structure for table `prediction_history`
--

CREATE TABLE `prediction_history` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `age` float NOT NULL,
  `trestbps` float NOT NULL,
  `chol` float NOT NULL,
  `thalach` float NOT NULL,
  `oldpeak` float NOT NULL,
  `cp` int NOT NULL,
  `ca` int NOT NULL,
  `thal` int NOT NULL,
  `exang` int NOT NULL,
  `prediction` int NOT NULL,
  `probability` float NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `prediction_history`
--

INSERT INTO `prediction_history` (`id`, `user_id`, `age`, `trestbps`, `chol`, `thalach`, `oldpeak`, `cp`, `ca`, `thal`, `exang`, `prediction`, `probability`, `created_at`) VALUES
(1, 1, 45, 120, 200, 150, 1.5, 0, 1, 0, 0, 0, 86, '2026-06-07 16:47:07'),
(2, 1, 45, 120, 200, 98, 1.5, 1, 1, 0, 0, 0, 68, '2026-06-07 16:48:22'),
(3, 1, 45, 100, 200, 130, 2.5, 2, 1, 2, 1, 1, 83, '2026-06-07 16:54:37'),
(4, 1, 45, 130, 200, 150, 1.5, 0, 1, 0, 0, 0, 86, '2026-06-07 16:55:27'),
(5, 1, 45, 120, 200, 150, 1.6, 1, 0, 0, 0, 0, 95, '2026-06-07 16:58:48'),
(6, 1, 45, 120, 200, 150, 1.5, 2, 0, 0, 0, 0, 95, '2026-06-07 17:07:36'),
(7, 2, 45, 120, 200, 150, 1.5, 2, 0, 1, 0, 0, 76, '2026-06-07 17:10:57'),
(8, 1, 45, 120, 200, 150, 1.3, 0, 2, 1, 0, 0, 60, '2026-06-08 03:18:41');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `username`, `password_hash`, `created_at`, `updated_at`) VALUES
(1, 'kiki', 'kiki@gmail.com', 'kiki', 'scrypt:32768:8:1$WfDCYQpHInSBHHLf$682f5424ddcb3bc628a9cad69951e5e0b97c13cbe5eb2f0820256fb0cac56b797f6b78698fb8e2634de3c91ea16d83435ae441d4ebf9ecda7f6ae711c0d4a471', '2026-06-07 16:19:54', '2026-06-07 16:19:54'),
(2, 'paat', 'paat@gmail.com', 'paat', 'scrypt:32768:8:1$rLyvlUKXoNxiTuiK$ccbc9f286b3de07be29f1da862ccd90e2f4b6085ce8392fa3066aaff6181545e0b2b9606ec5decc2275a8463ba933d8719134cd0c3757b5de8bcb8821b822905', '2026-06-07 17:09:08', '2026-06-07 17:09:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `prediction_history`
--
ALTER TABLE `prediction_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `prediction_history`
--
ALTER TABLE `prediction_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `prediction_history`
--
ALTER TABLE `prediction_history`
  ADD CONSTRAINT `prediction_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
