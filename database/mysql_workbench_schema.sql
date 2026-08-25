-- NexziByte TechTalk database
-- Import this file in MySQL Workbench: File > Open SQL Script, then run it.
-- Requires MySQL 8.0 or later.

CREATE DATABASE IF NOT EXISTS `nexzibyte_techtalk`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `nexzibyte_techtalk`;

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'user',
  `bio` TEXT NULL,
  `skills` TEXT NULL,
  `location` VARCHAR(120) NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB;

CREATE TABLE `categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL,
  `description` TEXT NULL,
  `is_archived` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_name` (`name`),
  UNIQUE KEY `uq_categories_slug` (`slug`)
) ENGINE=InnoDB;

CREATE TABLE `posts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `author_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `content` TEXT NOT NULL,
  `tags` VARCHAR(500) NULL,
  `cover_image` VARCHAR(500) NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'draft',
  `is_archived` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_posts_author_id` (`author_id`),
  KEY `ix_posts_category_id` (`category_id`),
  CONSTRAINT `fk_posts_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_posts_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_comments_user_id` (`user_id`),
  KEY `ix_comments_post_id` (`post_id`),
  CONSTRAINT `fk_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_comments_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `reactions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  `reaction_type` VARCHAR(20) NOT NULL DEFAULT 'like',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reactions_user_post` (`user_id`, `post_id`),
  KEY `ix_reactions_post_id` (`post_id`),
  CONSTRAINT `fk_reactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_reactions_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `saved_posts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `post_id` INT NOT NULL,
  `saved_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_saved_posts_user_post` (`user_id`, `post_id`),
  KEY `ix_saved_posts_post_id` (`post_id`),
  CONSTRAINT `fk_saved_posts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_saved_posts_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `speakers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `photo` VARCHAR(500) NULL,
  `designation` VARCHAR(150) NOT NULL,
  `company` VARCHAR(150) NULL,
  `expertise` TEXT NULL,
  `biography` TEXT NULL,
  `professional_links` TEXT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `summits` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `banner` VARCHAR(500) NULL,
  `date` DATE NOT NULL,
  `time` TIME NULL,
  `location` VARCHAR(150) NULL,
  `agenda` TEXT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'upcoming',
  `is_published` BOOLEAN NOT NULL DEFAULT FALSE,
  `venue` VARCHAR(200) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `founder_meets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `banner` VARCHAR(500) NULL,
  `date` DATE NOT NULL,
  `time` TIME NULL,
  `location` VARCHAR(150) NULL,
  `agenda` TEXT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'upcoming',
  `is_published` BOOLEAN NOT NULL DEFAULT FALSE,
  `founder_information` TEXT NULL,
  `networking_info` TEXT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `summit_speakers` (
  `summit_id` INT NOT NULL,
  `speaker_id` INT NOT NULL,
  PRIMARY KEY (`summit_id`, `speaker_id`),
  KEY `ix_summit_speakers_speaker_id` (`speaker_id`),
  CONSTRAINT `fk_summit_speakers_summit` FOREIGN KEY (`summit_id`) REFERENCES `summits` (`id`),
  CONSTRAINT `fk_summit_speakers_speaker` FOREIGN KEY (`speaker_id`) REFERENCES `speakers` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `founder_meet_speakers` (
  `founder_meet_id` INT NOT NULL,
  `speaker_id` INT NOT NULL,
  PRIMARY KEY (`founder_meet_id`, `speaker_id`),
  KEY `ix_founder_meet_speakers_speaker_id` (`speaker_id`),
  CONSTRAINT `fk_founder_meet_speakers_meet` FOREIGN KEY (`founder_meet_id`) REFERENCES `founder_meets` (`id`),
  CONSTRAINT `fk_founder_meet_speakers_speaker` FOREIGN KEY (`speaker_id`) REFERENCES `speakers` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `registrations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `event_type` VARCHAR(20) NOT NULL,
  `event_id` INT NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'registered',
  `registered_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_registrations_user_event` (`user_id`, `event_type`, `event_id`),
  CONSTRAINT `fk_registrations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;
