-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 11, 2022 at 03:29 AM
-- Server version: 8.0.23
-- PHP Version: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `showcase`
--

DROP DATABASE IF EXISTS SHOWCASE;
CREATE DATABASE SHOWCASE;
USE SHOWCASE;

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `Account_ID` int NOT NULL,
  `Email` varchar(25) NOT NULL,
  `Password` varchar(25) NOT NULL,
  `First_Name` varchar(25) NOT NULL,
  `Last_Name` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`Account_ID`, `Email`, `Password`, `First_Name`, `Last_Name`) VALUES
(1, 'johndoe@email.com', 'john123', 'John', 'Doe');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `Post_ID` int NOT NULL,
  `Profile_ID` int NOT NULL,
  `Account_ID` int NOT NULL,
  `Title` varchar(50),
  `Caption` varchar(250) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`Post_ID`, `Profile_ID`, `Account_ID`, `Title`, `Caption`) VALUES
(1, 1, 1, 'Automated Robot', 'look at this cool robot I built'),
(2, 1, 1, 'Hackathon', 'participated in a hackathon this weekend!');
-- --------------------------------------------------------

--
-- Table structure for table `post_photos`
--

CREATE TABLE `post_photos` (
  `Post_ID` int NOT NULL,
  `Profile_ID` int NOT NULL,
  `Account_ID` int NOT NULL,
  `Photo_URL` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `post_photos`
--

-- INSERT INTO `post_photos` (`Post_ID`, `Profile_ID`, `Account_ID`, `Photo_URL`) VALUES
-- (1, 1, 1, 'a/photo/url/here');
-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `Profile_ID` int NOT NULL,
  `Account_ID` int NOT NULL,
  `Profile_Picture_URL` varchar(300),
  `Degree` varchar(50),
  `Biography` varchar(250),
  `Resume` varchar(50),
  `LinkedIn` varchar(50),
  `GitHub` varchar(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`Profile_ID`, `Account_ID`, `Profile_Picture_URL`, `Degree`, `Biography`, `Resume`, `LinkedIn`, `GitHub`) VALUES
(1, 1, NULL, 'Software Engineering', 'hello there', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`Account_ID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`Post_ID`,`Profile_ID`,`Account_ID`),
  ADD KEY `Post_ProfileID_FK` (`Profile_ID`),
  ADD KEY `Post_AccountID_FK` (`Account_ID`);

--
-- Indexes for table `post_photos`
--
ALTER TABLE `post_photos`
  ADD PRIMARY KEY (`Post_ID`,`Profile_ID`,`Account_ID`,`Photo_URL`),
  ADD KEY `PostPhotos_ProfileID_FK` (`Profile_ID`),
  ADD KEY `PostPhotos_AccountID_FK` (`Account_ID`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`Profile_ID`,`Account_ID`),
  ADD KEY `Profile_AccountID_FK` (`Account_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `Account_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `Post_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `Profile_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--


--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `Post_AccountID_FK` FOREIGN KEY (`Account_ID`) REFERENCES `profile` (`Account_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Post_ProfileID_FK` FOREIGN KEY (`Profile_ID`) REFERENCES `profile` (`Profile_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post_photos`
--
ALTER TABLE `post_photos`
  ADD CONSTRAINT `PostPhotos_AccountID_FK` FOREIGN KEY (`Account_ID`) REFERENCES `account` (`Account_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `PostPhotos_PostID_FK` FOREIGN KEY (`Post_ID`) REFERENCES `post` (`Post_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `PostPhotos_ProfileID_FK` FOREIGN KEY (`Profile_ID`) REFERENCES `profile` (`Profile_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `Profile_AccountID_FK` FOREIGN KEY (`Account_ID`) REFERENCES `account` (`Account_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
