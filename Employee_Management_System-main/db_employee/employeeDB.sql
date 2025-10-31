-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: employee
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `employee_name` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (2,'2025-09-06','John','Present'),(4,'2025-09-07','Dohn','Absent'),(5,'2025-09-10','Saya','Present'),(6,'2025-10-26','Christy','Present'),(7,'2025-10-28','John Smith','Present'),(8,'2025-10-28','Sarah Johnson','Present'),(9,'2025-10-28','Michael Brown','Present'),(10,'2025-10-28','Emily Davis','Absent'),(11,'2025-10-28','David Wilson','Present'),(12,'2025-10-28','Jennifer Martinez','Present'),(13,'2025-10-28','James Anderson','Present'),(14,'2025-10-28','Lisa Taylor','Leave'),(15,'2025-10-28','Robert Thomas','Present'),(16,'2025-10-28','Maria Garcia','Present'),(17,'2025-10-30','John Smith','Present'),(18,'2025-10-29','Sarah Johnson','Present'),(19,'2025-10-29','Michael Brown','Absent'),(20,'2025-10-29','Emily Davis','Present'),(21,'2025-10-29','David Wilson','Present'),(22,'2025-10-29','Jennifer Martinez','Leave'),(23,'2025-10-29','James Anderson','Present'),(24,'2025-10-29','Lisa Taylor','Present'),(25,'2025-10-29','Robert Thomas','Present'),(26,'2025-10-29','Maria Garcia','Present');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_1t68827l97cwyxo9r1u6t4p7d` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `department` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (3,'Electrical','thusha@gmail.com','Thusha','0726838853'),(15,'computer','sayanthavitharmaa13@gmail.com','Shayanthavi Tharmananthan','0763650199'),(17,'Finance','john.smith@example.com','John Smith','9876543210'),(18,'civil','tiya@gmail.com','Tiya','564783928765748'),(19,'computer Engineering','dsahjj@gmail.com','Christy','564372819`0'),(20,'Engineering','john.smith@company.com','John Smith','555-0101'),(21,'Marketing','sarah.johnson@company.com','Sarah Johnson','555-0102'),(22,'Sales','michael.brown@company.com','Michael Brown','555-0103'),(23,'Engineering','emily.davis@company.com','Emily Davis','555-0104'),(24,'HR','david.wilson@company.com','David Wilson','555-0105'),(25,'Finance','jennifer.martinez@company.com','Jennifer Martinez','555-0106'),(26,'Engineering','james.anderson@company.com','James Anderson','555-0107'),(27,'Marketing','lisa.taylor@company.com','Lisa Taylor','555-0108'),(28,'Sales','robert.thomas@company.com','Robert Thomas','555-0109'),(29,'Engineering','maria.garcia@company.com','Maria Garcia','555-0110'),(30,'IT','william.lee@company.com','William Lee','555-0111'),(31,'HR','patricia.white@company.com','Patricia White','555-0112'),(32,'Finance','christopher.harris@company.com','Christopher Harris','555-0113'),(33,'Marketing','linda.clark@company.com','Linda Clark','555-0114'),(34,'Sales','daniel.lewis@company.com','Daniel Lewis','555-0115'),(35,'Engineering','barbara.robinson@company.com','Barbara Robinson','555-0116'),(36,'IT','matthew.walker@company.com','Matthew Walker','555-0117'),(37,'HR','susan.hall@company.com','Susan Hall','555-0118'),(38,'Finance','joseph.allen@company.com','Joseph Allen','555-0119'),(39,'Marketing','jessica.young@company.com','Jessica Young','555-0120');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_request`
--

DROP TABLE IF EXISTS `leave_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_request` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `employee_name` varchar(255) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_request`
--

LOCK TABLES `leave_request` WRITE;
/*!40000 ALTER TABLE `leave_request` DISABLE KEYS */;
INSERT INTO `leave_request` VALUES (1,'John Doe','2025-09-18','Medical leave','2025-09-15','Pending'),(2,'John Doe','2025-09-18','Medical leave','2025-09-15','Aproved'),(3,'Saya','2025-09-03','Sick','2025-09-01','Approved'),(4,'John Doee','2025-09-18','Sick','2025-09-15','Pending'),(5,'John Smith','2025-11-07','Vacation','2025-11-05','Approved'),(6,'Sarah Johnson','2025-11-12','Personal','2025-11-10','Pending'),(7,'Michael Brown','2025-10-26','Sick Leave','2025-10-25','Approved'),(8,'Emily Davis','2025-11-18','Family Emergency','2025-11-15','Pending'),(9,'David Wilson','2025-12-05','Vacation','2025-12-01','Pending'),(10,'Jennifer Martinez','2025-10-29','Medical Appointment','2025-10-28','Approved'),(11,'James Anderson','2025-11-22','Personal','2025-11-20','Pending'),(12,'Lisa Taylor','2025-10-31','Sick Leave','2025-10-30','Approved'),(13,'Robert Thomas','2025-11-10','Vacation','2025-11-08','Approved'),(14,'Maria Garcia','2025-12-15','Wedding','2025-12-10','Pending'),(15,'William Lee','2025-11-03','Personal','2025-11-01','Approved'),(16,'Patricia White','2025-11-14','Family Event','2025-11-12','Pending'),(17,'Christopher Harris','2025-10-28','Sick Leave','2025-10-27','Approved'),(18,'Linda Clark','2025-11-27','Vacation','2025-11-25','Pending'),(19,'Daniel Lewis','2025-12-07','Medical Leave','2025-12-05','Pending'),(20,'Barbara Robinson','2025-11-20','Personal','2025-11-18','Approved'),(21,'Matthew Walker','2025-11-01','Sick Leave','2025-10-31','Approved'),(22,'Susan Hall','2025-11-24','Vacation','2025-11-22','Pending'),(23,'Joseph Allen','2025-12-10','Family Emergency','2025-12-08','Pending'),(24,'Jessica Young','2025-11-30','Personal','2025-11-28','Pending');
/*!40000 ALTER TABLE `leave_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser@example.com','$2a$10$z8YX6sc/FnkdpZ8yU7anwOD4ut3pdZeJTwBYFB7o4n.u4J0/C.WVa','testuser'),(2,'user1@gmail.com','$2a$10$gWiDCG3wWWKK7YbQmuJVdeEm/LRZAI0lyCxBoHQSkHIqPZASTbglu','User1'),(3,'user2@gmail.com','$2a$10$Gx0VsqNUxJSM8GMggZD4BulesrynDXl/rduKQ0utV6FW53nIsQusm','User2');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-31 11:46:03
