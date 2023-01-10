-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Jan 02, 2023 at 03:50 PM
-- Server version: 8.0.31
-- PHP Version: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stock_exchange`
--

-- --------------------------------------------------------

--
-- Table structure for table `db-test`
--

CREATE TABLE `db-test` (
  `id` int NOT NULL,
  `name` varchar(20) NOT NULL,
  `text` varchar(1200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `db-test`
--

INSERT INTO `db-test` (`id`, `name`, `text`) VALUES
(1, 'test1', 'test testeusqldfjq lkjhlsqjkh lkjlcjsd luhjjlksdq'),
(2, 'test2', 'testb ljhjlk mpqsdhc lihmqschj oihuljqhsdc uqoshdcqsjch ljljkhdsq^d anaas kbir youec lhjslkn '),
(3, 'test3', 'klndklk ankn mosdm: mlkjdsfm= m=knqsdmkfjdkfhj jbdslnf:'),
(4, 'test1', 'test testeusqldfjq lkjhlsqjkh lkjlcjsd luhjjlksdq'),
(5, 'test2', 'testb ljhjlk mpqsdhc lihmqschj oihuljqhsdc uqoshdcqsjch ljljkhdsq^d anaas kbir youec lhjslkn '),
(6, 'test3', 'klndklk ankn mosdm: mlkjdsfm= m=knqsdmkfjdkfhj jbdslnf:');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `db-test`
--
ALTER TABLE `db-test`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `db-test`
--
ALTER TABLE `db-test`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
